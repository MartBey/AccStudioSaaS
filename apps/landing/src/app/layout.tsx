import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "ui/src/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AccStudio",
  description: "Markalar, Ajanslar ve Freelancerlar için hepsi bir arada platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
