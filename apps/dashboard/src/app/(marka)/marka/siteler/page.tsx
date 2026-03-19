"use client";

import { Edit, ExternalLink, Globe, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Site } from "types";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "ui";
import { toast } from "ui";

import { createSite, deleteSite, getUserSites } from "@/app/_actions/site-actions";

export default function SitelerPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSiteName, setNewSiteName] = useState("");
  const [creating, setCreating] = useState(false);

  const loadSites = async () => {
    setLoading(true);
    try {
      const data = await getUserSites();
      setSites(data);
    } catch (error) {
      toast.error("Siteler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

  const handleCreate = async () => {
    if (!newSiteName.trim()) return;
    setCreating(true);
    try {
      await createSite(newSiteName);
      toast.success("Site başarıyla oluşturuldu.");
      setIsCreateOpen(false);
      setNewSiteName("");
      loadSites();
    } catch (error) {
      toast.error("Site oluşturulurken bir hata oluştu.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu siteyi silmek istediğinize emin misiniz?")) return;
    try {
      await deleteSite(id);
      toast.success("Site silindi.");
      loadSites();
    } catch (error) {
      toast.error("Site silinirken bir hata oluştu.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">🌐 Web Sitelerim</h1>
          <p className="mt-2 text-muted-foreground">
            Yapay zeka ile oluşturduğunuz web sitelerini buradan yönetebilirsiniz.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Yeni Site Oluştur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Web Sitesi</DialogTitle>
              <DialogDescription>
                Siteniz için bir isim verin. Daha sonra içeriği düzenleyebilirsiniz.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Örn: Benim Harika Sitem"
                value={newSiteName}
                onChange={(e) => setNewSiteName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleCreate} disabled={creating}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Oluştur
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : sites.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-muted/20 py-20 text-center text-muted-foreground">
          <Globe className="mb-4 h-16 w-16 opacity-30" />
          <h3 className="mb-2 text-xl font-medium text-foreground">Henüz Siteniz Yok</h3>
          <p className="max-w-md">
            Hemen bir site oluşturun ve yapay zeka ile içeriğinizi anında hazırlayın.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => setIsCreateOpen(true)}>
            İlk Sitemi Oluştur
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <Card key={site.id} className="overflow-hidden transition-all hover:shadow-md">
              <div className="flex aspect-video w-full items-center justify-center border-b bg-muted">
                <Globe className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="line-clamp-1">{site.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  {site.domain || "accstudio.app/site-id"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-xs text-muted-foreground">
                  Son güncelleme: {new Date(site.updatedAt).toLocaleDateString("tr-TR")}
                </div>
              </CardContent>
              <CardFooter className="flex items-center gap-2 p-4 pt-0">
                <Button asChild variant="outline" className="flex-1 gap-2">
                  <Link href={`/builder/${site.id}`}>
                    <Edit className="h-4 w-4" />
                    Düzenle
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="icon" title="Önizle">
                  <Link href={`/preview/${site.id}`} target="_blank">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleDelete(site.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
