"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  Input,
  Avatar,
  AvatarFallback,
  Checkbox,
  toast
} from "ui";
import { Search, MapPin, Clock, DollarSign, Bookmark, ArrowRight, ShieldCheck, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { applyToJob } from "../_actions/job-actions";
import { useRouter } from "next/navigation";

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
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
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
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Pazar Yeri İlanları
          </h1>
          <p className="text-muted-foreground mt-1">
            Yeteneklerinize uygun projeleri keşfedin ve başvurun.
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-4 py-2 gap-2 border-indigo-200 bg-indigo-50 text-indigo-700">
          <Bookmark className="h-4 w-4" />
          {filteredJobs.length} Aktif İlan
        </Badge>
      </div>

      {/* Filtre Bölümü */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Arama */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
              <span className="text-sm text-muted-foreground whitespace-nowrap">Maks: {maxBudget.toLocaleString("tr-TR")} ₺</span>
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
          <div className="flex flex-wrap gap-2 mt-4">
            <Filter className="h-4 w-4 text-muted-foreground mt-1" />
            {filterCategories.map((cat) => (
              <label key={cat} className="flex items-center gap-1.5 cursor-pointer">
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
        <Card className="border-dashed border-2 border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-600">İlan Bulunamadı</h3>
            <p className="text-sm text-slate-400 mt-2">Filtreleri değiştirmeyi deneyin veya daha sonra tekrar kontrol edin.</p>
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
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-indigo-200 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-indigo-100">
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-bold">
                            {job.companyName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-slate-600">{job.companyName}</span>
                            {job.isVerified && (
                              <ShieldCheck className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{job.projectName}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-base mt-2 group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">
                      {job.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Meta Bilgiler */}
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
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
                        className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
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
