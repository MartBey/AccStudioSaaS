"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  Clock,
  DollarSign,
  Filter,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  toast,
} from "ui";

import { applyToJob } from "../_actions/job-actions";

// Frontend Job tipi
interface JobListingProps {
  id: string;
  title: string;
  description: string;
  budget: number | null;
  status: string;
  companyName: string;
  isVerified: boolean;
  proposalCount: number;
  createdAt: string;
  projectName: string;
}

interface JobBoardClientProps {
  jobs: JobListingProps[];
  filterCategories: string[];
}

export default function JobBoardClient({ jobs, filterCategories }: JobBoardClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxBudget, setMaxBudget] = useState(150000);
  const [isApplying, setIsApplying] = useState<string | null>(null);

  // Toggle Category Filter
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleApply = async (jobId: string) => {
    try {
      setIsApplying(jobId);
      await applyToJob(jobId, "Bu ilan için portfolyomu ve yeteneklerimi inceleyebilirsiniz.");
      toast.success("Başvurunuz başarıyla iletildi!");
      router.refresh();
    } catch (_error) {
      toast.error("Başvuru sırasında bir hata oluştu.");
    } finally {
      setIsApplying(null);
    }
  };

  // Filtreleme
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBudget = !job.budget || job.budget <= maxBudget;
    return matchesSearch && matchesBudget;
  });

  // Tarih formatlama
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Bugün";
    if (diffDays === 1) return "Dün";
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString("tr-TR");
  };

  // Animasyon varyantları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Başlık */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Pazar Yeri İlanları
          </h1>
          <p className="mt-1 text-muted-foreground">
            Yeteneklerinize uygun projeleri keşfedin ve başvurun.
          </p>
        </div>
        <Badge
          variant="outline"
          className="gap-2 border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-700"
        >
          <Bookmark className="h-4 w-4" />
          {filteredJobs.length} Aktif İlan
        </Badge>
      </div>

      {/* Filtre Bölümü */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            {/* Arama */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="İlan başlığı, şirket adı veya açıklama ara..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Bütçe Filtresi */}
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="whitespace-nowrap text-sm text-muted-foreground">
                Maks: {maxBudget.toLocaleString("tr-TR")} ₺
              </span>
              <input
                type="range"
                min={0}
                max={300000}
                step={5000}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-32 accent-indigo-600"
              />
            </div>
          </div>

          {/* Kategori Filtreleri */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Filter className="mt-1 h-4 w-4 text-muted-foreground" />
            {filterCategories.map((cat) => (
              <label key={cat} className="flex cursor-pointer items-center gap-1.5">
                <Checkbox
                  checked={selectedCategories.includes(cat)}
                  onCheckedChange={() => toggleCategory(cat)}
                  className="h-3.5 w-3.5"
                />
                <span className="text-xs text-muted-foreground">{cat}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* İlan Kartları */}
      {filteredJobs.length === 0 ? (
        <Card className="border-2 border-dashed border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="mb-4 h-12 w-12 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-600">İlan Bulunamadı</h3>
            <p className="mt-2 text-sm text-slate-400">
              Filtreleri değiştirmeyi deneyin veya daha sonra tekrar kontrol edin.
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {filteredJobs.map((job) => (
              <motion.div key={job.id} variants={itemVariants} layout>
                <Card className="group h-full transition-all duration-300 hover:border-indigo-200 hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-indigo-100">
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white">
                            {job.companyName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-slate-600">
                              {job.companyName}
                            </span>
                            {job.isVerified && <ShieldCheck className="h-4 w-4 text-blue-500" />}
                          </div>
                          <span className="text-xs text-muted-foreground">{job.projectName}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="mt-2 text-base transition-colors group-hover:text-indigo-600">
                      {job.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">
                      {job.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Meta Bilgiler */}
                    <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {job.budget && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {job.budget.toLocaleString("tr-TR")} ₺
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(job.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Uzaktan
                      </span>
                    </div>

                    {/* Alt Bilgi */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {job.proposalCount} başvuru
                      </span>
                      <Button
                        size="sm"
                        className="gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700"
                        onClick={() => handleApply(job.id)}
                        disabled={isApplying === job.id}
                      >
                        {isApplying === job.id ? "Gönderiliyor..." : "Başvur"}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
