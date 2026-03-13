"use server";

import { prisma } from "database";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

// Freelancer: Görevi teslim et
export async function deliverTask(data: {
  taskId: string;
  deliveryUrl: string;
  deliveryNote?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Oturum bulunamadı.");

    const task = await prisma.task.findUnique({ where: { id: data.taskId } });
    if (!task) throw new Error("Görev bulunamadı.");

    await prisma.task.update({
      where: { id: data.taskId },
      data: {
        deliveryUrl: data.deliveryUrl,
        deliveryNote: data.deliveryNote || null,
        deliveredAt: new Date(),
        status: "DELIVERED",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELIVER_TASK",
        entityType: "Task",
        entityId: data.taskId,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error("deliverTask error:", error);
    if (error instanceof Error) return { error: error.message };
    return { error: "Teslimat yapılırken hata oluştu." };
  }
}

// Marka/Ajans: Teslimatı onayla
export async function approveDelivery(taskId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Oturum bulunamadı.");

    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: "DONE",
        approvedAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "APPROVE_DELIVERY",
        entityType: "Task",
        entityId: taskId,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error("approveDelivery error:", error);
    if (error instanceof Error) return { error: error.message };
    return { error: "Onay sırasında hata oluştu." };
  }
}

// Marka/Ajans: Revizyon iste
export async function requestRevision(data: { taskId: string; revisionNote: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Oturum bulunamadı.");

    await prisma.task.update({
      where: { id: data.taskId },
      data: {
        status: "REVISION",
        revisionNote: data.revisionNote,
        deliveredAt: null, // Teslimat sıfırla
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "REQUEST_REVISION",
        entityType: "Task",
        entityId: data.taskId,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error("requestRevision error:", error);
    if (error instanceof Error) return { error: error.message };
    return { error: "Revizyon isteği yapılırken hata oluştu." };
  }
}

// Ajans: Görevi çalışana ata
export async function assignTaskToEmployee(data: { taskId: string; employeeId: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Oturum bulunamadı.");

    await prisma.task.update({
      where: { id: data.taskId },
      data: { employeeId: data.employeeId },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ASSIGN_TASK_TO_EMPLOYEE",
        entityType: "Task",
        entityId: data.taskId,
        details: JSON.stringify({ employeeId: data.employeeId }),
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error("assignTaskToEmployee error:", error);
    if (error instanceof Error) return { error: error.message };
    return { error: "Atama yapılırken hata oluştu." };
  }
}
