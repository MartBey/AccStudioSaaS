"use client";

import { LayoutList, Plus, Target, Users } from "lucide-react";
import Link from "next/link";
import { Badge, Button, Card } from "ui";

interface AjansDashboardClientProps {
  agencyName: string;
  stats: {
    activeClients: number;
    teamSize: number;
    openTasks: number;
    completedProjects: number;
  };
  activeProjects: { client: string; project: string; status: string }[];
}

export default function AjansDashboardClient({
  agencyName,
  stats,
  activeProjects,
}: AjansDashboardClientProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ajans Paneli</h1>
          <p className="text-muted-foreground">
            {agencyName} için müşteri, proje ve ekip takip ekranı.
          </p>
        </div>
        <Link href="/ajans/musteriler">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Müşteriler
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
              Aktif Müşteriler
            </h3>
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.activeClients}</div>
          <p className="text-xs text-muted-foreground">Proje atanmış markalar</p>
        </Card>
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
              Ekip Üyeleri
            </h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.teamSize}</div>
          <p className="text-xs text-muted-foreground">Kayıtlı çalışanlar</p>
        </Card>
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
              Açık Görevler
            </h3>
            <LayoutList className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.openTasks}</div>
          <p className="text-xs text-muted-foreground">TODO + IN_PROGRESS</p>
        </Card>
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
              Tamamlanan Projeler
            </h3>
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.completedProjects}</div>
          <p className="text-xs text-muted-foreground">Toplam</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 flex flex-col p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Aktif Projeler</h3>
            <Link href="/ajans/musteriler" className="text-sm text-primary hover:underline">
              Tüm Projeler
            </Link>
          </div>
          <div className="flex-1 space-y-4">
            {activeProjects.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">Aktif proje bulunmuyor.</p>
            ) : (
              activeProjects.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border-b p-2 pb-4 transition-colors last:border-0 hover:bg-muted/50"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{item.client}</span>
                    <span className="text-xs text-muted-foreground">{item.project}</span>
                  </div>
                  <Badge variant={item.status === "Devam Ediyor" ? "default" : "secondary"}>
                    {item.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="col-span-3 flex flex-col p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Hızlı Erişim</h3>
          </div>
          <div className="flex-1 space-y-3">
            <Link href="/ajans/kesfet" className="block">
              <div className="rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted">
                <span className="text-sm font-medium">🔍 Yetenek Keşfi</span>
                <p className="mt-1 text-xs text-muted-foreground">Freelancer havuzunu keşfedin</p>
              </div>
            </Link>
            <Link href="/ajans/ekip" className="block">
              <div className="rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted">
                <span className="text-sm font-medium">👥 Ekip Yönetimi</span>
                <p className="mt-1 text-xs text-muted-foreground">Ekip üyelerinizi yönetin</p>
              </div>
            </Link>
            <Link href="/ajans/musteriler" className="block">
              <div className="rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted">
                <span className="text-sm font-medium">🏢 Müşteriler</span>
                <p className="mt-1 text-xs text-muted-foreground">Marka ilişkilerini takip edin</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
