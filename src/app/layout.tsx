import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
});

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Milestack",
  description: "The client collaboration workspace for modern web agencies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${sans.variable} ${display.variable} ${mono.variable}`}
    >
      <body
        className="scroll-smooth w-full overflow-auto antialiased box selection_color bg-background text-foreground"
        cz-shortcut-listen="true"
      >
        <NextTopLoader
          color="var(--accent)"
          height={2}
          showSpinner={false}
        />
        <SessionProvider>{children}</SessionProvider> <Toaster />
      </body>
    </html>
  );
}

