"use client";

import {
  Briefcase,
  Calendar,
  Code,
  DollarSign,
  ExternalLink,
  Globe,
  LayoutGrid,
  MapPin,
  Plus,
  Star,
  Trash2,
  Trophy,
  User,
} from "lucide-react";
import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui";
import { toast } from "ui";

import { addPortfolioItem, deletePortfolioItem } from "../_actions/portfolio-actions";

interface PortfoyClientProps {
  profile: {
    name: string;
    bio: string | null;
    location: string | null;
    website: string | null;
    image: string | null;
    joinedAt: string;
  };
  skills: string[];
  completedProjects: {
    title: string;
    projectName: string;
    earning: number;
    completedAt: string;
    deliveryUrl: string | null;
  }[];
  sampleWorks: { url: string; title: string }[];
  portfolioItems: {
    id: string;
    title: string;
    description: string | null;
    projectUrl: string | null;
    imageUrl: string | null;
    date: Date | null;
    category: "VIDEO" | "TASARIM" | "YAZILIM" | "DIGITAL_PAZARLAMA" | "DIGER";
  }[];
  stats: { totalEarnings: number; completedCount: number; successRate: number };
}

export default function PortfoyClient({
  profile,
  skills,
  completedProjects,
  sampleWorks,
  portfolioItems = [],
  stats,
}: PortfoyClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectUrl: "",
    imageUrl: "",
    date: "",
    category: "DIGER" as "VIDEO" | "TASARIM" | "YAZILIM" | "DIGITAL_PAZARLAMA" | "DIGER",
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return toast.error("Başlık zorunludur");

    setIsSubmitting(true);
    const res = await addPortfolioItem(formData);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Çalışmanız başarıyla eklendi");
      setIsDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        projectUrl: "",
        imageUrl: "",
        date: "",
        category: "DIGER",
      });
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu çalışmayı portfolyodan kaldırmak istediğinize emin misiniz?")) return;

    setIsDeleting(id);
    const res = await deletePortfolioItem(id);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Çalışma başarıyla kaldırıldı");
    }
    setIsDeleting(null);
  };

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      {/* Profil Kartı */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <CardContent className="py-6">
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 text-3xl font-bold text-primary">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                profile.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              {profile.bio && <p className="mt-1 text-muted-foreground">{profile.bio}</p>}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {profile.location}
                  </span>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Globe className="h-3 w-3" /> Website
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />{" "}
                  {new Date(profile.joinedAt).toLocaleDateString("tr-TR", {
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  üyesi
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* İstatistik */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="py-5 text-center">
            <Trophy className="mx-auto mb-1 h-6 w-6 text-amber-500" />
            <p className="text-2xl font-bold">{stats.completedCount}</p>
            <p className="text-xs text-muted-foreground">Tamamlanan Proje</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5 text-center">
            <DollarSign className="mx-auto mb-1 h-6 w-6 text-emerald-500" />
            <p className="text-2xl font-bold">₺{stats.totalEarnings.toLocaleString("tr-TR")}</p>
            <p className="text-xs text-muted-foreground">Toplam Kazanç</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5 text-center">
            <Star className="mx-auto mb-1 h-6 w-6 text-blue-500" />
            <p className="text-2xl font-bold">{stats.successRate}%</p>
            <p className="text-xs text-muted-foreground">Başarı Oranı</p>
          </CardContent>
        </Card>
      </div>

      {/* Yetenekler */}
      {skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Code className="h-5 w-5" /> Yetenekler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <Badge key={s} variant="secondary" className="px-3 py-1 text-sm">
                  {s}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dışarıdaki (Özel Eklenen) Çalışmalar */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <LayoutGrid className="h-5 w-5" />
            Portfolyom
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Öğe Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Portfolyoya Öğesi Ekle</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Başlık *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Proje veya Çalışmanın Adı"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val: any) => setFormData({ ...formData, category: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori Seç" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VIDEO">Video</SelectItem>
                        <SelectItem value="TASARIM">Tasarım</SelectItem>
                        <SelectItem value="YAZILIM">Yazılım</SelectItem>
                        <SelectItem value="DIGITAL_PAZARLAMA">Dijital Pazarlama</SelectItem>
                        <SelectItem value="DIGER">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Tarih</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Açıklama</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Çalışmanın kısa bir özeti..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectUrl">Proje/Demo Linki (Opsiyonel)</Label>
                  <Input
                    id="projectUrl"
                    type="url"
                    value={formData.projectUrl}
                    onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                    placeholder="https://"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Görsel URL (Opsiyonel)</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Ekleniyor..." : "Ekle"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {portfolioItems.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <LayoutGrid className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Henüz portfolyonuzda ekli çalışma yok</p>
              <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
                Geçmiş deneyimlerinizi göstererek markaların size olan güvenini artırın.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {portfolioItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
                >
                  {item.imageUrl ? (
                    <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video w-full shrink-0 flex-col items-center justify-center border-b bg-muted/50 text-muted-foreground">
                      <Code className="mb-2 h-8 w-8 opacity-50" />
                      <span className="text-xs">Görsel Yok</span>
                    </div>
                  )}

                  <div className="relative flex flex-1 flex-col p-4">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="line-clamp-1 text-base font-semibold">{item.title}</h3>
                      <Badge
                        variant="secondary"
                        className="shrink-0 text-[10px] font-semibold uppercase"
                      >
                        {item.category.replace("_", " ")}
                      </Badge>
                    </div>

                    {item.description && (
                      <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                      {item.projectUrl ? (
                        <a
                          href={item.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                        >
                          Projeyi Gez
                          <ExternalLink className="h-3 w-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                        </a>
                      ) : (
                        <span className="text-xs italic text-muted-foreground">Link eklenmedi</span>
                      )}

                      <Button
                        size="icon"
                        variant="ghost"
                        className="-mr-2 h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting === item.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Platform Üzerinde Tamamlanan Projeler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="h-5 w-5" />
            Platform Üzerinde Tamamlanan Projeler
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedProjects.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Henüz sistemde tamamlanan proje yok.
            </p>
          ) : (
            <div className="space-y-2">
              {completedProjects.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/30"
                >
                  <div>
                    <h3 className="text-sm font-semibold">{p.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {p.projectName} • {new Date(p.completedAt).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-emerald-600">
                      ₺{p.earning.toLocaleString("tr-TR")}
                    </span>
                    {p.deliveryUrl && (
                      <a
                        href={p.deliveryUrl}
                        target="_blank"
                        rel="noopener"
                        className="text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
