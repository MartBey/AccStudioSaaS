"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  Badge,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from "ui";
import {
  Scale,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Copy,
  RotateCcw,
} from "lucide-react";
import { evaluateWithAIJuri, type JuriResponse } from "@/app/_actions/ai-juri-actions";

export default function AIJuriPage() {
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<"blog" | "social" | "email" | "general">("blog");
  const [criteria, setCriteria] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JuriResponse | null>(null);

  const handleEvaluate = async () => {
    if (!content.trim()) {
      toast.error("Lütfen değerlendirmek istediğiniz içeriği girin.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await evaluateWithAIJuri({
        content,
        contentType,
        evaluationCriteria: criteria || undefined,
      });
      setResult(response);
      toast.success("AI Jüri değerlendirmesi tamamlandı!");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Değerlendirme sırasında bir hata oluştu.";
      console.error(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyImproved = () => {
    if (result?.improvedVersion) {
      const plainText = result.improvedVersion.replace(/<[^>]+>/g, "");
      navigator.clipboard.writeText(plainText);
      toast.success("İyileştirilmiş versiyon panoya kopyalandı!");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 60) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "🏆";
    if (score >= 80) return "✅";
    if (score >= 60) return "⚠️";
    return "❌";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          ⚖️ AI Jüri
        </h1>
        <p className="text-muted-foreground mt-2">
          İçeriklerinizi yapay zeka jürimize gönderin, profesyonel değerlendirme ve iyileştirilmiş versiyon alın.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Sol Panel — Girdi */}
        <Card className="lg:col-span-5 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Scale className="h-5 w-5 text-violet-500" />
              Değerlendirme Formu
            </CardTitle>
            <CardDescription>
              İçeriğinizi yapıştırın, türünü seçin ve jüriye gönderin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col">
            <div className="space-y-2">
              <label className="text-sm font-medium">İçerik Türü</label>
              <Select value={contentType} onValueChange={(val: string) => setContentType(val as "blog" | "social" | "email" | "general")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">📝 Blog Yazısı</SelectItem>
                  <SelectItem value="social">📱 Sosyal Medya</SelectItem>
                  <SelectItem value="email">📧 E-Posta</SelectItem>
                  <SelectItem value="general">📄 Genel İçerik</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">İçerik</label>
              <Textarea
                placeholder="Değerlendirmek istediğiniz içeriği buraya yapıştırın..."
                className="min-h-[200px] resize-none flex-1"
                value={content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Özel Değerlendirme Odağı <span className="text-muted-foreground">(opsiyonel)</span>
              </label>
              <Textarea
                placeholder="Örn: SEO performansına özel dikkat et, anahtar kelime yoğunluğunu kontrol et..."
                className="min-h-[60px] resize-none"
                value={criteria}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCriteria(e.target.value)}
              />
            </div>

            <Button
              className="w-full h-12 font-semibold shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              onClick={handleEvaluate}
              disabled={loading || !content.trim()}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Jüri Değerlendiriyor...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Jüriye Gönder
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Sağ Panel — Sonuçlar */}
        <div className="lg:col-span-7 space-y-4">
          {!result && !loading && (
            <Card className="min-h-[400px] flex items-center justify-center bg-muted/30">
              <div className="text-center text-muted-foreground space-y-3 opacity-60">
                <Scale className="h-16 w-16 mx-auto" />
                <p className="text-lg font-medium">Jüri Bekleniyor</p>
                <p className="text-sm">İçeriğinizi gönderin, AI Jüri detaylı analiz yapacak.</p>
              </div>
            </Card>
          )}

          {loading && (
            <Card className="min-h-[400px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="relative mx-auto w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-violet-200 animate-pulse" />
                  <div className="absolute inset-2 rounded-full border-4 border-violet-400 border-t-transparent animate-spin" />
                  <Scale className="absolute inset-0 m-auto h-8 w-8 text-violet-600" />
                </div>
                <p className="text-lg font-medium">AI Jüri değerlendiriyor...</p>
                <p className="text-sm text-muted-foreground">Gemini 2.0 Flash ile analiz ediliyor</p>
              </div>
            </Card>
          )}

          {result && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Genel Skor */}
              <Card className="overflow-hidden">
                <div className={`p-6 ${result.overallScore >= 80 ? "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30" : result.overallScore >= 60 ? "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30" : "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Genel Değerlendirme</p>
                      <p className="text-lg font-semibold mt-1">{result.verdict}</p>
                    </div>
                    <div className="text-center">
                      <div className={`text-4xl font-extrabold ${result.overallScore >= 80 ? "text-emerald-600" : result.overallScore >= 60 ? "text-amber-600" : "text-red-600"}`}>
                        {result.overallScore}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">/ 100 puan</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="secondary" className="text-xs">
                      {result.modelUsed}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(result.evaluatedAt).toLocaleTimeString("tr-TR")}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Kategori Skorları */}
              {result.scores.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-violet-500" />
                      Kategori Puanları
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.scores.map((score, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-lg mt-0.5">{getScoreEmoji(score.score)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{score.category}</span>
                            <Badge
                              variant="outline"
                              className={`text-xs font-mono ${getScoreColor(score.score)}`}
                            >
                              {score.score}/100
                            </Badge>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mb-1.5">
                            <div
                              className={`h-2 rounded-full transition-all duration-1000 ${
                                score.score >= 80 ? "bg-emerald-500" : score.score >= 60 ? "bg-amber-500" : "bg-red-500"
                              }`}
                              style={{ width: `${score.score}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">{score.feedback}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* İyileştirme Önerileri */}
              {result.improvements.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      İyileştirme Önerileri
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.improvements.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* İyileştirilmiş Versiyon */}
              {result.improvedVersion && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        İyileştirilmiş Versiyon
                      </CardTitle>
                      <Button variant="outline" size="sm" className="gap-2" onClick={handleCopyImproved}>
                        <Copy className="h-3.5 w-3.5" />
                        Kopyala
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed border rounded-lg p-4 bg-muted/30"
                      dangerouslySetInnerHTML={{ __html: result.improvedVersion }}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Tekrar Değerlendir */}
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => {
                  setResult(null);
                }}
              >
                <RotateCcw className="h-4 w-4" />
                Yeni Değerlendirme Yap
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
