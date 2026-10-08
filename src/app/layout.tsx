import type { Metadata } from "next";
import { Geist, Geist_Mono, Google_Sans, Poppins } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "../../auth";
import { Analytics } from "@vercel/analytics/next"

const main = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Milestack",
  description: "The client collaboration workspace for modern web agencies.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="en"
      className="dark"
    >
      <body
        className={` scroll-smooth w-full overflow-auto antialiased box selection_color bg-zinc-950 ${main.className}`}
        cz-shortcut-listen="true"
      >
        <NextTopLoader
          color="#ffffff"
          height={2}
          showSpinner={false}
        />
        <SessionProvider session={session}>{children}</SessionProvider> <Toaster />
      <Analytics />
      </body>
    </html>
  );
}