"use client";

import { useState } from "react";
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ui";
import { Palette, CheckCircle2, MonitorSmartphone, LayoutTemplate, Rocket, Building2, Paintbrush } from "lucide-react";
import { buildSiteAction } from "web-builder";
import { WebBuilderResponse } from "types";
import { useRouter } from "next/navigation";

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
        templateId: template
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2 mt-6">
        <h1 className="text-3xl font-bold tracking-tight">Ücretsiz Landing Page Jeneratörü</h1>
        <p className="text-muted-foreground">
          Saniyeler içinde müşterileriniz için profesyonel açılış sayfaları oluşturun.
        </p>
      </div>

      {/* Stepper Header */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold ${step >= s ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-muted'}`}>
              {s}
            </div>
            {s < 3 && <div className={`w-16 h-1 mx-2 rounded ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      <Card className="border-t-4 border-t-blue-500 shadow-md">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Building2 className="text-blue-500" /> Marka Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 max-w-xl mx-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hangi marka için sayfa oluşturuyorsunuz?</label>
                <Input 
                  placeholder="Örn: X Kozmetik Yaz Kampanyası" 
                  className="h-12"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  autoFocus
                />
              </div>
              <Button 
                className="w-full h-12 text-md transition-transform active:scale-95" 
                disabled={!isStep1Valid}
                onClick={() => setStep(2)}
              >
                İleri: Tasarım Seçimi
              </Button>
            </CardContent>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Palette className="text-blue-500" /> Görsel Kimlik
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 max-w-xl mx-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ana Renk Kodu</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={themeColor} 
                      onChange={(e) => setThemeColor(e.target.value)} 
                      className="h-12 w-16 p-1 border rounded-md cursor-pointer"
                    />
                    <Input className="h-12 flex-1 uppercase font-mono" value={themeColor} readOnly />
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
                <Button variant="outline" className="w-1/3 h-12 text-md" onClick={() => setStep(1)}>
                  Geri
                </Button>
                <Button className="w-2/3 h-12 text-md" onClick={() => setStep(3)}>
                  İleri: Son Onay
                </Button>
              </div>
            </CardContent>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Rocket className="text-blue-500" /> Hazır Mıyız?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 max-w-xl mx-auto text-center">
              <div className="p-6 bg-muted/30 rounded-lg space-y-4 border border-dashed">
                <LayoutTemplate className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="text-lg"><strong>{brandName}</strong> için <em>&quot;{template}&quot;</em> şablonunu ve <span style={{ color: themeColor }} className="font-bold">bu marka rengini</span> kullanarak siteyi yayına alıyoruz.</p>
              </div>
              
              <div className="flex gap-4">
                <Button variant="outline" className="w-1/3 h-12 text-md" onClick={() => setStep(2)}>
                  Düzenle
                </Button>
                <Button 
                  className="w-2/3 h-12 text-lg font-bold shadow-lg" 
                  onClick={buildSite}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      İnşa Ediliyor...
                    </span>
                  ) : "🚀 Hemen Yayına Al"}
                </Button>
              </div>
            </CardContent>
          </div>
        )}

        {step === 4 && result && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <CardContent className="space-y-8 py-10 text-center max-w-2xl mx-auto">
              <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto relative">
                <span className="absolute inset-0 bg-green-400 animate-ping rounded-full opacity-25" />
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Harika! Siteniz Yayında.</h2>
                <p className="text-muted-foreground text-lg">Landing page başarıyla simüle edildi ve yayımlandı.</p>
              </div>

              <div className="bg-muted p-4 rounded-xl border flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden text-left">
                  <MonitorSmartphone className="text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase">Önizleme Bağlantısı</p>
                    <a href="#" className="font-medium text-blue-600 hover:underline truncate" onClick={(e) => e.preventDefault()}>
                      {result.previewUrl}
                    </a>
                  </div>
                </div>
                <Button variant="secondary" onClick={() => window.open(result?.previewUrl, '_blank')}>
                  Canlı Önizleme
                </Button>
              </div>

              <div className="flex gap-4 w-full">
                <Button variant="outline" className="w-1/2" onClick={() => { setStep(1); setBrandName(""); setResult(null); }}>
                  Yeni Bir Kurgu
                </Button>
                <Button className="w-1/2" onClick={() => router.push(`/builder/${result?.id}`)}>
                  <Paintbrush className="w-4 h-4 mr-2" /> Gelişmiş Editörde Aç
                </Button>
              </div>
            </CardContent>
          </div>
        )}
      </Card>
    </div>
  );
}
