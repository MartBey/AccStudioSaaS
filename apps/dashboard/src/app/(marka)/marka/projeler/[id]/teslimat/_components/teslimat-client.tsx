"use client";

import {
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  RotateCcw,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Badge, Button, Card, CardContent, Label, Textarea, toast } from "ui";

import { approveDelivery, requestRevision } from "@/app/_actions/delivery-actions";

interface DeliveryItem {
  taskId: string;
  taskTitle: string;
  status: string;
  earning: number | null;
  deliveryUrl: string | null;
  deliveryNote: string | null;
  deliveredAt: string | null;
  approvedAt: string | null;
  freelancerName: string;
}

interface TeslimatYonetimClientProps {
  projectTitle: string;
  deliveries: DeliveryItem[];
}

const statusMap: Record<string, { label: string; color: string }> = {
  TODO: { label: "Yapılacak", color: "bg-muted text-muted-foreground" },
  IN_PROGRESS: { label: "Devam Ediyor", color: "bg-blue-100 text-blue-700" },
  DELIVERED: { label: "Teslim Edildi", color: "bg-amber-100 text-amber-700" },
  REVISION: { label: "Revizyon", color: "bg-red-100 text-red-700" },
  DONE: { label: "Onaylandı ✓", color: "bg-emerald-100 text-emerald-700" },
};

export default function TeslimatYonetimClient({
  projectTitle,
  deliveries,
}: TeslimatYonetimClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [revisionNotes, setRevisionNotes] = useState<Record<string, string>>({});
  const [showRevisionFor, setShowRevisionFor] = useState<string | null>(null);

  const handleApprove = (taskId: string) => {
    startTransition(async () => {
      const res = await approveDelivery(taskId);
      if (res.success) {
        toast.success("Teslimat onaylandı! ✅");
        router.refresh();
      } else toast.error(res.error || "Onay başarısız.");
    });
  };

  const handleRevision = (taskId: string) => {
    const note = revisionNotes[taskId];
    if (!note?.trim()) {
      toast.error("Lütfen revizyon notunu yazın.");
      return;
    }
    startTransition(async () => {
      const res = await requestRevision({ taskId, revisionNote: note });
      if (res.success) {
        toast.success("Revizyon istendi!");
        setShowRevisionFor(null);
        router.refresh();
      } else toast.error(res.error || "Revizyon isteği başarısız.");
    });
  };

  const pendingCount = deliveries.filter((d) => d.status === "DELIVERED").length;

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teslimat Yönetimi</h1>
        <p className="mt-1 text-muted-foreground">
          {projectTitle} —{" "}
          {pendingCount > 0 ? `${pendingCount} bekleyen teslimat` : "Tüm teslimatlar tamamlandı"}
        </p>
      </div>

      {deliveries.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center text-muted-foreground">
            <FileText className="mx-auto mb-3 h-10 w-10 opacity-50" />
            <p>Bu projede henüz görev/teslimat yok.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {deliveries.map((d) => (
            <Card
              key={d.taskId}
              className={`transition-all ${d.status === "DELIVERED" ? "border-l-4 border-l-amber-500 shadow-md" : ""}`}
            >
              <CardContent className="py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-semibold">{d.taskTitle}</h3>
                      <Badge className={statusMap[d.status]?.color || ""}>
                        {statusMap[d.status]?.label || d.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" /> {d.freelancerName}
                      </span>
                      {d.earning && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" /> ₺
                          {d.earning.toLocaleString("tr-TR")}
                        </span>
                      )}
                      {d.deliveredAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />{" "}
                          {new Date(d.deliveredAt).toLocaleDateString("tr-TR")}
                        </span>
                      )}
                    </div>

                    {d.deliveryNote && (
                      <p className="mt-2 rounded bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                        {d.deliveryNote}
                      </p>
                    )}

                    {d.deliveryUrl && (
                      <a
                        href={d.deliveryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Teslim edilen dosya/link
                      </a>
                    )}
                  </div>

                  {/* Aksiyonlar */}
                  {d.status === "DELIVERED" && (
                    <div className="flex flex-shrink-0 flex-col gap-2">
                      <Button
                        size="sm"
                        className="gap-1"
                        onClick={() => handleApprove(d.taskId)}
                        disabled={isPending}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Onayla
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-red-600 hover:text-red-700"
                        onClick={() =>
                          setShowRevisionFor(showRevisionFor === d.taskId ? null : d.taskId)
                        }
                        disabled={isPending}
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Revize
                      </Button>
                    </div>
                  )}
                </div>

                {/* Revizyon Notu */}
                {showRevisionFor === d.taskId && (
                  <div className="mt-4 space-y-3 border-t pt-4">
                    <Label>Revizyon Notu</Label>
                    <Textarea
                      placeholder="Nelerin düzeltilmesi gerektiğini açıklayın..."
                      value={revisionNotes[d.taskId] || ""}
                      onChange={(e) =>
                        setRevisionNotes({ ...revisionNotes, [d.taskId]: e.target.value })
                      }
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1"
                      onClick={() => handleRevision(d.taskId)}
                      disabled={isPending}
                    >
                      Revizyon İste
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
