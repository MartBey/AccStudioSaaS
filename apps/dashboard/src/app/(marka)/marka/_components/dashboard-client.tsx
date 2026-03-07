"use client";

import { Card, Button, Badge } from "ui";
import { Plus, TrendingUp, Users, Activity, FolderOpen } from "lucide-react";
import Link from "next/link";

interface MarkaDashboardClientProps {
  brandName: string;
  stats: {
    activeProjects: number;
    totalBudget: number;
    agencyCount: number;
    proposalCount: number;
  };
  recentProjects: { name: string; agency: string; status: string }[];
}

const statusMap: Record<string, { label: string; variant: string }> = {
  ACTIVE: { label: "Devam Ediyor", variant: "default" },
  IN_REVIEW: { label: "İncelemede", variant: "secondary" },
  COMPLETED: { label: "Tamamlandı", variant: "outline" },
  CANCELLED: { label: "İptal", variant: "destructive" },
  DRAFT: { label: "Taslak", variant: "outline" },
};

export default function MarkaDashboardClient({ brandName, stats, recentProjects }: MarkaDashboardClientProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Genel Bakış</h1>
          <p className="text-muted-foreground">
            {brandName} istatistikleri ve aktif proje özetleriniz.
          </p>
        </div>
        <Link href="/marka/projeler">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Yeni Proje Oluştur
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Aktif Projeler</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.activeProjects}</div>
          <p className="text-xs text-muted-foreground">Devam eden projeler</p>
        </Card>
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Toplam Bütçe</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">₺{stats.totalBudget.toLocaleString("tr-TR")}</div>
          <p className="text-xs text-muted-foreground">Tüm ilanlar</p>
        </Card>
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Çalışılan Ajanslar</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.agencyCount}</div>
          <p className="text-xs text-muted-foreground">Atanmış ajanslar</p>
        </Card>
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Gelen Teklifler</h3>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.proposalCount}</div>
          <p className="text-xs text-muted-foreground">Toplam başvuru</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Son Projeler</h3>
            <Link href="/marka/projeler" className="text-sm text-primary hover:underline">Tüm Projeler</Link>
          </div>
          <div className="flex-1 space-y-4">
            {recentProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">Henüz proje oluşturmadınız.</p>
            ) : (
              recentProjects.map((proj, i) => {
                const st = statusMap[proj.status] || { label: proj.status, variant: "outline" };
                return (
                  <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 hover:bg-muted/50 p-2 rounded-lg transition-colors">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{proj.name}</span>
                      <span className="text-xs text-muted-foreground">Ajans: {proj.agency}</span>
                    </div>
                    {/* @ts-expect-error - Badge variant */}
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        <Card className="col-span-3 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Hızlı Erişim</h3>
          </div>
          <div className="flex-1 space-y-3">
            <Link href="/marka/projeler" className="block">
              <div className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <span className="font-medium text-sm">📁 Projeler</span>
                <p className="text-xs text-muted-foreground mt-1">Proje oluşturun ve yönetin</p>
              </div>
            </Link>
            <Link href="/marka/seo-analiz" className="block">
              <div className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <span className="font-medium text-sm">🔎 SEO Analiz</span>
                <p className="text-xs text-muted-foreground mt-1">Sitenizi analiz edin</p>
              </div>
            </Link>
            <Link href="/marka/ai-icerik" className="block">
              <div className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <span className="font-medium text-sm">🤖 AI İçerik</span>
                <p className="text-xs text-muted-foreground mt-1">AI ile içerik üretin</p>
              </div>
            </Link>
            <Link href="/marka/sosyal-medya" className="block">
              <div className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <span className="font-medium text-sm">📱 Sosyal Medya</span>
                <p className="text-xs text-muted-foreground mt-1">Paylaşımlarınızı yönetin</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
