"use client";

import { CheckCircle2, Clock, FileText, ShieldCheck, Upload, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
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

import { submitVerification } from "@/app/_actions/verification-actions";

interface VerificationData {
  status: string;
  documentUrl: string | null;
  notes: string | null;
  verifiedAt: string | null;
  createdAt: string;
}

interface DogrulamaClientProps {
  verification: VerificationData | null;
  userName: string;
  userRole: string;
}

const statusInfo: Record<
  string,
  { label: string; color: string; icon: React.ReactNode; description: string }
> = {
  PENDING: {
    label: "İnceleniyor",
    color: "text-yellow-600",
    icon: <Clock className="h-6 w-6 text-yellow-600" />,
    description: "Başvurunuz inceleme sırasında. Genellikle 1-3 iş günü içinde sonuçlanır.",
  },
  APPROVED: {
    label: "Doğrulanmış ✓",
    color: "text-emerald-600",
    icon: <CheckCircle2 className="h-6 w-6 text-emerald-600" />,
    description: "Hesabınız doğrulandı! Profilinizde doğrulanmış rozeti görünecektir.",
  },
  REJECTED: {
    label: "Reddedildi",
    color: "text-red-600",
    icon: <XCircle className="h-6 w-6 text-red-600" />,
    description: "Başvurunuz reddedildi. Yeni belgelerle tekrar başvurabilirsiniz.",
  },
};

export default function DogrulamaClient({
  verification,
  userName,
  userRole,
}: DogrulamaClientProps) {
  const router = useRouter();
  const [documentUrl, setDocumentUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!documentUrl.trim()) {
      toast.error("Lütfen belge URL'si girin.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await submitVerification({ documentUrl, notes });
      if (res.success) {
        toast.success("Doğrulama başvurunuz alındı!");
        router.refresh();
      } else {
        toast.error(res.error || "Başvuru yapılamadı.");
      }
    } catch {
      toast.error("Başvuru yapılırken hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleLabel =
    userRole === "FREELANCER" ? "Freelancer" : userRole === "AGENCY" ? "Ajans" : "Marka";

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hesap Doğrulama</h1>
        <p className="mt-1 text-muted-foreground">
          Doğrulanmış {roleLabel} rozeti alarak güvenilirliğinizi artırın.
        </p>
      </div>

      {/* Doğrulama Durumu */}
      {verification ? (
        <Card className="border-t-4 border-t-primary">
          <CardContent className="py-8">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                {statusInfo[verification.status]?.icon}
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${statusInfo[verification.status]?.color}`}>
                  {statusInfo[verification.status]?.label}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {statusInfo[verification.status]?.description}
                </p>
              </div>
              <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                <span>Başvuru: {new Date(verification.createdAt).toLocaleDateString("tr-TR")}</span>
                {verification.verifiedAt && (
                  <span>Onay: {new Date(verification.verifiedAt).toLocaleDateString("tr-TR")}</span>
                )}
              </div>
              {verification.status === "APPROVED" && (
                <Badge className="gap-1 bg-emerald-100 px-4 py-1.5 text-sm text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                  Doğrulanmış {roleLabel}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Avantajlar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Doğrulama Avantajları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-muted/30 p-4 text-center">
                  <span className="text-2xl">🛡️</span>
                  <h3 className="mt-2 font-semibold">Güven Rozeti</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Profilinizde doğrulanmış simgesi görünür
                  </p>
                </div>
                <div className="rounded-lg bg-muted/30 p-4 text-center">
                  <span className="text-2xl">📈</span>
                  <h3 className="mt-2 font-semibold">Daha Fazla Görünürlük</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    İlanlarda ve aramalarda öncelik kazanır
                  </p>
                </div>
                <div className="rounded-lg bg-muted/30 p-4 text-center">
                  <span className="text-2xl">🤝</span>
                  <h3 className="mt-2 font-semibold">Profesyonel İmaj</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Merdiven altı hizmetten ayrışırsınız
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Başvuru Formu */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Doğrulama Başvurusu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doc-url" className="flex items-center gap-1">
                  <Upload className="h-3.5 w-3.5" /> Belge URL (Google Drive, Dropbox vb.)
                </Label>
                <Input
                  id="doc-url"
                  type="url"
                  placeholder="https://drive.google.com/file/d/... veya benzeri link"
                  value={documentUrl}
                  onChange={(e) => setDocumentUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Vergi levhası, ticaret sicil gazetesi, diploma veya serbest çalışan belgesi
                  yükleyin.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Ek Notlar (Opsiyonel)</Label>
                <Textarea
                  id="notes"
                  placeholder="Başvurunuzla ilgili eklemek istediğiniz bilgiler..."
                  className="min-h-[80px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="h-11 w-full gap-2">
                <ShieldCheck className="h-4 w-4" />
                {isSubmitting ? "Gönderiliyor..." : "Doğrulama Başvurusu Yap"}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
