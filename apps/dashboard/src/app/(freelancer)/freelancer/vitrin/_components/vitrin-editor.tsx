"use client";

import { useState, useTransition } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle,
  Button, Input, Badge, toast,
  Label,
} from "ui";
import { 
  Building2, Monitor, Code, Palette, Smartphone, Sparkles, Plus, Image as ImageIcon, Github, Linkedin, Twitter, Globe, Lock, Unlock, Mail, Save, Eye, ExternalLink
} from "lucide-react";
import { createVitrin, updateVitrin } from "@/app/_actions/vitrin-actions";
import { useRouter } from "next/navigation";

const themes = [
  { id: "default", name: "Açık", bg: "bg-white", accent: "border-gray-300", preview: "bg-gradient-to-br from-gray-50 to-white" },
  { id: "dark", name: "Koyu", bg: "bg-gray-900", accent: "border-gray-700", preview: "bg-gradient-to-br from-gray-900 to-gray-800" },
  { id: "ocean", name: "Okyanus", bg: "bg-blue-50", accent: "border-blue-400", preview: "bg-gradient-to-br from-blue-900 to-cyan-700" },
  { id: "sunset", name: "Gün Batımı", bg: "bg-orange-50", accent: "border-orange-400", preview: "bg-gradient-to-br from-orange-500 to-pink-600" },
];

interface VitrinEditorProps {
  initialData: {
    slug: string;
    headline: string | null;
    about: string | null;
    theme: string;
    showEarnings: boolean;
    showContact: boolean;
    socialLinks: Record<string, string> | null;
    techStack: string | null;
  } | null;
}

