"use client";

import { CheckCircle2, Clock, CreditCard, DollarSign, TrendingUp, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, toast } from "ui";

import { updatePaymentStatus } from "@/app/_actions/payment-actions";

interface PaymentItem {
  id: string;
  projectName: string;
  freelancerName?: string;
  brandName?: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  paidAt: string | null;
  createdAt: string;
}

interface FaturalarClientProps {
  payments: PaymentItem[];
  totalPaid: number;
  totalPending: number;
  total: number;
  role: "BRAND" | "FREELANCER";
}

const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: {
    label: "Bekliyor",
    color: "bg-yellow-100 text-yellow-700",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  PAID: {
    label: "Ödendi",
    color: "bg-emerald-100 text-emerald-700",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  CANCELLED: {
    label: "İptal",
    color: "bg-red-100 text-red-700",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
  REFUNDED: {
    label: "İade",
    color: "bg-blue-100 text-blue-700",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

export default function FaturalarClient({
  payments,
  totalPaid,
  totalPending,
  total,
  role,
}: FaturalarClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusUpdate = (id: string, status: "PAID" | "CANCELLED") => {
    startTransition(async () => {
      const res = await updatePaymentStatus(id, status);
      if (res.success) {
        toast.success(status === "PAID" ? "Ödeme onaylandı! ✅" : "Ödeme iptal edildi.");
        router.refresh();
      } else toast.error(res.error || "İşlem başarısız.");
    });
  };

  const isBrand = role === "BRAND";

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isBrand ? "Fatura & Ödemeler" : "Kazançlarım"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {isBrand ? "Proje bazlı ödeme takibi" : "Tamamlanan ve bekleyen kazançlarınız"}
        </p>
      </div>

      {/* Finansal Özet */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
          <CardContent className="py-5 text-center">
            <CheckCircle2 className="mx-auto mb-1 h-6 w-6 text-emerald-600" />
            <p className="text-2xl font-bold text-emerald-700">
              ₺{totalPaid.toLocaleString("tr-TR")}
            </p>
            <p className="text-xs text-muted-foreground">
              {isBrand ? "Toplam Ödenen" : "Tamamlanan Kazanç"}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5">
          <CardContent className="py-5 text-center">
            <Clock className="mx-auto mb-1 h-6 w-6 text-yellow-600" />
            <p className="text-2xl font-bold text-yellow-700">
              ₺{totalPending.toLocaleString("tr-TR")}
            </p>
            <p className="text-xs text-muted-foreground">Bekleyen Ödeme</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5">
          <CardContent className="py-5 text-center">
            <TrendingUp className="mx-auto mb-1 h-6 w-6 text-blue-600" />
            <p className="text-2xl font-bold text-blue-700">₺{total.toLocaleString("tr-TR")}</p>
            <p className="text-xs text-muted-foreground">Toplam Tutar</p>
          </CardContent>
        </Card>
      </div>

      {/* Ödeme Listesi */}
      {payments.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center text-muted-foreground">
            <CreditCard className="mx-auto mb-3 h-10 w-10 opacity-50" />
            <p>Henüz ödeme kaydı yok.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-primary" /> Ödeme Geçmişi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border p-4 transition-shadow hover:shadow-sm"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{p.projectName}</h3>
                      <Badge className={`gap-1 ${statusMap[p.status]?.color || ""}`}>
                        {statusMap[p.status]?.icon}
                        {statusMap[p.status]?.label || p.status}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {isBrand ? `→ ${p.freelancerName}` : `← ${p.brandName}`}
                      {p.description && ` • ${p.description}`}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground/60">
                      {new Date(p.createdAt).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      {p.paidAt && ` • Ödendi: ${new Date(p.paidAt).toLocaleDateString("tr-TR")}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-foreground">
                      ₺{p.amount.toLocaleString("tr-TR")}
                    </span>
                    {isBrand && p.status === "PENDING" && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleStatusUpdate(p.id, "PAID")}
                          disabled={isPending}
                        >
                          Öde
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs text-red-600"
                          onClick={() => handleStatusUpdate(p.id, "CANCELLED")}
                          disabled={isPending}
                        >
                          İptal
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
