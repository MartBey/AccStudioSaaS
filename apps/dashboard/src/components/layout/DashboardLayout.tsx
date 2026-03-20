"use client";

import { NavItem } from "@/config/navigation";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
}

export function DashboardLayout({ children, navItems }: DashboardLayoutProps) {
  return (
    // Base Layer: surface (#0e0e0e) — global background
    <div className="flex min-h-screen w-full surface">
      {/* Sectional Layer: surface-low (#131313) — sidebar zone */}
      <Sidebar items={navItems} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header items={navItems} />

        {/* Main: base surface with generous 5-6rem breathing space */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-8 md:py-10 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
