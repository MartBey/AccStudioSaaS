import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { navigationConfig } from "@/config/navigation";

export default function MarkaLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout navItems={navigationConfig.BRAND}>{children}</DashboardLayout>;
}
