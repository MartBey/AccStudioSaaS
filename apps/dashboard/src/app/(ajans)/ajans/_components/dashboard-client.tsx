"use client";

import { Card, Button, Badge } from "ui";
import { Plus, Target, Users, LayoutList } from "lucide-react";
import Link from "next/link";

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

export default function AjansDashboardClient({ agencyName, stats, activeProjects }: AjansDashboardClientProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
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
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Aktif Müşteriler</h3>
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.activeClients}</div>
          <p className="text-xs text-muted-foreground">Proje atanmış markalar</p>
        </Card>
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Ekip Üyeleri</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.teamSize}</div>
          <p className="text-xs text-muted-foreground">Kayıtlı çalışanlar</p>
        </Card>
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Açık Görevler</h3>
            <LayoutList className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.openTasks}</div>
          <p className="text-xs text-muted-foreground">TODO + IN_PROGRESS</p>
        </Card>
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Tamamlanan Projeler</h3>
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.completedProjects}</div>
          <p className="text-xs text-muted-foreground">Toplam</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Aktif Projeler</h3>
            <Link href="/ajans/musteriler" className="text-sm text-primary hover:underline">Tüm Projeler</Link>
          </div>
          <div className="flex-1 space-y-4">
            {activeProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">Aktif proje bulunmuyor.</p>
            ) : (
              activeProjects.map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 hover:bg-muted/50 p-2 rounded-lg transition-colors">
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

        <Card className="col-span-3 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Hızlı Erişim</h3>
          </div>
          <div className="flex-1 space-y-3">
            <Link href="/ajans/kesfet" className="block">
              <div className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <span className="font-medium text-sm">🔍 Yetenek Keşfi</span>
                <p className="text-xs text-muted-foreground mt-1">Freelancer havuzunu keşfedin</p>
              </div>
            </Link>
            <Link href="/ajans/ekip" className="block">
              <div className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <span className="font-medium text-sm">👥 Ekip Yönetimi</span>
                <p className="text-xs text-muted-foreground mt-1">Ekip üyelerinizi yönetin</p>
              </div>
            </Link>
            <Link href="/ajans/musteriler" className="block">
              <div className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <span className="font-medium text-sm">🏢 Müşteriler</span>
                <p className="text-xs text-muted-foreground mt-1">Marka ilişkilerini takip edin</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
