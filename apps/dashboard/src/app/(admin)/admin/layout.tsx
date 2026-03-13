import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { AdminSidebar } from "./_components/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <main className="ml-60 min-h-screen flex-1">
        <div className="mx-auto max-w-7xl space-y-6 p-6">{children}</div>
      </main>
    </div>
  );
}
