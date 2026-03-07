"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "ui";
import { Search } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  companyName: string | null;
  hasFreelancer: boolean;
}

const ROLE_COLORS: Record<string, string> = {
  BRAND: "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20",
  AGENCY: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
  FREELANCER: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
  ADMIN: "bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20",
};

export function UsersClient({ users }: { users: AdminUser[] }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.companyName || "").toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="İsim, email veya şirket ara…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {["ALL", "BRAND", "AGENCY", "FREELANCER", "ADMIN"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                roleFilter === role
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {role === "ALL" ? "Tümü" : role}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} kullanıcı</span>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Kullanıcı</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Rol</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Şirket / Unvan</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Kayıt Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-16 text-center text-muted-foreground text-sm">
                  Kullanıcı bulunamadı.
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="relative border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", ROLE_COLORS[u.role] || "")}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {u.companyName || "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                      <Link href={`/admin/users/${u.id}`} className="absolute inset-0" aria-label={`${u.name} detayı`} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
