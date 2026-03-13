"use client";

import { Briefcase, CreditCard, FileText, Plus, Target } from "lucide-react";
import Link from "next/link";
import { Badge, Button, Card } from "ui";

interface FreelancerDashboardClientProps {
  userName: string;
  stats: {
    pendingBalance: number;
    activeTasks: number;
    completedJobs: number;
    successRate: number;
  };
  recentTasks: { title: string; project: string; deadline: string; urgent: boolean }[];
  suggestedJobs: { title: string; brand: string; budget: string }[];
}

export default function FreelancerDashboardClient({
  userName,
  stats,
  recentTasks,
  suggestedJobs,
}: FreelancerDashboardClientProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Freelancer Paneli</h1>
          <p className="text-muted-foreground">
            {userName} için mevcut görevler ve kazanç tablosu.
          </p>
        </div>
        <Button className="gap-2" variant="outline">
          <Plus className="h-4 w-4" />
          Portföy Ekle
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
              Bekleyen Bakiye
            </h3>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-primary">
            ₺{stats.pendingBalance.toLocaleString("tr-TR")}
          </div>
          <p className="text-xs text-muted-foreground">Onaylı tekliflerden</p>
        </Card>
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
              Aktif Görevler
            </h3>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.activeTasks}</div>
          <p className="text-xs text-muted-foreground">TODO + IN_PROGRESS</p>
        </Card>
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
              Kabul Edilen İşler
            </h3>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.completedJobs}</div>
          <p className="text-xs text-muted-foreground">Tamamlanan görevler</p>
        </Card>
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
              Başarı Puanı
            </h3>
            <Target className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-500">%{stats.successRate}</div>
          <p className="text-xs text-muted-foreground">
            {stats.successRate >= 90 ? "Üstün Yetenek Rozeti" : "Gelişiyor"}
          </p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 flex flex-col p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Öncelikli Görevlerim</h3>
            <Link href="/freelancer/gorevler" className="text-sm text-primary hover:underline">
              Tüm Görevler
            </Link>
          </div>
          <div className="flex-1 space-y-4">
            {recentTasks.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">Henüz atanmış görev yok.</p>
            ) : (
              recentTasks.map((task, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between border-b pb-4 last:border-0"
                >
                  <div className="flex gap-4">
                    <div className="mt-1 h-4 w-4 rounded-full border-2 border-primary" />
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">{task.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {task.project} • {task.deadline}
                      </span>
                    </div>
                  </div>
                  <Badge variant={task.urgent ? "destructive" : "secondary"}>
                    {task.urgent ? "Acil" : "Devam"}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="col-span-3 flex flex-col p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Sizin İçin Önerilen İlanlar</h3>
            <Link href="/freelancer/ilanlar" className="text-sm text-primary hover:underline">
              Job Board
            </Link>
          </div>
          <div className="flex-1 space-y-4">
            {suggestedJobs.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">Açık ilan bulunamadı.</p>
            ) : (
              suggestedJobs.map((job, i) => (
                <div key={i} className="flex flex-col gap-2 rounded-lg bg-muted/50 p-3">
                  <span className="text-sm font-medium">{job.title}</span>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{job.brand}</span>
                    <span className="font-medium text-foreground">{job.budget}</span>
                  </div>
                </div>
              ))
            )}
            <Link href="/freelancer/ilanlar">
              <Button variant="ghost" className="w-full text-xs" size="sm">
                Daha fazla ilan yükle
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
