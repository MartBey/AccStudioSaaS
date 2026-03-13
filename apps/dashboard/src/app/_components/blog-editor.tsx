"use client";

import { PenLine, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, toast } from "ui";

import { createBlogPost } from "@/app/_actions/blog-actions";

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
        title,
        content,
        excerpt,
        category,
        tags,
        coverImage,
        published,
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
    <div className="flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <PenLine className="h-7 w-7" /> Makale Yaz
        </h1>
        <p className="mt-1 text-muted-foreground">
          Deneyimlerinizi paylaşın, topluluğa katkıda bulunun
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <Card>
            <CardContent className="space-y-4 py-5">
              <div>
                <Label>Başlık *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Dikkat çekici bir başlık..."
                  className="text-lg font-medium"
                />
              </div>
              <div>
                <Label>
                  İçerik *{" "}
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({readingTime} dk okuma)
                  </span>
                </Label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Makalenizi buraya yazın... HTML desteklenir."
                  rows={15}
                  className="w-full resize-none rounded-md border px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <Label>Kısa Özet</Label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Makalenin listede görünecek kısa tanıtımı..."
                  rows={2}
                  className="w-full resize-none rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Ayarlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Kategori</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Etiketler</Label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="react, nextjs, freelancer"
                />
                <p className="mt-1 text-[10px] text-muted-foreground">Virgülle ayırın</p>
              </div>
              <div>
                <Label>Kapak Görseli (URL)</Label>
                <Input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-sm font-medium">Hemen Yayınla</p>
                  <p className="text-[10px] text-muted-foreground">
                    Kapalıysa taslak olarak kaydedilir
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPublished(!published)}
                  className={`h-6 w-11 rounded-full transition-colors ${published ? "bg-primary" : "bg-gray-300"} relative`}
                >
                  <span
                    className={`absolute top-1 block h-4 w-4 rounded-full bg-white transition-all ${published ? "left-6" : "left-1"}`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSubmit} disabled={isPending} className="h-11 w-full gap-2">
            <Save className="h-4 w-4" /> {published ? "Yayınla" : "Taslak Kaydet"}
          </Button>
        </div>
      </div>
    </div>
  );
}
