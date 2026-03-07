"use client";

import { useState, useTransition } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle,
  Button, Input, toast, Label,
} from "ui";
import { PenLine, Save } from "lucide-react";
import { createBlogPost } from "@/app/_actions/blog-actions";
import { useRouter } from "next/navigation";

const categories = [
  { value: "GENEL", label: "Genel" },
  { value: "TEKNIK", label: "Teknik" },
  { value: "KARIYER", label: "Kariyer" },
  { value: "HABERLER", label: "Haberler" },
];

export default function BlogEditor() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("GENEL");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [published, setPublished] = useState(false);

  const readingTime = Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200));

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Başlık ve içerik zorunludur.");
      return;
    }

    startTransition(async () => {
      const res = await createBlogPost({
        title, content, excerpt, category, tags, coverImage, published,
      });
      if (res.success) {
        toast.success(published ? "Makale yayınlandı! 🎉" : "Taslak kaydedildi ✅");
        router.push(published ? `/topluluk/${res.slug}` : "/topluluk");
      } else {
        toast.error(res.error || "İşlem başarısız.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <PenLine className="h-7 w-7" /> Makale Yaz
        </h1>
        <p className="text-muted-foreground mt-1">
          Deneyimlerinizi paylaşın, topluluğa katkıda bulunun
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardContent className="py-5 space-y-4">
              <div>
                <Label>Başlık *</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Dikkat çekici bir başlık..." className="text-lg font-medium" />
              </div>
              <div>
                <Label>İçerik * <span className="text-muted-foreground text-xs ml-1">({readingTime} dk okuma)</span></Label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Makalenizi buraya yazın... HTML desteklenir."
                  rows={15}
                  className="w-full rounded-md border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed"
                />
              </div>
              <div>
                <Label>Kısa Özet</Label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Makalenin listede görünecek kısa tanıtımı..."
                  rows={2}
                  className="w-full rounded-md border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Ayarlar</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Kategori</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <Label>Etiketler</Label>
                <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, nextjs, freelancer" />
                <p className="text-[10px] text-muted-foreground mt-1">Virgülle ayırın</p>
              </div>
              <div>
                <Label>Kapak Görseli (URL)</Label>
                <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-sm font-medium">Hemen Yayınla</p>
                  <p className="text-[10px] text-muted-foreground">Kapalıysa taslak olarak kaydedilir</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPublished(!published)}
                  className={`w-11 h-6 rounded-full transition-colors ${published ? "bg-primary" : "bg-gray-300"} relative`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${published ? "left-6" : "left-1"}`} />
                </button>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSubmit} disabled={isPending} className="w-full gap-2 h-11">
            <Save className="h-4 w-4" /> {published ? "Yayınla" : "Taslak Kaydet"}
          </Button>
        </div>
      </div>
    </div>
  );
}
