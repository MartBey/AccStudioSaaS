"use client";

import { Copy, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { ContentType } from "types";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  toast,
} from "ui";

import { generateContentWithTracking } from "@/app/_actions/content-ai-actions";

export default function ContentAIPage() {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<ContentType>("blog");
  const [tone, setTone] = useState<string>("professional");
  const [language, setLanguage] = useState<"tr" | "en">("tr");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tokensUsed, setTokensUsed] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await generateContentWithTracking({ prompt, type, tone, language });
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
        <p className="mt-2 text-muted-foreground">
          Gelişmiş AccStudio Zeka Asistanı ile saniyeler içinde büyüleyici metinler oluşturun.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="flex h-fit flex-col md:col-span-5">
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
                  <SelectItem value="product">Ürün Açıklaması</SelectItem>
                  <SelectItem value="ad">Reklam Metni (Ad Copy)</SelectItem>
                  <SelectItem value="seo">SEO Meta Title/Description</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ton / Üslup</label>
              <Select value={tone} onValueChange={(val) => setTone(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Ton seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">👔 Profesyonel</SelectItem>
                  <SelectItem value="casual">☕ Samimi</SelectItem>
                  <SelectItem value="persuasive">🎯 İkna Edici</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Dil</label>
              <Select value={language} onValueChange={(val) => setLanguage(val as "tr" | "en")}>
                <SelectTrigger>
                  <SelectValue placeholder="Dil seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tr">🇹🇷 Türkçe</SelectItem>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
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
              className="text-md h-12 w-full font-semibold shadow-md transition-all hover:shadow-lg"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
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

        <Card className="flex min-h-[400px] flex-col bg-muted/40 md:col-span-7">
          <CardHeader className="flex flex-row items-center justify-between rounded-t-lg border-b bg-card pb-4">
            <CardTitle className="text-xl">Sonuç Tablosu</CardTitle>
            {tokensUsed && (
              <Badge variant="secondary" className="font-mono">
                {tokensUsed} Tokens
              </Badge>
            )}
          </CardHeader>
          <CardContent className="relative flex-1 p-6">
            {!result && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <Sparkles className="mb-4 h-16 w-16" />
                <p>Oluşturulan metin burada görünecek.</p>
              </div>
            )}

            {result && (
              <div className="space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-4">
                <div
                  className="prose prose-blue dark:prose-invert prose-p:leading-relaxed prose-headings:font-bold prose-h1:text-2xl prose-h3:text-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: result }}
                />

                <div className="mt-auto flex items-center gap-3 border-t pt-6">
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleCopy}>
                    <Copy className="h-4 w-4" /> Kopyala
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-green-500 hover:bg-green-50 hover:text-green-600"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-red-50 hover:text-red-600"
                  >
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
