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

  // Bulunduğumuz sayfanın başlığını title olarak çek
  const currentItem = items.find(
    (i) => pathname === i.href || (i.href !== "/" && pathname?.startsWith(i.href))
  );
  const pageTitle = currentItem?.title || "Dashboard";

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Rol bazlı link hesaplayıcılar
  const rolePrefix = pathname?.startsWith("/marka")
    ? "/marka"
    : pathname?.startsWith("/ajans")
      ? "/ajans"
      : "/freelancer";
  const getNotificationLink = () => `${rolePrefix}/bildirimler`;
  const getSettingsLink = () => `${rolePrefix}/ayarlar`;

  const isFreelancer = pathname?.startsWith("/freelancer") || session?.user?.role === "FREELANCER";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menüyü aç/kapa</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-6">
              <h2 className="mb-6 text-2xl font-bold text-primary">AccStudio</h2>
              <nav className="flex flex-col gap-1">
                {items.map((item, index) => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                  const IconComponent = (LucideIcons[item.icon as keyof typeof LucideIcons] ||
                    LucideIcons.Circle) as React.ElementType;
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-primary"
                      )}
                    >
                      <IconComponent className="h-5 w-5" />
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        <h1 className="hidden text-xl font-semibold md:block">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-4">
        {isFreelancer && (
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <div className="mr-2 flex hidden cursor-help items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:text-foreground sm:flex">
                  <LucideIcons.Star className="h-4 w-4" />
                  <span>Sıralamam: 524</span>
                  <LucideIcons.Info className="ml-1 h-4 w-4 text-muted-foreground/70" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[280px] p-3 shadow-lg" sideOffset={8}>
                <p className="text-sm font-medium leading-relaxed">
                  Burada diğer hizmet verenlere kıyasla performansını görebilirsin. İş kazanmak ve
                  sıralamanı yükseltmek için teklif ver!
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <ThemeToggle />

        <Link href={getNotificationLink()} className="inline-flex">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive"></span>
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user?.name || session?.user?.email || "Kullanıcı"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.role || "Misafir"} Profili
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={getSettingsLink()}>Ayarlar</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:bg-destructive/10"
            >
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
