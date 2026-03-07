"use server";

import { prisma } from "database";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Kullanıcının dahil olduğu projelerin mesaj özetlerini getir
export async function getMessageThreads() {
  const session = await auth();
  if (!session?.user?.id) return [];

  // Kullanıcının proje ilişkilerini bul (brand owner veya freelancer task atanmış)
  const userId = session.user.id;

  // Brand projeleri
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          brand: { include: { projects: { select: { id: true, name: true } } } },
          freelancer: { include: { tasks: { include: { project: { select: { id: true, name: true } } } } } },
          agency: { include: { projects: { select: { id: true, name: true } } } },
        }
      }
    }
  });

  const projectIds = new Set<string>();
  const projectNames = new Map<string, string>();

  // Brand projeleri
  user?.profile?.brand?.projects.forEach(p => { projectIds.add(p.id); projectNames.set(p.id, p.name); });
  // Agency projeleri
  user?.profile?.agency?.projects.forEach(p => { projectIds.add(p.id); projectNames.set(p.id, p.name); });
  // Freelancer görevlerinin projeleri
  user?.profile?.freelancer?.tasks.forEach(t => { projectIds.add(t.project.id); projectNames.set(t.project.id, t.project.name); });

  if (projectIds.size === 0) return [];

  // Her proje için son mesajı ve okunmamış sayısı
  const threads = await Promise.all(
    Array.from(projectIds).map(async (pid) => {
      const lastMessage = await prisma.message.findFirst({
        where: { projectId: pid },
        orderBy: { createdAt: "desc" },
        include: { sender: { select: { name: true } } },
      });

      const totalMessages = await prisma.message.count({ where: { projectId: pid } });

      return {
        projectId: pid,
        projectName: projectNames.get(pid) || "Proje",
        lastMessage: lastMessage ? {
          content: lastMessage.content.substring(0, 80) + (lastMessage.content.length > 80 ? "..." : ""),
          senderName: lastMessage.sender.name || "Bilinmeyen",
          createdAt: lastMessage.createdAt.toISOString(),
        } : null,
        totalMessages,
      };
    })
  );

  return threads.filter(t => t.totalMessages > 0 || true).sort((a, b) => {
    if (!a.lastMessage && !b.lastMessage) return 0;
    if (!a.lastMessage) return 1;
    if (!b.lastMessage) return -1;
    return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
  });
}

// Proje mesajlarını getir
export async function getProjectMessages(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) return [];

  const messages = await prisma.message.findMany({
    where: { projectId },
    include: { sender: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  return messages.map((m: { id: string; content: string; sender: { id: string; name: string | null; image: string | null }; createdAt: Date }) => ({
    id: m.id,
    content: m.content,
    senderName: m.sender.name || "Bilinmeyen",
    senderId: m.sender.id,
    senderImage: m.sender.image,
    isOwn: m.sender.id === session.user!.id,
    createdAt: m.createdAt.toISOString(),
  }));
}

// Mesaj gönder
export async function sendMessage(data: { projectId: string; content: string }) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Oturum bulunamadı." };

  if (!data.content.trim()) return { error: "Mesaj boş olamaz." };

  try {
    const message = await prisma.message.create({
      data: {
        projectId: data.projectId,
        senderId: session.user.id,
        content: data.content.trim(),
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    });

    // Pusher ile real-time bildirim gönder
    try {
      const { getPusherServer, getProjectChannel, PUSHER_EVENTS } = await import("@/lib/pusher-server");
      const pusher = getPusherServer();
      await pusher.trigger(
        getProjectChannel(data.projectId),
        PUSHER_EVENTS.NEW_MESSAGE,
        {
          id: message.id,
          content: message.content,
          senderName: message.sender.name || "Bilinmeyen",
          senderId: message.sender.id,
          senderImage: message.sender.image,
          createdAt: message.createdAt.toISOString(),
        }
      );
    } catch {
      // Pusher yapılandırılmamışsa sessizce devam et
      console.warn("Pusher event gönderilemedi (yapılandırma eksik olabilir).");
    }

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error("sendMessage error:", error);
    return { error: "Mesaj gönderilemedi." };
  }
}

