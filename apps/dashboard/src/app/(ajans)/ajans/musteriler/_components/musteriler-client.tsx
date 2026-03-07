"use client";

import { 
  Card, CardContent, CardHeader, CardTitle,
  Badge, Avatar, AvatarFallback,
} from "ui";
import { Building2, FolderOpen, DollarSign } from "lucide-react";

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
        <p className="text-muted-foreground mt-1">
          Ajansınızla çalışan markaları ve projelerini takip edin.
        </p>
      </div>

      {customers.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="text-center py-16 text-muted-foreground">
            <Building2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>Henüz müşteriniz yok. Markalar proje oluşturup ajansınıza atadığında burada görünecek.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row gap-4 items-center pb-4">
                <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                    {customer.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{customer.brandName}</CardTitle>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FolderOpen className="h-3 w-3" />
                      {customer.projectCount} proje
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      ₺{customer.totalBudget.toLocaleString("tr-TR")}
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
                      <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0 text-sm">
                        <span className="truncate flex-1 mr-2">{proj.name}</span>
                        {/* @ts-expect-error - Badge variant */}
                        <Badge variant={st.variant} className="text-[10px] h-5">{st.label}</Badge>
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
