"use client";

import { Bell, Menu, User } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sheet,
  SheetContent,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "ui";
import { cn } from "ui";

import { ThemeToggle } from "@/components/theme-toggle";
import { NavItem } from "@/config/navigation";

interface HeaderProps {
  items: NavItem[];
}

export function Header({ items }: HeaderProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const currentItem = items.find(
    (i) => pathname === i.href || (i.href !== "/" && pathname?.startsWith(i.href))
  );
  const pageTitle = currentItem?.title || "Dashboard";

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const rolePrefix = pathname?.startsWith("/marka")
    ? "/marka"
    : pathname?.startsWith("/ajans")
      ? "/ajans"
      : "/freelancer";
  const getNotificationLink = () => `${rolePrefix}/bildirimler`;
  const getSettingsLink = () => `${rolePrefix}/ayarlar`;

  const isFreelancer = pathname?.startsWith("/freelancer") || session?.user?.role === "FREELANCER";

  return (
    // Glassmorphism header — surface-container 60% + backdrop-blur-20
    <header
      className={cn(
        "glass sticky top-0 z-30 flex h-16 w-full items-center justify-between px-4 md:px-6",
        // Ghost Border fallback bottom — outline-variant at 20%
        "border-b border-ghost"
      )}
    >
      {/* Left: Mobile menu + Page title */}
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[hsl(var(--on-surface-variant))] hover:text-white hover:bg-[hsl(var(--surface-high))]"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menüyü aç/kapa</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 p-0 border-r-0 surface-low"
          >
            <div className="px-6 py-8">
              <h2
                className="mb-8 font-manrope text-2xl font-extrabold"
                style={{ color: "hsl(var(--primary))" }}
              >
                AccStudio
              </h2>
              <nav className="flex flex-col gap-0.5">
                {items.map((item, index) => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                  const IconComponent = (LucideIcons[item.icon as keyof typeof LucideIcons] ||
                    LucideIcons.Circle) as React.ElementType;
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "light-bar-active bg-[hsl(var(--surface-high))] text-white"
                          : "text-[hsl(var(--on-surface-variant))] hover:bg-[hsl(var(--surface-high))/0.6] hover:text-white"
                      )}
                    >
                      <IconComponent
                        className={cn(
                          "h-5 w-5",
                          isActive
                            ? "text-[hsl(var(--secondary))]"
                            : "text-[hsl(var(--on-surface-variant))]"
                        )}
                      />
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Page Title — Manrope headline */}
        <h1
          className="hidden font-manrope text-lg font-bold tracking-tight text-white md:block"
        >
          {pageTitle}
        </h1>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Freelancer rank chip */}
        {isFreelancer && (
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <div
                  className="mr-1 hidden cursor-help items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold sm:flex border-ghost"
                  style={{
                    background: "hsl(var(--surface-high))",
                    color: "hsl(var(--on-surface-variant))",
                  }}
                >
                  <LucideIcons.Star className="h-3.5 w-3.5" style={{ color: "hsl(var(--secondary))" }} />
                  <span>Sıralamam: 524</span>
                </div>
              </TooltipTrigger>
              <TooltipContent
                className="shadow-ambient glass max-w-[280px] border-ghost p-3"
                sideOffset={8}
              >
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--on-surface-variant))" }}>
                  Diğer profesyonellere kıyasla performansını görüyorsun. Teklif ver, sıralamanı yükselt!
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <ThemeToggle />

        {/* Bell */}
        <Link href={getNotificationLink()} className="inline-flex">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-[hsl(var(--on-surface-variant))] hover:text-white hover:bg-[hsl(var(--surface-high))]"
          >
            <Bell className="h-5 w-5" />
            {/* Notification dot — tertiary (#ff6c95) */}
            <span
              className="absolute right-2 top-2 h-2 w-2 rounded-full"
              style={{ background: "hsl(var(--tertiary))" }}
            />
          </Button>
        </Link>

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full hover:bg-[hsl(var(--surface-high))]"
            >
              <Avatar className="h-9 w-9 border-ghost">
                <AvatarFallback
                  className="font-semibold text-sm"
                  style={{
                    background: "hsl(var(--primary-container))",
                    color: "hsl(var(--primary))",
                  }}
                >
                  {session?.user?.name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 surface-high shadow-ambient border-ghost"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-semibold text-white">
                  {session?.user?.name || session?.user?.email || "Kullanıcı"}
                </p>
                <p className="label-md" style={{ color: "hsl(var(--on-surface-variant))" }}>
                  {session?.user?.role || "Misafir"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[hsl(var(--outline-variant)/0.2)]" />
            <DropdownMenuItem asChild>
              <Link
                href={getSettingsLink()}
                className="text-[hsl(var(--on-surface-variant))] hover:text-white focus:text-white"
              >
                Ayarlar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[hsl(var(--outline-variant)/0.2)]" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="focus:bg-[hsl(var(--tertiary)/0.1)]"
              style={{ color: "hsl(var(--tertiary))" }}
            >
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
