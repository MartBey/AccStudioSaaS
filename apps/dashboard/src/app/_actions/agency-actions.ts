"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "database";

import { auth } from "@/auth";


export async function addEmployee(data: {
  name: string;
  role: string;
  email?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Oturum bulunamadı.");

    // Kullanıcının Agency profilini bul
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: { include: { agency: true } } },
    });

    const agencyId = user?.profile?.agency?.id;
    if (!agencyId) throw new Error("Ajans profili bulunamadı.");

    // Yeni çalışanı ekle
    const employee = await prisma.employee.create({
      data: {
        name: data.name,
        role: data.role,
        email: data.email,
        agencyId,
      },
    });

    revalidatePath("/ajans/ekip");
    return { success: true, employee };
  } catch (error: unknown) {
    console.error("addEmployee error:", error);
    if (error instanceof Error) return { error: error.message };
    return { error: "Çalışan eklenirken hata oluştu." };
  }
}

export async function removeEmployee(employeeId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Oturum bulunamadı.");

    // Kullanıcının Agency profilini bul (Ownership kontrolü için)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: { include: { agency: true } } },
    });

    const agencyId = user?.profile?.agency?.id;
    
    // Çalışanı bul ve ajans ID'sini kontrol et
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee || employee.agencyId !== agencyId) {
      throw new Error("Çalışan bulunamadı veya bu işlem için yetkiniz yok.");
    }

    await prisma.employee.delete({
      where: { id: employeeId },
    });

    revalidatePath("/ajans/ekip");
    return { success: true };
  } catch (error: unknown) {
    console.error("removeEmployee error:", error);
    if (error instanceof Error) return { error: error.message };
    return { error: "Çalışan silinirken hata oluştu." };
  }
}
