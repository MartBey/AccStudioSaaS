"use client";

import { useState } from "react";
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Badge } from "ui";
import { Activity, Globe, Search, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { analyzeWebsiteAction } from "seo";
import { SeoResponse, SeoScore } from "types";

export default function SeoAnalyzerPage() {
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeoResponse | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    
    // Auto prefix http
    const parsedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    setLoading(true);
    setResult(null);

    try {
      const response = await analyzeWebsiteAction({ url: parsedUrl, keyword });
      setResult(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">🔎 SEO Analiz Aracı</h1>
        <p className="text-muted-foreground mt-2">
          Web sitenizin teknik sağlığını ve anahtar kelime performansını saniyeler içinde ölçün.
        </p>
      </div>

      <Card className="border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1 relative">
              <label className="text-sm font-medium">Hedef URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="ornek.com" 
                  className="pl-9 h-12 text-lg" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
              </div>
            </div>
            
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Odak Anahtar Kelime (Opsiyonel)</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Örn: seo ajansı istanbul" 
                  className="pl-9 h-12" 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
              </div>
            </div>

            <Button 
              className="h-12 px-8 min-w-[150px] font-semibold text-md" 
              onClick={handleAnalyze}
              disabled={loading || !url.trim()}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
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
        <div className="py-20 flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-xl border-border/60 bg-muted/20">
          <Activity className="h-16 w-16 mb-4 opacity-30" />
          <h3 className="text-xl font-medium text-foreground mb-2">Henüz Analiz Yok</h3>
          <p className="max-w-md">Sol üstteki kutucuklara sitenizi ve anahtar kelimenizi girerek detaylı bir sağlık taraması başlatabilirsiniz.</p>
        </div>
      )}

      {/* Results State */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid gap-6 md:grid-cols-4">
            <ScoreCard title="Genel SEO" score={result.scores.seo} color="text-blue-500" />
            <ScoreCard title="Performans" score={result.scores.performance} color="text-amber-500" />
            <ScoreCard title="Erişilebilirlik" score={result.scores.accessibility} color="text-green-500" />
            <ScoreCard title="Best Practices" score={result.scores.bestPractices} color="text-purple-500" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">Bulgular ve Öneriler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.issues.map((issue) => (
                  <div key={issue.id} className="flex gap-4 p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                    <div className="mt-0.5">
                      {issue.type === 'error' && <AlertCircle className="h-5 w-5 text-destructive" />}
                      {issue.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                      {issue.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{issue.title}</h4>
                        <Badge variant="outline" className={
                          issue.type === 'error' ? 'border-destructive text-destructive' :
                          issue.type === 'warning' ? 'border-amber-500 text-amber-500' : 'border-blue-500 text-blue-500'
                        }>
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
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground text-sm">Hedef URL</span>
                  <span className="font-medium text-sm truncate max-w-[150px]" title={result.url}>{result.url}</span>
                </div>
                {result.keyword && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground text-sm">Odak Kelime</span>
                    <span className="font-medium text-sm">{result.keyword}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground text-sm">Kelime Sayısı</span>
                  <span className="font-medium text-sm">{result.wordCount} Kelime</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground text-sm">Yüklenme Süresi</span>
                  <span className="font-medium text-sm">{result.loadTimeMs} ms</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreCard({ title, score, color }: { title: string, score: number, color: string }) {
  // Determine ring color based on score thresholds (Lighthouse style)
  const ringColor = score >= 90 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  const circleCircumference = 2 * Math.PI * 36;
  const strokeDashoffset = circleCircumference - (score / 100) * circleCircumference;

  return (
    <Card className="flex flex-col items-center justify-center p-6 bg-card text-center hover:bg-muted/30 transition-colors">
      <h3 className="font-semibold text-sm text-muted-foreground mb-4">{title}</h3>
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Background circle */}
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle 
            cx="48" 
            cy="48" 
            r="36" 
            className="stroke-muted fill-transparent" 
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
        <div className="absolute flex items-center justify-center flex-col">
          <span className={`text-3xl font-bold ${color}`}>{score}</span>
        </div>
      </div>
    </Card>
  );
}
