import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { navigationConfig } from "@/config/navigation";

export default function AjansLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navItems={navigationConfig.AGENCY}>
      {children}
    </DashboardLayout>
  );
}
