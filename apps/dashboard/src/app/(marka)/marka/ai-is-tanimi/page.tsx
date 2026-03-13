"use client";

import { CheckCircle2, Clock, Copy, DollarSign, FileText, Tags, Wand2 } from "lucide-react";
import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  toast,
} from "ui";

import {
  generateJobDescription,
  type JobDescriptionResponse,
} from "@/app/_actions/ai-project-actions";

export default function AIIsTanimiPage() {
  const [projectName, setProjectName] = useState("");
  const [industry, setIndustry] = useState("Dijital Pazarlama");
  const [skills, setSkills] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobDescriptionResponse | null>(null);

  const handleGenerate = async () => {
    if (!projectName.trim() || !skills.trim()) {
      toast.error("Proje adı ve en az bir beceri gerekli.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await generateJobDescription({
        projectName,
        industry,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        budget: budget || undefined,
        duration: duration || undefined,
        additionalNotes: notes || undefined,
      });
      setResult(response);
      toast.success("İş tanımı oluşturuldu!");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "İş tanımı oluşturulamadı.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `${result.title}\n\n${result.description.replace(/<[^>]+>/g, "")}\n\nGereksinimler:\n${result.requirements.map((r) => `• ${r}`).join("\n")}\n\nTercih Edilen:\n${result.niceToHave.map((r) => `• ${r}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    toast.success("İş tanımı panoya kopyalandı!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          🪄 AI İş Tanımı Oluşturucu
        </h1>
        <p className="mt-2 text-muted-foreground">
          Birkaç bilgi verin, AI profesyonel bir iş ilanı oluştursun.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Proje Bilgileri
            </CardTitle>
            <CardDescription>
              Temel bilgileri girin, AI detaylı bir iş tanımı oluştursun.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Proje Adı *</label>
              <Input
                placeholder="Örn: E-Ticaret Web Sitesi Yenileme"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sektör</label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dijital Pazarlama">Dijital Pazarlama</SelectItem>
                  <SelectItem value="E-Ticaret">E-Ticaret</SelectItem>
                  <SelectItem value="Yazılım Geliştirme">Yazılım Geliştirme</SelectItem>
                  <SelectItem value="Grafik Tasarım">Grafik Tasarım</SelectItem>
                  <SelectItem value="Video Prodüksiyon">Video Prodüksiyon</SelectItem>
                  <SelectItem value="İçerik Pazarlama">İçerik Pazarlama</SelectItem>
                  <SelectItem value="Sosyal Medya">Sosyal Medya</SelectItem>
                  <SelectItem value="SEO / SEM">SEO / SEM</SelectItem>
                  <SelectItem value="Mobil Uygulama">Mobil Uygulama</SelectItem>
                  <SelectItem value="Diğer">Diğer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                İstenen Beceriler * <span className="text-muted-foreground">(virgülle ayırın)</span>
              </label>
              <Input
                placeholder="Örn: React, Node.js, Figma, SEO"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Bütçe (opsiyonel)</label>
                <Input
                  placeholder="Örn: 15.000 - 25.000₺"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Süre (opsiyonel)</label>
                <Input
                  placeholder="Örn: 2-3 hafta"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ek Notlar (opsiyonel)</label>
              <Textarea
                placeholder="Özel istekler, tercihler, proje detayları..."
                className="min-h-[60px] resize-none"
                value={notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
              />
            </div>

            <Button
              className="h-11 w-full bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold hover:from-blue-700 hover:to-cyan-700"
              onClick={handleGenerate}
              disabled={loading || !projectName.trim() || !skills.trim()}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Oluşturuluyor...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  İş Tanımı Oluştur
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Sonuç */}
        <div className="space-y-4">
          {!result && !loading && (
            <Card className="flex min-h-[400px] items-center justify-center bg-muted/30">
              <div className="space-y-3 text-center text-muted-foreground opacity-60">
                <Wand2 className="mx-auto h-16 w-16" />
                <p className="text-lg font-medium">Sonuç Bekleniyor</p>
                <p className="text-sm">
                  Proje bilgilerini girin ve &ldquo;Oluştur&rdquo; butonuna basın.
                </p>
              </div>
            </Card>
          )}

          {loading && (
            <Card className="flex min-h-[400px] items-center justify-center">
              <div className="space-y-4 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
                <p className="text-lg font-medium">AI iş tanımı hazırlıyor...</p>
              </div>
            </Card>
          )}

          {result && (
            <div className="space-y-4 duration-500 animate-in fade-in slide-in-from-bottom-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{result.title}</CardTitle>
                    <Button variant="outline" size="sm" className="gap-2" onClick={handleCopy}>
                      <Copy className="h-3.5 w-3.5" />
                      Kopyala
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: result.description }}
                  />

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                      <span className="text-muted-foreground">Bütçe:</span>
                      <span className="font-medium">{result.estimatedBudget}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-muted-foreground">Süre:</span>
                      <span className="font-medium">{result.estimatedDuration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Zorunlu Gereksinimler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {result.requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-0.5 text-emerald-500">•</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {result.niceToHave.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Tercih Edilen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {result.niceToHave.map((r, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-0.5">○</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <Tags className="h-4 w-4 text-muted-foreground" />
                {result.suggestedSkillTags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
