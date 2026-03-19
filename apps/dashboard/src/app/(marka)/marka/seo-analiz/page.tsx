"use client";

import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Globe,
  History,
  Info,
  LayoutDashboard,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SeoResponse } from "types";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "ui";

import { analyzeAndSaveWebsite, getSeoHistory } from "@/app/_actions/seo-actions";

export default function SeoAnalyzerPage() {
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeoResponse | null>(null);
  const [history, setHistory] = useState<SeoResponse[]>([]);
  const [activeTab, setActiveTab] = useState("analyze");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getSeoHistory();
    // Map DB model to SeoResponse interface
    const mappedData: SeoResponse[] = (data || []).map((item: any) => ({
      id: item.id,
      url: item.url,
      keyword: item.keyword || undefined,
      timestamp: new Date(item.createdAt),
      scores: {
        performance: item.performance,
        accessibility: item.accessibility,
        bestPractices: item.bestPractices,
        seo: item.seo,
      },
      issues: item.issues as any,
      wordCount: item.wordCount,
      loadTimeMs: item.loadTimeMs,
    }));
    setHistory(mappedData);
  };

  const handleAnalyze = async () => {
    if (!url.trim()) return;

    // Auto prefix http
    const parsedUrl = url.startsWith("http") ? url : `https://${url}`;

    setLoading(true);
    setResult(null);

    try {
      const response = await analyzeAndSaveWebsite({ url: parsedUrl, keyword });
      setResult(response);
      loadHistory(); // Refresh history after new analysis
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (item: SeoResponse) => {
    setResult(item);
    setActiveTab("analyze");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">🔎 SEO Analiz Aracı</h1>
          <p className="mt-2 text-muted-foreground">
            Web sitenizin teknik sağlığını ve anahtar kelime performansını saniyeler içinde ölçün.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="analyze" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Analiz Et
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Geçmiş ({history.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="space-y-6 pt-4">
          <Card className="border-t-4 border-t-primary shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col items-end gap-4 md:flex-row">
                <div className="relative flex-1 space-y-2">
                  <label className="text-sm font-medium">Hedef URL</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="ornek.com"
                      className="h-12 pl-9 text-lg"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Odak Anahtar Kelime (Opsiyonel)</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Örn: seo ajansı istanbul"
                      className="h-12 pl-9"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                    />
                  </div>
                </div>

                <Button
                  className="text-md h-12 min-w-[150px] px-8 font-semibold"
                  onClick={handleAnalyze}
                  disabled={loading || !url.trim()}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Taranıyor...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Analiz Et
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Placeholder State */}
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-muted/20 py-20 text-center text-muted-foreground">
              <Activity className="mb-4 h-16 w-16 opacity-30" />
              <h3 className="mb-2 text-xl font-medium text-foreground">Henüz Analiz Yok</h3>
              <p className="max-w-md">
                Sol üstteki kutucuklara sitenizi ve anahtar kelimenizi girerek detaylı bir sağlık
                taraması başlatabilirsiniz.
              </p>
            </div>
          )}

          {/* Results State */}
          {result && (
            <div className="space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid gap-6 md:grid-cols-4">
                <ScoreCard title="Genel SEO" score={result.scores.seo} color="text-blue-500" />
                <ScoreCard
                  title="Performans"
                  score={result.scores.performance}
                  color="text-amber-500"
                />
                <ScoreCard
                  title="Erişilebilirlik"
                  score={result.scores.accessibility}
                  color="text-green-500"
                />
                <ScoreCard
                  title="Best Practices"
                  score={result.scores.bestPractices}
                  color="text-purple-500"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-xl">Bulgular ve Öneriler</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.issues.map((issue) => (
                      <div
                        key={issue.id}
                        className="flex gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="mt-0.5">
                          {issue.type === "error" && (
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          )}
                          {issue.type === "warning" && (
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                          )}
                          {issue.type === "info" && <Info className="h-5 w-5 text-blue-500" />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold">{issue.title}</h4>
                            <Badge
                              variant="outline"
                              className={
                                issue.type === "error"
                                  ? "border-destructive text-destructive"
                                  : issue.type === "warning"
                                    ? "border-amber-500 text-amber-500"
                                    : "border-blue-500 text-blue-500"
                              }
                            >
                              {issue.type.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{issue.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="text-xl">Sayfa İstatistikleri</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between border-b py-2">
                      <span className="text-sm text-muted-foreground">Hedef URL</span>
                      <span
                        className="max-w-[150px] truncate text-sm font-medium"
                        title={result.url}
                      >
                        {result.url}
                      </span>
                    </div>
                    {result.keyword && (
                      <div className="flex items-center justify-between border-b py-2">
                        <span className="text-sm text-muted-foreground">Odak Kelime</span>
                        <span className="text-sm font-medium">{result.keyword}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-b py-2">
                      <span className="text-sm text-muted-foreground">Kelime Sayısı</span>
                      <span className="text-sm font-medium">{result.wordCount} Kelime</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">Yüklenme Süresi</span>
                      <span className="text-sm font-medium">{result.loadTimeMs} ms</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Geçmiş Analizler</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">
                  Henüz kaydedilmiş bir analiz bulunmuyor.
                </div>
              ) : (
                <div className="grid gap-4">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted"
                      onClick={() => handleSelectHistory(item)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Globe className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{item.url}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.timestamp.toLocaleString("tr-TR")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            SEO
                          </p>
                          <p className="text-lg font-bold text-blue-500">{item.scores.seo}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            PERF
                          </p>
                          <p className="text-lg font-bold text-amber-500">
                            {item.scores.performance}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Görüntüle
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ScoreCard({ title, score, color }: { title: string; score: number; color: string }) {
  // Determine ring color based on score thresholds (Lighthouse style)
  const ringColor = score >= 90 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const circleCircumference = 2 * Math.PI * 36;
  const strokeDashoffset = circleCircumference - (score / 100) * circleCircumference;

  return (
    <Card className="flex flex-col items-center justify-center bg-card p-6 text-center transition-colors hover:bg-muted/30">
      <h3 className="mb-4 text-sm font-semibold text-muted-foreground">{title}</h3>
      <div className="relative flex h-24 w-24 items-center justify-center">
        {/* Background circle */}
        <svg className="absolute h-full w-full -rotate-90 transform">
          <circle
            cx="48"
            cy="48"
            r="36"
            className="fill-transparent stroke-muted"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="48"
            cy="48"
            r="36"
            className="fill-transparent transition-all duration-1000 ease-in-out"
            strokeWidth="8"
            stroke={ringColor}
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${color}`}>{score}</span>
        </div>
      </div>
    </Card>
  );
}
