import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { navigationConfig } from "@/config/navigation";

export default function FreelancerLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout navItems={navigationConfig.FREELANCER}>{children}</DashboardLayout>;
}
