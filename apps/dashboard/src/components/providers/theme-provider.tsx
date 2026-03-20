"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  attribute?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  attribute = "class",
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute as any}
      defaultTheme={defaultTheme}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
