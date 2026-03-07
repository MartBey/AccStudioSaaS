"use client";

import { useState } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle,
  Button, Input, Textarea, Label, Badge, toast,
} from "ui";
import { Upload, FileText, Clock, CheckCircle2, AlertTriangle, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { deliverTask } from "@/app/_actions/delivery-actions";
import { useRouter } from "next/navigation";

interface TaskDetail {
  id: string;
  title: string;
  description: string | null;
  status: string;
  earning: number | null;
  deliveryUrl: string | null;
  deliveryNote: string | null;
  deliveredAt: string | null;
  approvedAt: string | null;
  revisionNote: string | null;
  projectName: string;
  dueDate: string | null;
}

interface TeslimClientProps {
  task: TaskDetail;
}

const statusMap: Record<string, { label: string; color: string }> = {
  TODO: { label: "Yapılacak", color: "bg-muted text-muted-foreground" },
  IN_PROGRESS: { label: "Devam Ediyor", color: "bg-blue-100 text-blue-700" },
  REVIEW: { label: "İnceleniyor", color: "bg-yellow-100 text-yellow-700" },
  DELIVERED: { label: "Teslim Edildi", color: "bg-emerald-100 text-emerald-700" },
  REVISION: { label: "Revizyon İstendi", color: "bg-red-100 text-red-700" },
  DONE: { label: "Tamamlandı", color: "bg-green-100 text-green-800" },
};

export default function TeslimClient({ task }: TeslimClientProps) {
  const router = useRouter();
  const [deliveryUrl, setDeliveryUrl] = useState(task.deliveryUrl || "");
  const [deliveryNote, setDeliveryNote] = useState(task.deliveryNote || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canDeliver = ["TODO", "IN_PROGRESS", "REVIEW", "REVISION"].includes(task.status);
  const isDelivered = task.status === "DELIVERED";
  const isDone = task.status === "DONE";
  const isRevision = task.status === "REVISION";

  const handleSubmit = async () => {
    if (!deliveryUrl.trim()) {
      toast.error("Lütfen teslimat URL'si girin.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await deliverTask({
        taskId: task.id,
        deliveryUrl: deliveryUrl.trim(),
        deliveryNote: deliveryNote.trim() || undefined,
      });
      if (res.success) {
        toast.success("Teslimat başarıyla yapıldı! 🎉");
        router.refresh();
      } else {
        toast.error(res.error || "Teslimat yapılamadı.");
      }
    } catch {
      toast.error("Teslimat sırasında hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <Link href="/freelancer/gorevler" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="h-4 w-4" /> Görevlere Dön
      </Link>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{task.title}</h1>
          <p className="text-muted-foreground mt-1">{task.projectName} projesi</p>
        </div>
        <Badge className={statusMap[task.status]?.color || ""}>
          {statusMap[task.status]?.label || task.status}
        </Badge>
      </div>

      {/* Görev Detayları */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Görev Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {task.earning && (
              <div>
                <span className="text-muted-foreground">Kazanç:</span> 
                <span className="font-semibold text-emerald-600 ml-1">₺{task.earning.toLocaleString("tr-TR")}</span>
              </div>
            )}
            {task.dueDate && (
              <div>
                <span className="text-muted-foreground">Son Tarih:</span>
                <span className="ml-1">{new Date(task.dueDate).toLocaleDateString("tr-TR")}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Revizyon Notu */}
      {isRevision && task.revisionNote && (
        <Card className="border-l-4 border-l-red-500 bg-red-50/30">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-700">Revizyon İstendi</h3>
                <p className="text-sm text-red-600/80 mt-1">{task.revisionNote}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Onaylandı */}
      {isDone && (
        <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/30">
          <CardContent className="py-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="font-bold text-emerald-700 text-lg">Teslimat Onaylandı! 🎉</h3>
            <p className="text-sm text-emerald-600/80 mt-1">
              Onay tarihi: {task.approvedAt ? new Date(task.approvedAt).toLocaleDateString("tr-TR") : "—"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Teslim Edildi — beklemede */}
      {isDelivered && (
        <Card className="border-l-4 border-l-blue-500 bg-blue-50/30">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-700">Teslimatınız İnceleniyor</h3>
                <p className="text-sm text-blue-600/80 mt-0.5">
                  Teslim: {task.deliveredAt ? new Date(task.deliveredAt).toLocaleDateString("tr-TR") : "—"}
                </p>
                {task.deliveryUrl && (
                  <a href={task.deliveryUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline flex items-center gap-1 mt-1">
                    <ExternalLink className="h-3.5 w-3.5" /> Teslim edilen dosya
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Teslimat Formu */}
      {canDeliver && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" /> 
              {isRevision ? "Yeniden Teslim Et" : "Teslimat Yap"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delivery-url">Dosya / Link URL</Label>
              <Input 
                id="delivery-url"
                type="url"
                placeholder="https://drive.google.com/file/... veya WeTransfer linki"
                value={deliveryUrl}
                onChange={(e) => setDeliveryUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Google Drive, Dropbox, WeTransfer veya herhangi bir dosya paylaşım linki.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery-note">Teslimat Notu (Opsiyonel)</Label>
              <Textarea 
                id="delivery-note"
                placeholder="Teslimatla ilgili açıklama..."
                className="min-h-[80px]"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
              />
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full gap-2 h-11">
              <Upload className="h-4 w-4" />
              {isSubmitting ? "Gönderiliyor..." : isRevision ? "Revizyonu Teslim Et" : "Teslimat Yap"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
