"use client";

import { Briefcase, MoreVertical, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
  toast,
} from "ui";

import { createProject, updateProjectStatus } from "../_actions/project-actions";

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  status: string;
  budget: number | null;
  agencyName: string | null;
  jobCount: number;
  proposalCount: number;
  createdAt: string;
}

interface ProjelerClientProps {
  projects: ProjectItem[];
}

const statusMap: Record<string, { label: string; variant: string }> = {
  ACTIVE: { label: "Devam Ediyor", variant: "default" },
  IN_REVIEW: { label: "İncelemede", variant: "secondary" },
  COMPLETED: { label: "Tamamlandı", variant: "outline" },
  CANCELLED: { label: "İptal", variant: "destructive" },
  DRAFT: { label: "Taslak", variant: "outline" },
  PLANNING: { label: "Planlanıyor", variant: "outline" },
};

export default function ProjelerClient({ projects }: ProjelerClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Yeni proje form state
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    budget: "",
  });

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.agencyName && p.agencyName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreate = async () => {
    if (!newProject.name || !newProject.description) return;
    setIsCreating(true);
    try {
      const res = await createProject({
        name: newProject.name,
        description: newProject.description,
        budget: Number(newProject.budget) || 0,
      });
      if (res.success) {
        setIsDialogOpen(false);
        setNewProject({ name: "", description: "", budget: "" });
        router.refresh();
        toast.success("Proje ve iş ilanı başarıyla oluşturuldu!");
      } else {
        toast.error(res.error || "Hata oluştu.");
      }
    } catch {
      toast.error("Proje oluşturulurken hata oluştu.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleStatusUpdate = async (projectId: string, newStatus: string) => {
    const res = await updateProjectStatus(projectId, newStatus);
    if (res.success) {
      router.refresh();
      toast.success("Proje durumu güncellendi.");
    } else {
      toast.error(res.error || "Hata oluştu.");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projelerim</h1>
          <p className="text-muted-foreground">
            Tüm aktif ve geçmiş projelerinizi buradan yönetebilirsiniz.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Yeni Proje + İlan Oluştur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Yeni Proje & İş İlanı</DialogTitle>
              <DialogDescription>
                Proje oluşturun, otomatik olarak Pazar Yerine de ilan olarak yayınlanacaktır.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="proj-name">Proje Adı</Label>
                <Input
                  id="proj-name"
                  placeholder="Örn: Q4 Sosyal Medya Kampanyası"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proj-desc">Açıklama</Label>
                <Textarea
                  id="proj-desc"
                  placeholder="Projenin kapsamını ve beklentilerinizi açıklayın..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proj-budget">Bütçe (₺)</Label>
                <Input
                  id="proj-budget"
                  type="number"
                  placeholder="50000"
                  value={newProject.budget}
                  onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? "Oluşturuluyor..." : "Oluştur & Yayınla"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Arama */}
      <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Proje veya Ajans ara..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="h-4 w-4" />
          <span>{projects.length} proje</span>
        </div>
      </div>

      {/* Tablo */}
      <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Proje Adı</TableHead>
              <TableHead>Yürüten Ajans</TableHead>
              <TableHead>Bütçe</TableHead>
              <TableHead>İlan / Teklif</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">Aksiyon</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  {projects.length === 0
                    ? "Henüz projeniz yok. Yeni bir proje oluşturun!"
                    : "Arama kriterlerine uygun proje bulunamadı."}
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => {
                const status = statusMap[project.status] || {
                  label: project.status,
                  variant: "outline",
                };
                return (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.agencyName || "—"}</TableCell>
                    <TableCell>
                      {project.budget ? `₺${project.budget.toLocaleString("tr-TR")}` : "—"}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs">
                        {project.jobCount} ilan / {project.proposalCount} teklif
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(project.createdAt)}</TableCell>
                    <TableCell>
                      {/* @ts-expect-error - Badge variant tipi */}
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/marka/projeler/${project.id}/teklifler`)}
                          >
                            📩 Teklifleri Gör ({project.proposalCount})
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/marka/projeler/${project.id}/teslimat`)}
                          >
                            📦 Teslimatları Gör
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(project.id, "IN_REVIEW")}
                          >
                            İncelemeye Al
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(project.id, "COMPLETED")}
                          >
                            Tamamlandı Olarak İşaretle
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(project.id, "CANCELLED")}
                            className="text-destructive"
                          >
                            İptal Et
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
