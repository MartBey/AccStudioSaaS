"use client";

import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Badge, Button, Input, Avatar, AvatarFallback,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "ui";
import { Search, MoreHorizontal, UserPlus, Mail } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  projectCount: number;
  joinedAt: string;
}

interface EkipClientProps {
  members: TeamMember[];
}

export default function EkipClient({ members }: EkipClientProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeam = members.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ekip Yönetimi</h1>
          <p className="text-muted-foreground">
            Ajans ekibinizdeki üyeleri, rollerini ve kapasitelerini yönetin.
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1.5">
          {members.length} üye
        </Badge>
      </div>

      <div className="flex justify-between items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="İsim veya rol ara..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Kişi Bilgisi</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Aktif Proje</TableHead>
              <TableHead>Katılım Tarihi</TableHead>
              <TableHead className="text-right">Aksiyon</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeam.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  {members.length === 0
                    ? "Henüz ekip üyeniz yok."
                    : "Arama kriterlerine uygun ekip üyesi bulunamadı."}
                </TableCell>
              </TableRow>
            ) : (
              filteredTeam.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-primary/20">
                        <AvatarFallback className="text-sm bg-primary/10 text-primary">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{member.name}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{member.role}</TableCell>
                  <TableCell>
                    <span className="font-semibold">{member.projectCount}</span>
                    <span className="text-xs text-muted-foreground ml-1">Proje</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{member.joinedAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Profili İncele</DropdownMenuItem>
                        <DropdownMenuItem>Rolü Değiştir</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Ekipten Çıkar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
