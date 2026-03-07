"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "ui";
import * as LucideIcons from "lucide-react";
import { NavItem } from "@/config/navigation";

interface SidebarProps {
  items: NavItem[];
  collapsed?: boolean;
}

export function Sidebar({ items, collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav className={cn(
      "hidden md:flex flex-col gap-2 p-4 border-r bg-card/50 backdrop-blur-sm min-h-screen",
      collapsed ? "w-20 items-center" : "w-64"
    )}>
      <div className="flex h-14 items-center mb-6 pl-2">
        <h2 className={cn("font-bold text-2xl text-primary", collapsed && "hidden")}>
          AccStudio
        </h2>
        {collapsed && <span className="font-bold text-2xl text-primary text-center w-full">AS</span>}
      </div>

      <div className="flex-1 space-y-1">
        {items.map((item, index) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          // @ts-ignore
          const IconComponent = (LucideIcons[item.icon as keyof typeof LucideIcons] || LucideIcons.Circle) as React.ElementType;
          
          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:text-primary",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
                collapsed && "justify-center px-0"
              )}
            >
              <IconComponent className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
