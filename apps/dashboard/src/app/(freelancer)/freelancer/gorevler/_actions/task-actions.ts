"use server";

import { prisma } from "database";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

// Görev statüsünü güncelle (Kanban sürükleme)
export async function updateTaskStatus(taskId: string, newStatus: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Oturum bulunamadı.");

    await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus as "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" },
    });

    // AuditLog
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE_TASK_STATUS",
        entityType: "Task",
        entityId: taskId,
        details: JSON.stringify({ newStatus }),
      },
    });

    revalidatePath("/freelancer/gorevler");
    return { success: true };
  } catch (error: unknown) {
    console.error("updateTaskStatus error:", error);
    if (error instanceof Error) return { error: error.message };
    return { error: "Görev durumu güncellenirken hata oluştu." };
  }
}
