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
    <div className="flex min-h-screen w-full bg-slate-50/50 dark:bg-slate-950">
      <Sidebar items={navItems} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header items={navItems} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
