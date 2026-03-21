import { cookies } from "next/headers";
import { jwtVerify, JWTPayload } from "jose";

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || process.env.AUTH_SECRET
);

export interface ClientSession extends JWTPayload {
  clientId: string;
  projectId: string;
  agencyId: string;
  type: "client_session";
}

export async function getClientSession(): Promise<ClientSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("client_session")?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, SESSION_SECRET);

    if (payload.type !== "client_session") {
      return null;
    }

    return payload as ClientSession;
  } catch (error) {
    return null;
  }
}
