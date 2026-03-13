"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "ui";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("E-posta veya şifre hatalı.");
      } else {
        // Oturum açıldıktan sonra session'dan rolü alıp yönlendir
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        const role = session?.user?.role;

        if (role === "BRAND") {
          router.push("/marka");
        } else if (role === "AGENCY") {
          router.push("/ajans");
        } else if (role === "FREELANCER") {
          router.push("/freelancer");
        } else {
          router.push("/");
        }
      }
    } catch (_err) {
      setError("Beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl tracking-tight">Hesabınıza Giriş Yapın</CardTitle>
        <CardDescription>Projelerinizi yönetmek için e-posta ve şifrenizi girin.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" name="email" type="email" placeholder="ornek@sirket.com" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Şifre</Label>
              <Link href="/auth/reset" className="text-sm font-medium text-primary hover:underline">
                Şifremi unuttum
              </Link>
            </div>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            {"Hesabınız yok mu? "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Kayıt Olun
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
