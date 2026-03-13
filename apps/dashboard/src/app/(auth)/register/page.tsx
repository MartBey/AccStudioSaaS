"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui";

import { registerUser } from "./_actions/register-action";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState("BRAND");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      const res = await registerUser({
        name,
        email,
        password,
        role: selectedRole as "BRAND" | "AGENCY" | "FREELANCER",
      });

      if (res?.error) {
        setError(res.error);
      } else {
        // Kayıt başarılı, login sayfasına yönlendir
        router.push("/login?registered=true");
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
        <CardTitle className="text-2xl tracking-tight">Yeni Hesap Oluşturun</CardTitle>
        <CardDescription>Platformumuza katılmak için hesap bilgilerinizi girin.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Ad Soyad / Firma Adı</Label>
            <Input id="name" name="name" placeholder="Tam adınız" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" name="email" type="email" placeholder="ornek@sirket.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Hesap Türü (Rol)</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Rol seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRAND">Marka / Müşteri</SelectItem>
                <SelectItem value="AGENCY">Ajans</SelectItem>
                <SelectItem value="FREELANCER">Freelancer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Hesap Oluşturuluyor..." : "Kayıt Ol"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            {"Zaten hesabınız var mı? "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Giriş Yapın
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
