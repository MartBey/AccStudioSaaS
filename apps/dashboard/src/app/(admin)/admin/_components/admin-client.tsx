"use client";

import { useState, useTransition } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle,
  Badge, Button, toast,
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "ui";
import { 
  Users, ShieldCheck, DollarSign, Briefcase, CheckCircle2,
  XCircle, ExternalLink, FileText, BarChart3
} from "lucide-react";
import { updateVerificationStatus } from "@/app/_actions/admin-actions";
import { useRouter } from "next/navigation";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  companyName: string | null;
}

interface VerificationItem {
  id: string;
  userName: string;
  userEmail: string;
  userRole: string;
  status: string;
  documentUrl: string;
  notes: string | null;
  createdAt: string;
}

interface AdminStats {
  userCount: number;
  projectCount: number;
  taskCount: number;
  totalRevenue: number;
  pendingVerifications: number;
}

interface AdminClientProps {
  users: AdminUser[];
  verifications: VerificationItem[];
  stats: AdminStats;
}

const roleColors: Record<string, string> = {
  BRAND: "bg-purple-100 text-purple-700",
  AGENCY: "bg-blue-100 text-blue-700",
  FREELANCER: "bg-emerald-100 text-emerald-700",
  ADMIN: "bg-red-100 text-red-700",
};

const verificationColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function AdminClient({ users, verifications, stats }: AdminClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleVerification = (id: string, status: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      const res = await updateVerificationStatus(id, status);
      if (res.success) {
        toast.success(status === "APPROVED" ? "Onaylandı ✅" : "Reddedildi ❌");
        router.refresh();
      } else toast.error(res.error || "İşlem başarısız.");
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">🛡️ Admin Paneli</h1>
        <p className="text-muted-foreground mt-1">Platform yönetimi ve kullanıcı işlemleri</p>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card><CardContent className="py-4 text-center">
          <Users className="h-5 w-5 mx-auto mb-1 text-blue-500" />
          <p className="text-xl font-bold">{stats.userCount}</p>
          <p className="text-[10px] text-muted-foreground">Toplam Kullanıcı</p>
        </CardContent></Card>
        <Card><CardContent className="py-4 text-center">
          <Briefcase className="h-5 w-5 mx-auto mb-1 text-purple-500" />
          <p className="text-xl font-bold">{stats.projectCount}</p>
          <p className="text-[10px] text-muted-foreground">Proje</p>
        </CardContent></Card>
        <Card><CardContent className="py-4 text-center">
          <FileText className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
          <p className="text-xl font-bold">{stats.taskCount}</p>
          <p className="text-[10px] text-muted-foreground">Görev</p>
        </CardContent></Card>
        <Card><CardContent className="py-4 text-center">
          <DollarSign className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
          <p className="text-xl font-bold">₺{stats.totalRevenue.toLocaleString("tr-TR")}</p>
          <p className="text-[10px] text-muted-foreground">Toplam Gelir</p>
        </CardContent></Card>
        <Card className={stats.pendingVerifications > 0 ? "border-amber-300" : ""}><CardContent className="py-4 text-center">
          <ShieldCheck className="h-5 w-5 mx-auto mb-1 text-orange-500" />
          <p className="text-xl font-bold">{stats.pendingVerifications}</p>
          <p className="text-[10px] text-muted-foreground">Bekleyen Doğrulama</p>
        </CardContent></Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="verifications">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="verifications" className="gap-1"><ShieldCheck className="h-4 w-4" /> Doğrulama ({verifications.filter(v => v.status === "PENDING").length})</TabsTrigger>
          <TabsTrigger value="users" className="gap-1"><Users className="h-4 w-4" /> Kullanıcılar ({users.length})</TabsTrigger>
        </TabsList>

        {/* Doğrulama Tab */}
        <TabsContent value="verifications">
          <Card>
            <CardContent className="py-4">
              {verifications.length === 0 ? (
                <p className="text-center text-muted-foreground py-6 text-sm">Doğrulama başvurusu yok.</p>
              ) : (
                <div className="space-y-3">
                  {verifications.map(v => (
                    <div key={v.id} className={`p-4 rounded-lg border ${v.status === "PENDING" ? "border-amber-200 bg-amber-50/30" : ""}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm">{v.userName}</h3>
                            <Badge className={roleColors[v.userRole] || ""}>{v.userRole}</Badge>
                            <Badge className={verificationColors[v.status] || ""}>{v.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{v.userEmail}</p>
                          {v.notes && <p className="text-xs text-muted-foreground mt-1 bg-muted/30 rounded px-2 py-1">{v.notes}</p>}
                          <a href={v.documentUrl} target="_blank" rel="noopener" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                            <ExternalLink className="h-3 w-3" /> Belge
                          </a>
                          <p className="text-[10px] text-muted-foreground/50 mt-1">
                            {new Date(v.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>
                        {v.status === "PENDING" && (
                          <div className="flex gap-2 flex-shrink-0">
                            <Button size="sm" className="h-8 gap-1" onClick={() => handleVerification(v.id, "APPROVED")} disabled={isPending}>
                              <CheckCircle2 className="h-3.5 w-3.5" /> Onayla
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 gap-1 text-red-600" onClick={() => handleVerification(v.id, "REJECTED")} disabled={isPending}>
                              <XCircle className="h-3.5 w-3.5" /> Reddet
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kullanıcılar Tab */}
        <TabsContent value="users">
          <Card>
            <CardContent className="py-4">
              <div className="space-y-2">
                {users.map(u => (
                  <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium">{u.name}</h3>
                        <Badge className={`text-[10px] ${roleColors[u.role] || ""}`}>{u.role}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <div className="text-right">
                      {u.companyName && <p className="text-xs text-muted-foreground">{u.companyName}</p>}
                      <p className="text-[10px] text-muted-foreground/50">{new Date(u.createdAt).toLocaleDateString("tr-TR")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
