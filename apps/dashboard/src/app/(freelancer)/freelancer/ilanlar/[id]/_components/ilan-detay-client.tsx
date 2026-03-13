"use client";

import { ArrowLeft, Building2, Calendar, DollarSign, Send, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
  toast,
} from "ui";

import { createProposal } from "../../_actions/proposal-actions";

interface JobDetail {
  id: string;
  title: string;
  description: string;
  budget: number | null;
  companyName: string;
  isVerified: boolean;
  proposalCount: number;
  createdAt: string;
  projectName: string;
}

interface IlanDetayClientProps {
  job: JobDetail;
  alreadyApplied: boolean;
  freelancerId: string | null;
}

export default function IlanDetayClient({
  job,
  alreadyApplied,
  freelancerId,
}: IlanDetayClientProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [amount, setAmount] = useState(job.budget?.toString() || "");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [sampleUrl, setSampleUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applied, setApplied] = useState(alreadyApplied);

  const handleSubmit = async () => {
    if (!coverLetter.trim()) {
      toast.error("Lütfen ön yazınızı yazın.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await createProposal({
        jobListingId: job.id,
        coverLetter,
        amount: Number(amount) || 0,
        deliveryTime: Number(deliveryTime) || undefined,
        sampleUrl: sampleUrl.trim() || undefined,
      });
      if (res.success) {
        setApplied(true);
        toast.success("Başvurunuz başarıyla gönderildi!");
      } else {
        toast.error(res.error || "Başvuru yapılamadı.");
      }
    } catch {
      toast.error("Başvuru yapılırken hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      {/* Geri butonu */}
      <Link
        href="/freelancer/ilanlar"
        className="flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        İlanlara Dön
      </Link>

      {/* İlan Detay */}
      <Card className="border-t-4 border-t-primary">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {job.companyName}
                </span>
                {job.isVerified && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <ShieldCheck className="h-3 w-3" /> Doğrulanmış
                  </Badge>
                )}
              </div>
            </div>
            {job.budget && (
              <div className="text-right">
                <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                  <DollarSign className="h-5 w-5" />₺{job.budget.toLocaleString("tr-TR")}
                </div>
                <span className="text-xs text-muted-foreground">Bütçe</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Meta bilgiler */}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              {formatDate(job.createdAt)}
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              {job.proposalCount} başvuru
            </div>
            {job.projectName && (
              <div className="rounded-lg bg-muted px-3 py-1.5 text-muted-foreground">
                Proje: <strong className="text-foreground">{job.projectName}</strong>
              </div>
            )}
          </div>

          {/* Açıklama */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">İlan Açıklaması</h3>
            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {job.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Başvuru Formu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Send className="h-5 w-5 text-primary" />
            {applied ? "Başvurunuz Alındı" : "Başvuru Yap"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!freelancerId ? (
            <div className="py-6 text-center text-muted-foreground">
              <p>
                Başvuru yapabilmek için{" "}
                <Link href="/login" className="text-primary underline">
                  giriş yapmanız
                </Link>{" "}
                gerekiyor.
              </p>
            </div>
          ) : applied ? (
            <div className="space-y-2 py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <ShieldCheck className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="text-lg font-medium text-emerald-600">
                Başvurunuz başarıyla gönderildi!
              </p>
              <p className="text-sm text-muted-foreground">
                İlan sahibi teklifinizi inceleyecek. Sonuç bildirimleri yakında eklenecek.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cover-letter">Ön Yazı</Label>
                <Textarea
                  id="cover-letter"
                  placeholder="Neden bu iş için en uygun adaysınız? Deneyimlerinizi ve yaklaşımınızı kısaca açıklayın..."
                  className="min-h-[120px]"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Teklif Tutarınız (₺)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder={
                    job.budget
                      ? `Bütçe: ₺${job.budget.toLocaleString("tr-TR")}`
                      : "Teklifinizi girin"
                  }
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delivery">Teslim Süresi (gün)</Label>
                  <Input
                    id="delivery"
                    type="number"
                    placeholder="Örn: 14"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sample">Örnek Çalışma Linki</Label>
                  <Input
                    id="sample"
                    type="url"
                    placeholder="https://portfolio.com/proje"
                    value={sampleUrl}
                    onChange={(e) => setSampleUrl(e.target.value)}
                  />
                </div>
              </div>
              <Button
                className="h-12 w-full gap-2 text-base shadow-md"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Gönderiliyor...
                  </span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Başvuru Gönder
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
