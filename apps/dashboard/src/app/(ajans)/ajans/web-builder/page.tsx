"use client";

import {
  Building2,
  CheckCircle2,
  LayoutTemplate,
  MonitorSmartphone,
  Paintbrush,
  Palette,
  Rocket,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { WebBuilderResponse } from "types";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui";
import { buildSiteAction } from "web-builder";

export default function WebBuilderPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WebBuilderResponse | null>(null);

  // Form State
  const [brandName, setBrandName] = useState("");
  const [themeColor, setThemeColor] = useState("#3b82f6");
  const [template, setTemplate] = useState("creative-agency");

  const buildSite = async () => {
    setLoading(true);
    try {
      const site = await buildSiteAction({
        brandDetails: brandName,
        colors: { primary: themeColor, secondary: "#ffffff" },
        templateId: template,
      });
      setResult(site);
      setStep(4); // Result step
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = brandName.trim().length > 2;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="mt-6 space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Ücretsiz Landing Page Jeneratörü</h1>
        <p className="text-muted-foreground">
          Saniyeler içinde müşterileriniz için profesyonel açılış sayfaları oluşturun.
        </p>
      </div>

      {/* Stepper Header */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold ${step >= s ? "border-primary bg-primary text-primary-foreground" : "border-muted bg-card text-muted-foreground"}`}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={`mx-2 h-1 w-16 rounded ${step > s ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      <Card className="border-t-4 border-t-blue-500 shadow-md">
        {step === 1 && (
          <div className="duration-500 animate-in fade-in slide-in-from-right-4">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Building2 className="text-blue-500" /> Marka Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="mx-auto max-w-xl space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Hangi marka için sayfa oluşturuyorsunuz?
                </label>
                <Input
                  placeholder="Örn: X Kozmetik Yaz Kampanyası"
                  className="h-12"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  autoFocus
                />
              </div>
              <Button
                className="text-md h-12 w-full transition-transform active:scale-95"
                disabled={!isStep1Valid}
                onClick={() => setStep(2)}
              >
                İleri: Tasarım Seçimi
              </Button>
            </CardContent>
          </div>
        )}

        {step === 2 && (
          <div className="duration-500 animate-in fade-in slide-in-from-right-4">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Palette className="text-blue-500" /> Görsel Kimlik
              </CardTitle>
            </CardHeader>
            <CardContent className="mx-auto max-w-xl space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ana Renk Kodu</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="h-12 w-16 cursor-pointer rounded-md border p-1"
                    />
                    <Input
                      className="h-12 flex-1 font-mono uppercase"
                      value={themeColor}
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Şablon Stili</label>
                  <Select value={template} onValueChange={setTemplate}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="creative-agency">Yaratıcı & Modern</SelectItem>
                      <SelectItem value="corporate">Kurumsal & Ciddi</SelectItem>
                      <SelectItem value="ecommerce">E-Ticaret Hedefli</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="text-md h-12 w-1/3" onClick={() => setStep(1)}>
                  Geri
                </Button>
                <Button className="text-md h-12 w-2/3" onClick={() => setStep(3)}>
                  İleri: Son Onay
                </Button>
              </div>
            </CardContent>
          </div>
        )}

        {step === 3 && (
          <div className="duration-500 animate-in fade-in slide-in-from-right-4">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Rocket className="text-blue-500" /> Hazır Mıyız?
              </CardTitle>
            </CardHeader>
            <CardContent className="mx-auto max-w-xl space-y-6 text-center">
              <div className="space-y-4 rounded-lg border border-dashed bg-muted/30 p-6">
                <LayoutTemplate className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="text-lg">
                  <strong>{brandName}</strong> için <em>&quot;{template}&quot;</em> şablonunu ve{" "}
                  <span style={{ color: themeColor }} className="font-bold">
                    bu marka rengini
                  </span>{" "}
                  kullanarak siteyi yayına alıyoruz.
                </p>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="text-md h-12 w-1/3" onClick={() => setStep(2)}>
                  Düzenle
                </Button>
                <Button
                  className="h-12 w-2/3 text-lg font-bold shadow-lg"
                  onClick={buildSite}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      İnşa Ediliyor...
                    </span>
                  ) : (
                    "🚀 Hemen Yayına Al"
                  )}
                </Button>
              </div>
            </CardContent>
          </div>
        )}

        {step === 4 && result && (
          <div className="duration-500 animate-in fade-in zoom-in-95">
            <CardContent className="mx-auto max-w-2xl space-y-8 py-10 text-center">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-25" />
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Harika! Siteniz Yayında.</h2>
                <p className="text-lg text-muted-foreground">
                  Landing page başarıyla simüle edildi ve yayımlandı.
                </p>
              </div>

              <div className="flex items-center justify-between rounded-xl border bg-muted p-4">
                <div className="flex items-center gap-3 overflow-hidden text-left">
                  <MonitorSmartphone className="flex-shrink-0 text-blue-500" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Önizleme Bağlantısı
                    </p>
                    {(() => {
                      const isDev =
                        window.location.hostname === "localhost" ||
                        window.location.hostname.includes(".local");
                      const domain = isDev ? "accstudio.local:3000" : "accstudio.co";
                      const protocol = isDev ? "http" : "https";
                      const previewUrl = result.subdomain
                        ? `${protocol}://${result.subdomain}.${domain}`
                        : `${protocol}://${domain}/preview/${result.id}`;

                      return (
                        <a
                          href={previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate font-medium text-blue-600 hover:underline"
                        >
                          {previewUrl}
                        </a>
                      );
                    })()}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const isDev =
                      window.location.hostname === "localhost" ||
                      window.location.hostname.includes(".local");
                    const domain = isDev ? "accstudio.local:3000" : "accstudio.co";
                    const protocol = isDev ? "http" : "https";
                    const previewUrl = result.subdomain
                      ? `${protocol}://${result.subdomain}.${domain}`
                      : `${protocol}://${domain}/preview/${result.id}`;
                    window.open(previewUrl, "_blank");
                  }}
                >
                  Canlı Önizleme
                </Button>
              </div>

              <div className="flex w-full gap-4">
                <Button
                  variant="outline"
                  className="w-1/2"
                  onClick={() => {
                    setStep(1);
                    setBrandName("");
                    setResult(null);
                  }}
                >
                  Yeni Bir Kurgu
                </Button>
                <Button className="w-1/2" onClick={() => router.push(`/builder/${result?.id}`)}>
                  <Paintbrush className="mr-2 h-4 w-4" /> Gelişmiş Editörde Aç
                </Button>
              </div>
            </CardContent>
          </div>
        )}
      </Card>
    </div>
  );
}
