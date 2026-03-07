"use server";

import { prisma } from "database";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Bildirim oluştur (internal helper — diğer action'lardan çağrılır)
export async function createNotification(data: {
  userId: string;
  type: "PROPOSAL_RECEIVED" | "PROPOSAL_ACCEPTED" | "PROPOSAL_REJECTED" | "TASK_ASSIGNED" | "PROJECT_UPDATED" | "SYSTEM";
  title: string;
  message: string;
  link?: string;
  actorId?: string;
}) {
  try {
    await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link || null,
        actorId: data.actorId || null,
      }
    });
  } catch (error) {
    console.error("createNotification error:", error);
  }
}

// Kullanıcının bildirimlerini getir
export async function getNotifications() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { notifications: [], unreadCount: 0 };

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return {
      notifications: notifications.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        read: n.read,
        link: n.link,
        createdAt: n.createdAt.toISOString(),
      })),
      unreadCount,
    };
  } catch (error) {
    console.error("getNotifications error:", error);
    return { notifications: [], unreadCount: 0 };
  }
}

// Okunmamış bildirim sayısını getir
export async function getUnreadCount() {
  try {
    const session = await auth();
    if (!session?.user?.id) return 0;

    return await prisma.notification.count({
      where: { userId: session.user.id, read: false },
    });
  } catch {
    return 0;
  }
}

// Tek bildirimi okundu olarak işaretle
export async function markAsRead(notificationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Oturum bulunamadı." };

    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error("markAsRead error:", error);
    return { error: "İşlem başarısız." };
  }
}

// Tüm bildirimleri okundu yap
export async function markAllAsRead() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Oturum bulunamadı." };

    await prisma.notification.updateMany({
      where: { userId: session.user.id, read: false },
      data: { read: true },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error("markAllAsRead error:", error);
    return { error: "İşlem başarısız." };
  }
}