export default function VitrinEditor({ initialData }: VitrinEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isNew = !initialData;

  const [slug, setSlug] = useState(initialData?.slug || "");
  const [headline, setHeadline] = useState(initialData?.headline || "");
  const [about, setAbout] = useState(initialData?.about || "");
  const [techStack, setTechStack] = useState(initialData?.techStack || "");
  const [theme, setTheme] = useState(initialData?.theme || "default");
  const [showEarnings, setShowEarnings] = useState(initialData?.showEarnings ?? false);
  const [showContact, setShowContact] = useState(initialData?.showContact ?? true);
  const socialRefs = (initialData?.socialLinks as Record<string, string>) || {};
  const [github, setGithub] = useState(socialRefs.github || "");
  const [linkedin, setLinkedin] = useState(socialRefs.linkedin || "");
  const [twitter, setTwitter] = useState(socialRefs.twitter || "");
  const [website, setWebsite] = useState(socialRefs.website || "");

  const handleSave = () => {
    if (!slug.trim()) { toast.error("Slug (URL) zorunludur."); return; }

    const data = {
      slug: slug.trim(),
      headline: headline || null,
      about: about || null,
      theme,
      showEarnings,
      showContact,
      socialLinks: { github, linkedin, twitter, website },
      techStack: techStack || null,
    };

    startTransition(async () => {
      const res = isNew ? await createVitrin(data) : await updateVitrin(data);
      if ("success" in res && res.success) {
        toast.success(isNew ? "Vitrin oluşturuldu! 🎉" : "Vitrin güncellendi ✅");
        router.refresh();
      } else {
        toast.error("error" in res ? res.error || "İşlem başarısız." : "İşlem başarısız.");
      }
    });
  };

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">🎨 Vitrinim</h1>
        <p className="text-muted-foreground mt-1">
          Kişisel vitrin sayfanızı oluşturun — <span className="text-primary font-medium">/vitrin/{slug || "slug"}</span> adresinden erişilebilir
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Editor — Sol */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Globe className="h-5 w-5" /> Temel Bilgiler</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Slug (URL)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/vitrin/</span>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="ahmet-yilmaz" />
                </div>
              </div>
              <div>
                <Label>Başlık (Headline)</Label>
                <Input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Senior React Developer" />
              </div>
              <div>
                <Label>Hakkımda</Label>
                <textarea 
                  value={about} onChange={(e) => setAbout(e.target.value)} 
                  placeholder="Kendinizi tanıtın..." rows={5}
                  className="w-full rounded-md border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <Label>Tech Stack (Virgülle ayırın)</Label>
                <Input value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="React, Next.js, Node.js..." />
                <p className="text-[10px] text-muted-foreground mt-1">Örn: React, Node.js, TypeScript</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Palette className="h-5 w-5" /> Tema</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      theme === t.id ? `${t.accent} ring-2 ring-primary/30` : "border-transparent hover:border-muted"
                    }`}
                  >
                    <div className={`h-12 rounded-md ${t.preview}`} />
                    <p className="text-xs font-medium mt-2 text-center">{t.name}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Sosyal Medya</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2"><Github className="h-4 w-4 flex-shrink-0" /><Input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/..." /></div>
              <div className="flex items-center gap-2"><Linkedin className="h-4 w-4 flex-shrink-0" /><Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." /></div>
              <div className="flex items-center gap-2"><Twitter className="h-4 w-4 flex-shrink-0" /><Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://twitter.com/..." /></div>
              <div className="flex items-center gap-2"><Globe className="h-4 w-4 flex-shrink-0" /><Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://website.com" /></div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Kazançları Göster</p>
                  <p className="text-xs text-muted-foreground">Toplam kazancınız vitrinde görünsün mü?</p>
                </div>
                <button type="button" onClick={() => setShowEarnings(!showEarnings)} className={`w-11 h-6 rounded-full transition-colors ${showEarnings ? "bg-primary" : "bg-gray-300"} relative`}>
                  <span className={`block w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${showEarnings ? "left-6" : "left-1"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">İletişim Bilgisi</p>
                  <p className="text-xs text-muted-foreground">Profil bilgileriniz vitrinde görünsün mü?</p>
                </div>
                <button type="button" onClick={() => setShowContact(!showContact)} className={`w-11 h-6 rounded-full transition-colors ${showContact ? "bg-primary" : "bg-gray-300"} relative`}>
                  <span className={`block w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${showContact ? "left-6" : "left-1"}`} />
                </button>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} disabled={isPending} className="gap-2 h-12 text-base">
            <Save className="h-5 w-5" /> {isNew ? "Vitrin Oluştur" : "Değişiklikleri Kaydet"}
          </Button>
        </div>

        {/* Canlı Önizleme — Sağ */}
        <div className="md:col-span-2">
          <p className="text-sm font-semibold mb-3 flex items-center gap-2"><Eye className="h-4 w-4" /> Canlı Önizleme</p>
          <div className={`rounded-xl overflow-hidden border ${currentTheme.preview} min-h-[400px] p-6 ${theme === "dark" ? "text-white" : ""}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-xl font-bold">
                👤
              </div>
              <div>
                <h2 className="text-lg font-bold">{headline || "Başlık"}</h2>
                <p className="text-xs opacity-70">/vitrin/{slug || "slug"}</p>
              </div>
            </div>
            <p className="text-sm opacity-80 mt-3 line-clamp-3">{about || "Hakkımda yazısı burada görünecek..."}</p>
            {showEarnings && <Badge className="mt-3 bg-white/20 text-inherit">💰 Kazanç Görünür</Badge>}
            {showContact && <Badge className="mt-1 bg-white/20 text-inherit">📧 İletişim Görünür</Badge>}
            <div className="mt-4 flex gap-2">
              {github && <Badge variant="secondary" className="text-xs">GitHub</Badge>}
              {linkedin && <Badge variant="secondary" className="text-xs">LinkedIn</Badge>}
              {twitter && <Badge variant="secondary" className="text-xs">Twitter</Badge>}
            </div>
          </div>
          {!isNew && slug && (
            <a href={`/vitrin/${slug}`} target="_blank" className="flex items-center gap-1 text-sm text-primary mt-3 hover:underline">
              <ExternalLink className="h-3.5 w-3.5" /> Vitrini Görüntüle
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
