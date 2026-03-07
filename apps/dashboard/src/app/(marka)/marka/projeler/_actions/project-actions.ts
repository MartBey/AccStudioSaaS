"use server";

import { prisma } from "database";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Yeni proje + iş ilanı oluştur
export async function createProject(data: {
  name: string;
  description: string;
  budget: number;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Oturum bulunamadı.");

    // Kullanıcının Brand profilini bul
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: { include: { brand: true } } }
    });

    const brandId = user?.profile?.brand?.id;
    if (!brandId) throw new Error("Yalnızca marka hesapları proje oluşturabilir.");

    // Proje oluştur
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        brandId: brandId,
        status: "ACTIVE",
      }
    });

    // İş ilanı oluştur (proje ile birlikte)
    await prisma.jobListing.create({
      data: {
        title: data.name,
        description: data.description,
        budget: data.budget,
        status: "OPEN",
        projectId: project.id,
      }
    });

    // AuditLog
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE_PROJECT",
        entityType: "Project",
        entityId: project.id,
        details: JSON.stringify({ name: data.name, budget: data.budget })
      }
    });

    revalidatePath("/marka/projeler");
    return { success: true };
  } catch (error: unknown) {
    console.error("createProject error:", error);
    if (error instanceof Error) return { error: error.message };
    return { error: "Proje oluşturulurken bir hata oluştu." };
  }
}

// Proje durumunu güncelle
export async function updateProjectStatus(projectId: string, status: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Oturum bulunamadı.");

    await prisma.project.update({
      where: { id: projectId },
      data: { status: status as "ACTIVE" | "IN_REVIEW" | "COMPLETED" | "CANCELLED" }
    });

    // AuditLog
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE_PROJECT_STATUS",
        entityType: "Project",
        entityId: projectId,
        details: JSON.stringify({ newStatus: status })
      }
    });

    revalidatePath("/marka/projeler");
    return { success: true };
  } catch (error: unknown) {
    console.error("updateProjectStatus error:", error);
    if (error instanceof Error) return { error: error.message };
    return { error: "Proje durumu güncellenirken hata oluştu." };
  }
}
