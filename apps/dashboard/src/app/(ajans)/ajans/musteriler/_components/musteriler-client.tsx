"use client";

import { Building2, DollarSign, FolderOpen } from "lucide-react";
import { Avatar, AvatarFallback, Badge, Card, CardContent, CardHeader, CardTitle } from "ui";

interface CustomerItem {
  id: string;
  brandName: string;
  avatar: string;
  projectCount: number;
  activeProjects: number;
  totalBudget: number;
  projects: { name: string; status: string }[];
}

interface MusterilerClientProps {
  customers: CustomerItem[];
}

const statusMap: Record<string, { label: string; variant: string }> = {
  ACTIVE: { label: "Aktif", variant: "default" },
  IN_REVIEW: { label: "İncele", variant: "secondary" },
  COMPLETED: { label: "Bitti", variant: "outline" },
  CANCELLED: { label: "İptal", variant: "destructive" },
  DRAFT: { label: "Taslak", variant: "outline" },
};

export default function MusterilerClient({ customers }: MusterilerClientProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Müşterilerim</h1>
        <p className="mt-1 text-muted-foreground">
          Ajansınızla çalışan markaları ve projelerini takip edin.
        </p>
      </div>

      {customers.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center text-muted-foreground">
            <Building2 className="mx-auto mb-3 h-10 w-10 opacity-50" />
            <p>
              Henüz müşteriniz yok. Markalar proje oluşturup ajansınıza atadığında burada görünecek.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <Card key={customer.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                  <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
                    {customer.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{customer.brandName}</CardTitle>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FolderOpen className="h-3 w-3" />
                      {customer.projectCount} proje
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />₺
                      {customer.totalBudget.toLocaleString("tr-TR")}
                    </span>
                  </div>
                </div>
                <Badge variant="default">{customer.activeProjects} aktif</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {customer.projects.slice(0, 3).map((proj, i) => {
                    const st = statusMap[proj.status] || { label: proj.status, variant: "outline" };
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between border-b py-1.5 text-sm last:border-0"
                      >
                        <span className="mr-2 flex-1 truncate">{proj.name}</span>
                        {/* @ts-expect-error - Badge variant */}
                        <Badge variant={st.variant} className="h-5 text-[10px]">
                          {st.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
