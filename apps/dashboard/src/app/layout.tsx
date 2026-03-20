import "ui/src/styles/globals.css";

import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Toaster } from "ui";

import { SessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AccStudio — Dijital Hizmetlerin Komuta Merkezi",
  description: "Markalar, ajanslar ve freelancer'ları buluşturan şeffaf ve güvenilir SaaS platformu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} ${manrope.variable} font-inter antialiased`}>
        <ThemeProvider defaultTheme="dark" attribute="class">
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
