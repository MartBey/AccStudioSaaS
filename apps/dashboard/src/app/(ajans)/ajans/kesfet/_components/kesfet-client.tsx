"use client";

import { motion } from "framer-motion";
import { Briefcase, ExternalLink, Heart, MapPin, Search, ShieldCheck, Star } from "lucide-react";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "ui";

interface FreelancerItem {
  id: string;
  name: string;
  title: string;
  avatar: string;
  skills: string[];
  isVerified: boolean;
  hourlyRate: number;
  completedProjects: number;
  location: string;
  available: boolean;
}

interface KesfetClientProps {
  freelancers: FreelancerItem[];
  skillTags: string[];
}

export default function KesfetClient({ freelancers, skillTags }: KesfetClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredTalents = freelancers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yetenek Keşfi (Talent Search)</h1>
          <p className="mt-1 text-muted-foreground">
            Projeleriniz için en uygun, onaylanmış profesyonelleri bulun ve çalışma ekibinize katın.
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1.5 text-sm">
          {filteredTalents.length} profesyonel
        </Badge>
      </div>

      {/* Arama */}
      <div className="sticky top-0 z-10 flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="İsim, rol veya yetenek ara..."
            className="h-12 pl-11 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {skillTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
              onClick={() => setSearchTerm(tag)}
            >
              {tag}
            </Badge>
          ))}
          {searchTerm && (
            <Badge
              variant="outline"
              className="cursor-pointer border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => setSearchTerm("")}
            >
              Filtreyi Temizle
            </Badge>
          )}
        </div>
      </div>

      {/* Kartlar */}
      <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2 lg:grid-cols-3">
        {filteredTalents.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed py-20 text-center text-muted-foreground">
            Aradığınız yeteneğe uygun profesyonel bulunamadı.
          </div>
        ) : (
          filteredTalents.map((freelancer) => (
            <Sheet key={freelancer.id}>
              <SheetTrigger asChild>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <Card className="group flex h-full cursor-pointer flex-col shadow-sm transition-colors hover:border-primary/50 hover:shadow-md">
                    <CardHeader className="flex flex-row items-start gap-4 pb-4">
                      <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                        <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                          {freelancer.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg leading-tight transition-colors group-hover:text-primary">
                            {freelancer.name}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`-mr-2 -mt-1 h-8 w-8 ${favorites.includes(freelancer.id) ? "text-rose-500 hover:text-rose-600" : "text-muted-foreground hover:text-rose-500"}`}
                            onClick={(e) => toggleFavorite(freelancer.id, e)}
                          >
                            <Heart
                              className="h-5 w-5"
                              fill={favorites.includes(freelancer.id) ? "currentColor" : "none"}
                            />
                          </Button>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {freelancer.title}
                        </p>
                        {freelancer.isVerified && (
                          <div className="flex w-fit items-center gap-2 rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold text-emerald-600">
                            <ShieldCheck className="h-3 w-3" /> Doğrulanmış
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-4">
                      <div className="grid grid-cols-3 gap-2 divide-x border-y py-3 text-center">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold">₺{freelancer.hourlyRate}</span>
                          <span className="text-[10px] uppercase text-muted-foreground">
                            Saatlik
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="flex items-center justify-center gap-1 text-lg font-bold">
                            4.8 <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          </span>
                          <span className="text-[10px] uppercase text-muted-foreground">Puan</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-lg font-bold">{freelancer.completedProjects}</span>
                          <span className="text-[10px] uppercase text-muted-foreground">Proje</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {freelancer.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="bg-muted/60 text-xs font-normal hover:bg-muted"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between pb-4 pt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {freelancer.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" /> Durum:{" "}
                        <strong
                          className={freelancer.available ? "text-emerald-600" : "text-amber-500"}
                        >
                          {freelancer.available ? "Müsait" : "Meşgul"}
                        </strong>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              </SheetTrigger>

              {/* QUICK VIEW PANEL */}
              <SheetContent className="w-[400px] overflow-y-auto sm:w-[540px]">
                <SheetHeader className="border-b pb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 border-background shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                        {freelancer.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 text-left">
                      <SheetTitle className="text-2xl">{freelancer.name}</SheetTitle>
                      <p className="font-medium text-muted-foreground">{freelancer.title}</p>
                      <div className="flex items-center gap-3 pt-1 text-sm">
                        <span className="flex items-center gap-1 font-semibold">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.8
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="font-medium">
                          {freelancer.completedProjects} İş Tamamlandı
                        </span>
                      </div>
                    </div>
                  </div>
                </SheetHeader>

                <div className="space-y-8 py-6">
                  <div className="space-y-3">
                    <h3 className="border-b pb-2 text-lg font-semibold">Uzmanlıklar</h3>
                    <div className="flex flex-wrap gap-2">
                      {freelancer.skills.map((skill) => (
                        <Badge key={skill} variant="default" className="shadow-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 -mx-6 mt-6 flex items-center justify-between border-t bg-background/80 p-4 backdrop-blur-sm">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Saatlik Ücret</span>
                    <span className="text-xl font-bold">₺{freelancer.hourlyRate}</span>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={(e) => toggleFavorite(freelancer.id, e)}
                    >
                      <Heart
                        className="h-4 w-4"
                        fill={favorites.includes(freelancer.id) ? "currentColor" : "none"}
                      />
                      {favorites.includes(freelancer.id) ? "Favorilerden Çıkar" : "Listeye Kaydet"}
                    </Button>
                    <Button className="gap-2 shadow-md">
                      Teklif İste <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ))
        )}
      </div>
    </div>
  );
}
