"use server";

import bcrypt from "bcryptjs";
import { prisma } from "database";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "BRAND" | "AGENCY" | "FREELANCER";
}

export async function registerUser(input: RegisterInput) {
  try {
    const { name, email, password, role } = input;

    // Email kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Bu e-posta adresi zaten kullanılıyor." };
    }

    // Şifre hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcı oluştur + profil oluştur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        profile: {
          create: {
            // Rol bazlı alt profil oluştur
            ...(role === "BRAND" && {
              brand: { create: { companyName: name } },
            }),
            ...(role === "AGENCY" && {
              agency: { create: { agencyName: name } },
            }),
            ...(role === "FREELANCER" && {
              freelancer: { create: { title: "Yeni Freelancer" } },
            }),
          },
        },
      },
    });

    // AuditLog kaydı
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_REGISTERED",
        entityType: "User",
        entityId: user.id,
        details: JSON.stringify({ role, email }),
      },
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Register error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Kayıt sırasında bir hata oluştu." };
  }
}
