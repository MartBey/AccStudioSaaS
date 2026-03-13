"use client";

import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "ui";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Bir Hata Oluştu</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Bu sayfa yüklenirken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin veya ana sayfaya
            dönün.
          </p>
        </div>
        {error.digest && (
          <p className="inline-block rounded-md bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground">
            Hata Kodu: {error.digest}
          </p>
        )}
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset} variant="default" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Tekrar Dene
          </Button>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Ana Sayfa
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
