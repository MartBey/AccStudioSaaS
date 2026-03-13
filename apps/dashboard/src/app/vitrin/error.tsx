"use client";

import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "ui";

export default function VitrinError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-destructive/10">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Üzgünüz, bir sorun oluştu</h1>
          <p className="leading-relaxed text-muted-foreground">
            Vitrin sayfası yüklenirken bir hata meydana geldi. Profil geçici olarak ulaşılamıyor
            olabilir.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button onClick={reset} className="w-full gap-2 sm:w-auto">
            <RefreshCw className="h-4 w-4" />
            Tekrar Dene
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full gap-2">
              <Home className="h-4 w-4" />
              Ana Sayfa
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
