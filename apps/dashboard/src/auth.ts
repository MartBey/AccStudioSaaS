import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

const prisma = new PrismaClient();

// Extending built-in types to include Role
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Veritabanından kullanıcıyı bul
        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user || !user.password) return null;

        // Şifre kontrolü
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) return null;

        // Başarılı giriş — id, name, email, role döndür
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        } as any;
      }
    }),
  ],
});
