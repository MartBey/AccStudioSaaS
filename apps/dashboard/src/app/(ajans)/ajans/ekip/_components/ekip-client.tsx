"use client";

import { Mail, MoreHorizontal, Search } from "lucide-react";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "ui";
import { toast } from "ui";

import { removeEmployee } from "../../../../_actions/agency-actions";
import { AddMemberDialog } from "./add-member-dialog";

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
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  const filteredTeam = members.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemove = async (id: string) => {
    if (!confirm("Bu ekip üyesini silmek istediğinize emin misiniz?")) return;

    setRemovingIds((prev) => [...prev, id]);
    try {
      const result = await removeEmployee(id);
      if (result.success) {
        toast.success("Ekip üyesi silindi.");
      } else {
        toast.error(result.error || "Silme işlemi başarısız.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Bir hata oluştu.");
    } finally {
      setRemovingIds((prev) => prev.filter((rid) => rid !== id));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ekip Yönetimi</h1>
          <p className="text-muted-foreground">
            Ajans ekibinizdeki üyeleri, rollerini ve kapasitelerini yönetin.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-1.5 text-sm">
            {members.length} üye
          </Badge>
          <AddMemberDialog />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm">
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

      <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
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
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  {members.length === 0
                    ? "Henüz ekip üyeniz yok."
                    : "Arama kriterlerine uygun ekip üyesi bulunamadı."}
                </TableCell>
              </TableRow>
            ) : (
              filteredTeam.map((member) => (
                <TableRow
                  key={member.id}
                  className={removingIds.includes(member.id) ? "opacity-50" : ""}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-sm text-primary">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{member.name}</span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{member.role}</TableCell>
                  <TableCell>
                    <span className="font-semibold">{member.projectCount}</span>
                    <span className="ml-1 text-xs text-muted-foreground">Proje</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{member.joinedAt}</TableCell>
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
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleRemove(member.id)}
                          disabled={removingIds.includes(member.id)}
                        >
                          Ekipten Çıkar
                        </DropdownMenuItem>
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
