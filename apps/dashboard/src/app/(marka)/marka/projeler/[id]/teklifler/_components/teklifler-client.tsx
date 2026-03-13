"use client";

import { ArrowLeft, CheckCircle2, Clock, DollarSign, FileText, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Avatar, AvatarFallback, Badge, Button, Card, CardContent, toast } from "ui";

interface ProposalItem {
  id: string;
  freelancerName: string;
  coverLetter: string;
  amount: number;
  deliveryTime: number | null;
  sampleUrl: string | null;
  status: string;
  createdAt: string;
}

interface TekliflerClientProps {
  projectName: string;
  projectId: string;
  proposals: ProposalItem[];
}

const statusMap: Record<string, { label: string; variant: string; icon: React.ReactNode }> = {
  PENDING: { label: "Beklemede", variant: "secondary", icon: <Clock className="h-3 w-3" /> },
  ACCEPTED: {
    label: "Kabul Edildi",
    variant: "default",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  REJECTED: { label: "Reddedildi", variant: "destructive", icon: <XCircle className="h-3 w-3" /> },
};

export default function TekliflerClient({ projectName, proposals }: TekliflerClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAction = async (proposalId: string, action: "accept" | "reject") => {
    startTransition(async () => {
      // Dynamic import to avoid sharing server action path
      const { acceptProposal, rejectProposal } =
        await import("@/app/(freelancer)/freelancer/ilanlar/_actions/proposal-actions");
      const res =
        action === "accept" ? await acceptProposal(proposalId) : await rejectProposal(proposalId);

      if (res.success) {
        toast.success(
          action === "accept" ? "Teklif kabul edildi! Görev oluşturuldu." : "Teklif reddedildi."
        );
        router.refresh();
      } else {
        toast.error(res.error || "İşlem başarısız.");
      }
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/marka/projeler"
        className="flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Projelere Dön
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gelen Teklifler</h1>
          <p className="mt-1 text-muted-foreground">
            <strong>{projectName}</strong> projesi için gelen freelancer teklifleri
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1.5 text-sm">
          {proposals.length} teklif
        </Badge>
      </div>

      {proposals.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center text-muted-foreground">
            <FileText className="mx-auto mb-3 h-10 w-10 opacity-50" />
            <p>Henüz bu projeye teklif gelmedi.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {proposals.map((p) => {
            const st = statusMap[p.status] || { label: p.status, variant: "outline", icon: null };
            return (
              <Card key={p.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 font-bold text-primary">
                        {p.freelancerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{p.freelancerName}</h3>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(p.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-lg font-bold text-primary">
                              <DollarSign className="h-4 w-4" />₺{p.amount.toLocaleString("tr-TR")}
                            </div>
                            <span className="text-[10px] text-muted-foreground">Teklif Tutarı</span>
                          </div>
                          {/* @ts-expect-error - Badge variant */}
                          <Badge variant={st.variant} className="gap-1">
                            {st.icon} {st.label}
                          </Badge>
                        </div>
                      </div>

                      <p className="rounded-lg bg-muted/50 p-3 text-sm leading-relaxed text-muted-foreground">
                        {p.coverLetter}
                      </p>

                      {p.status === "PENDING" && (
                        <div className="flex gap-3 pt-2">
                          <Button
                            className="gap-2 shadow-sm"
                            onClick={() => handleAction(p.id, "accept")}
                            disabled={isPending}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Kabul Et
                          </Button>
                          <Button
                            variant="outline"
                            className="gap-2 text-destructive hover:bg-destructive/10"
                            onClick={() => handleAction(p.id, "reject")}
                            disabled={isPending}
                          >
                            <XCircle className="h-4 w-4" />
                            Reddet
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
