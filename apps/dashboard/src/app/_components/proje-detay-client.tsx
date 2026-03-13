"use client";

import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  MessageCircle,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "ui";

interface TaskSummary {
  id: string;
  title: string;
  status: string;
  freelancerName: string | null;
  deliveryUrl: string | null;
  deliveredAt: string | null;
  approvedAt: string | null;
  earning: number | null;
}

interface TimelineEvent {
  date: string;
  label: string;
  type: "info" | "success" | "warning";
}

interface ProjeDetayClientProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    budget: number | null;
    createdAt: string;
    dueDate: string | null;
    agencyName: string | null;
  };
  tasks: TaskSummary[];
  timeline: TimelineEvent[];
  stats: {
    totalTasks: number;
    completedTasks: number;
    totalBudget: number;
    paidAmount: number;
    pendingAmount: number;
    messageCount: number;
  };
  rolePrefix: string;
}

const statusMap: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Taslak", color: "bg-muted text-muted-foreground" },
  ACTIVE: { label: "Aktif", color: "bg-blue-100 text-blue-700" },
  IN_REVIEW: { label: "İnceleme", color: "bg-amber-100 text-amber-700" },
  COMPLETED: { label: "Tamamlandı", color: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "İptal", color: "bg-red-100 text-red-700" },
};

const taskStatusMap: Record<string, { label: string; color: string }> = {
  TODO: { label: "Yapılacak", color: "bg-muted text-muted-foreground" },
  IN_PROGRESS: { label: "Devam", color: "bg-blue-100 text-blue-700" },
  DELIVERED: { label: "Teslim", color: "bg-amber-100 text-amber-700" },
  REVISION: { label: "Revize", color: "bg-red-100 text-red-700" },
  DONE: { label: "Bitti ✓", color: "bg-emerald-100 text-emerald-700" },
};

export default function ProjeDetayClient({
  project,
  tasks,
  timeline,
  stats,
  rolePrefix,
}: ProjeDetayClientProps) {
  const progress =
    stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <Link
        href={`${rolePrefix}/projeler`}
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Projelere Dön
      </Link>

      {/* Proje Başlık */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <Badge className={statusMap[project.status]?.color || ""}>
              {statusMap[project.status]?.label || project.status}
            </Badge>
          </div>
          {project.description && (
            <p className="mt-1 max-w-2xl text-muted-foreground">{project.description}</p>
          )}
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />{" "}
              {new Date(project.createdAt).toLocaleDateString("tr-TR")}
            </span>
            {project.dueDate && (
              <span>Bitiş: {new Date(project.dueDate).toLocaleDateString("tr-TR")}</span>
            )}
            {project.agencyName && <span>Ajans: {project.agencyName}</span>}
          </div>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Card>
          <CardContent className="py-4 text-center">
            <FileText className="mx-auto mb-1 h-5 w-5 text-blue-500" />
            <p className="text-xl font-bold">{stats.totalTasks}</p>
            <p className="text-[10px] text-muted-foreground">Toplam Görev</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-emerald-500" />
            <p className="text-xl font-bold">{progress}%</p>
            <p className="text-[10px] text-muted-foreground">Tamamlanma</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <DollarSign className="mx-auto mb-1 h-5 w-5 text-yellow-500" />
            <p className="text-xl font-bold">₺{stats.totalBudget.toLocaleString("tr-TR")}</p>
            <p className="text-[10px] text-muted-foreground">Toplam Bütçe</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <Clock className="mx-auto mb-1 h-5 w-5 text-orange-500" />
            <p className="text-xl font-bold">₺{stats.pendingAmount.toLocaleString("tr-TR")}</p>
            <p className="text-[10px] text-muted-foreground">Bekleyen</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <MessageCircle className="mx-auto mb-1 h-5 w-5 text-purple-500" />
            <p className="text-xl font-bold">{stats.messageCount}</p>
            <p className="text-[10px] text-muted-foreground">Mesaj</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Görevler */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase className="h-5 w-5" /> Görevler
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Henüz görev yok.</p>
            ) : (
              <div className="space-y-2">
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/30"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{t.title}</span>
                        <Badge
                          className={`px-1.5 text-[10px] ${taskStatusMap[t.status]?.color || ""}`}
                        >
                          {taskStatusMap[t.status]?.label || t.status}
                        </Badge>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        {t.freelancerName && (
                          <span>
                            <Users className="mr-0.5 inline h-3 w-3" />
                            {t.freelancerName}
                          </span>
                        )}
                        {t.earning && <span>₺{t.earning.toLocaleString("tr-TR")}</span>}
                      </div>
                    </div>
                    {t.deliveryUrl && (
                      <a
                        href={t.deliveryUrl}
                        target="_blank"
                        rel="noopener"
                        className="text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" /> Zaman Çizelgesi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timeline.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Etkinlik yok.</p>
            ) : (
              <div className="relative space-y-4 border-l-2 border-muted pl-4">
                {timeline.map((e, i) => (
                  <div key={i} className="relative">
                    <div
                      className={`absolute -left-[21px] h-3 w-3 rounded-full ${
                        e.type === "success"
                          ? "bg-emerald-500"
                          : e.type === "warning"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <p className="text-sm font-medium">{e.label}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(e.date).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
