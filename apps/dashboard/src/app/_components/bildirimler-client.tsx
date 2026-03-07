"use client";

import { useState, useTransition } from "react";
import { 
  Card, CardContent,
  Badge, Button, toast,
} from "ui";
import { Bell, BellOff, CheckCheck, ExternalLink } from "lucide-react";
import Link from "next/link";
import { markAsRead, markAllAsRead } from "@/app/_actions/notification-actions";
import { useRouter } from "next/navigation";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}

interface BildirimlerClientProps {
  notifications: NotificationItem[];
  unreadCount: number;
}

const typeIcons: Record<string, string> = {
  PROPOSAL_RECEIVED: "📩",
  PROPOSAL_ACCEPTED: "✅",
  PROPOSAL_REJECTED: "❌",
  TASK_ASSIGNED: "📋",
  PROJECT_UPDATED: "🔄",
  SYSTEM: "🔔",
};

export default function BildirimlerClient({ notifications, unreadCount }: BildirimlerClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleMarkAsRead = (id: string) => {
    startTransition(async () => {
      const res = await markAsRead(id);
      if (res.success) router.refresh();
    });
  };

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      const res = await markAllAsRead();
      if (res.success) {
        toast.success("Tüm bildirimler okundu olarak işaretlendi.");
        router.refresh();
      }
    });
  };

  const formatDate = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Az önce";
    if (mins < 60) return `${mins} dk önce`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} saat önce`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} gün önce`;
    return new Date(dateStr).toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bildirimler</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} okunmamış bildirim` : "Tüm bildirimler okundu"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" className="gap-2" onClick={handleMarkAllAsRead} disabled={isPending}>
            <CheckCheck className="h-4 w-4" />
            Tümünü Oku
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="text-center py-16 text-muted-foreground">
            <BellOff className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>Henüz bildiriminiz yok.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card 
              key={n.id}
              className={`transition-all cursor-pointer hover:shadow-md ${!n.read ? "border-l-4 border-l-primary bg-primary/[0.02]" : "opacity-75"}`}
              onClick={() => !n.read && handleMarkAsRead(n.id)}
            >
              <CardContent className="py-4 px-5">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{typeIcons[n.type] || "🔔"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-medium ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {n.title}
                      </h3>
                      {!n.read && <Badge variant="default" className="text-[10px] px-1.5 py-0">Yeni</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    <span className="text-xs text-muted-foreground/60 mt-1 block">{formatDate(n.createdAt)}</span>
                  </div>
                  {n.link && (
                    <Link href={n.link} className="text-primary hover:text-primary/80 transition-colors flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
