"use client";

import { useState } from "react";
import { Button, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Card, CardHeader, CardTitle, CardContent, Badge, toast } from "ui";
import { Sparkles, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { generateContentWithTracking } from "@/app/_actions/content-ai-actions";
import { ContentType } from "types";

export default function ContentAIPage() {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<ContentType>("blog");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tokensUsed, setTokensUsed] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const response = await generateContentWithTracking({ prompt, type });
      setResult(response.content);
      setTokensUsed(response.tokens);
    } catch (error) {
      console.error(error);
      setResult("<p class='text-destructive'>İçerik üretilirken bir hata oluştu.</p>");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      // Strip HTML tags for clipboard (simple regex)
      const plainText = result.replace(/<[^>]+>/g, "");
      navigator.clipboard.writeText(plainText);
      toast.success("Metin panoya kopyalandı!");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">✨ AI İçerik Üretici</h1>
        <p className="text-muted-foreground mt-2">
          Gelişmiş AccStudio Zeka Asistanı ile saniyeler içinde büyüleyici metinler oluşturun.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-5 flex flex-col h-fit">
          <CardHeader>
            <CardTitle className="text-xl">Parametreler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">İçerik Türü</label>
              <Select value={type} onValueChange={(val) => setType(val as ContentType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tür seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">Blog Yazısı</SelectItem>
                  <SelectItem value="social">Sosyal Medya (Instagram/LinkedIn)</SelectItem>
                  <SelectItem value="email">E-Bülten / Pazarlama E-postası</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ne hakkında yazmak istiyorsunuz?</label>
              <Textarea
                placeholder="Örn: Yeni çıkardığımız doğa dostu su matarası kampanyasının lansman metni..."
                className="min-h-[150px] resize-none"
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
              />
            </div>

            <Button 
              className="w-full h-12 text-md transition-all font-semibold shadow-md hover:shadow-lg" 
              onClick={handleGenerate} 
              disabled={loading || !prompt.trim()}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  Zeka İşleniyor...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  İçerik Oluştur
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-7 bg-muted/40 min-h-[400px] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-card rounded-t-lg pb-4">
            <CardTitle className="text-xl">Sonuç Tablosu</CardTitle>
            {tokensUsed && (
              <Badge variant="secondary" className="font-mono">
                {tokensUsed} Tokens
              </Badge>
            )}
          </CardHeader>
          <CardContent className="flex-1 p-6 relative">
            {!result && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <Sparkles className="h-16 w-16 mb-4" />
                <p>Oluşturulan metin burada görünecek.</p>
              </div>
            )}
            
            {result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div 
                  className="prose prose-blue dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-h1:text-2xl prose-h3:text-lg" 
                  dangerouslySetInnerHTML={{ __html: result }} 
                />
                
                <div className="flex items-center gap-3 pt-6 border-t mt-auto">
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleCopy}>
                    <Copy className="h-4 w-4" /> Kopyala
                  </Button>
                  <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-600 hover:bg-green-50">
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-red-600 hover:bg-red-50">
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
