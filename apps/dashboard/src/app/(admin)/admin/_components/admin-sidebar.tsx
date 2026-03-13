"use client";

import {
  ActivitySquare,
  BarChart3,
  Brain,
  LayoutDashboard,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "ui";

const NAV_ITEMS = [
  { title: "Genel Bakış", url: "/admin", icon: LayoutDashboard, exact: true },
  { title: "Aktivite Akışı", url: "/admin/logs", icon: ActivitySquare },
  { title: "Kullanıcılar", url: "/admin/users", icon: Users },
  { title: "Doğrulamalar", url: "/admin/verification", icon: ShieldCheck },
  { title: "Uyuşmazlıklar", url: "/admin/disputes", icon: ShieldAlert },
  { title: "Finans", url: "/admin/finance", icon: BarChart3 },
  { title: "AI Maliyetler", url: "/admin/ai-costs", icon: Brain },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/20">
          <ActivitySquare className="h-4 w-4 text-primary" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">The Oversight</p>
          <p className="text-[10px] text-muted-foreground">Admin Paneli</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact ? pathname === item.url : pathname.startsWith(item.url);
          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.title}</span>
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}
