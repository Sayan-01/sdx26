import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Cradentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = credentials.email as string;
        const password = credentials.password as string;

        if (!email || !password) {
          throw new Error("Please fill all fields");
        }
        const user = await prisma.user.findUnique({
          where: {
            email: email as string,
          },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
            agencyId: true,

          },
        });
        if (!user) {
          throw new Error("User not found");
        }

        const isAuth = await bcrypt.compare(password, user.password as string);
        if (!isAuth) {
          throw new Error("Password does not match");
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider === "google" || account?.provider === "github") {
        const { email, name, image } = user;

        if (email && name && image) {
          const alreadyUser = await prisma.user.findUnique({
            where: { email },
            select: {
              email: true,
            },
          });
          if (alreadyUser) {
            return true;
          } else if (!alreadyUser) {
            await prisma.user.create({
              data: {
                email,
                name: name,
                avatarUrl: image,
                role: "OWNER",
                agencyId: null
              },
            });
          }
          return true;
        } 
        else return false;
      }
      return true;
    },
    jwt: async ({ token, user, trigger, session }) => {
      // If the user is signing in for the first time, or there's an existing user
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.agencyId) token.agencyId = session.agencyId;
        if (session.agencySlug) token.agencySlug = session.agencySlug;
        if (session.avatarUrl) token.avatarUrl = session.avatarUrl;
        if (session.activePlan) token.activePlan = session.activePlan;
      }

      if (user) {
        const alreadyUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: {
            id: true,
            name: true,
            role: true,
            agencyId: true, // ✅
            avatarUrl: true,
            agency: {
              select: {
                slug: true,
                activePlan: true,
              },
            },
          },
        });

        // If user exists, populate the token with user info
        if (alreadyUser) {
          token.id = alreadyUser.id;
          token.name = alreadyUser.name as string;
          token.role = alreadyUser.role; 
          token.avatarUrl = alreadyUser.avatarUrl;
          token.agencyId = alreadyUser.agencyId;
          token.agencySlug = alreadyUser.agency?.slug as string;
          token.activePlan = alreadyUser.agency?.activePlan || "basic";
        }
      }
      return token; // Return the updated token
    },
    session: async ({ session, token }) => {
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.role = token.role as string;
        session.user.avatarUrl = token.avatarUrl;
        session.user.agencyId = token.agencyId;
        session.user.agencySlug = token.agencySlug;
        session.user.activePlan = token.activePlan as string | null;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
