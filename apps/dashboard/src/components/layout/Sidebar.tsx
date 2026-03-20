"use client";

import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "ui";

import { NavItem } from "@/config/navigation";

interface SidebarProps {
  items: NavItem[];
  collapsed?: boolean;
}

export function Sidebar({ items, collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        // Surface-low (#131313) per design: Sectional Layer
        "hidden min-h-screen flex-col surface-low md:flex",
        collapsed ? "w-20 items-center" : "w-64"
      )}
    >
      {/* Logo — no border below, use spacing gap per design */}
      <div className={cn("flex h-20 items-center px-6", collapsed && "justify-center px-0")}>
        {!collapsed ? (
          <span
            className="font-manrope text-2xl font-extrabold tracking-tight"
            style={{ color: "hsl(var(--primary))" }}
          >
            AccStudio
          </span>
        ) : (
          <span
            className="font-manrope text-2xl font-extrabold"
            style={{ color: "hsl(var(--primary))" }}
          >
            AS
          </span>
        )}
      </div>

      {/* Nav Items — 10rem spacing below logo per design (spacer via padding) */}
      <div className="flex-1 space-y-0.5 px-3 pb-6">
        {items.map((item, index) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          // @ts-expect-error: item.icon is string but LucideIcons expects specific keys
          const IconComponent = (LucideIcons[item.icon as keyof typeof LucideIcons] ||
            LucideIcons.Circle) as React.ElementType;

          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                // No box for active — use light-bar-active pseudo-element (2px cyan bar)
                "group relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "light-bar-active text-white"
                  : "text-[hsl(var(--on-surface-variant))] hover:text-white hover:bg-[hsl(var(--surface-high)/0.6)]",
                collapsed && "justify-center px-0"
              )}
            >
              <IconComponent
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-colors",
                  isActive
                    ? "text-[hsl(var(--secondary))]"
                    : "text-[hsl(var(--on-surface-variant))] group-hover:text-[hsl(var(--primary))]"
                )}
              />
              {!collapsed && <span>{item.title}</span>}
              {!collapsed && item.badge && (
                <span
                  className="ml-auto flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    background: "hsl(var(--secondary))",
                    color: "hsl(var(--secondary-foreground))",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom brand credit */}
      {!collapsed && (
        <div className="px-6 pb-6">
          <p className="label-md" style={{ color: "hsl(var(--on-surface-variant))" }}>
            v1.0 · The Midnight Architect
          </p>
        </div>
      )}
    </nav>
  );
}
