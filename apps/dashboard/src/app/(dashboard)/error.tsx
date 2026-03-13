"use client";

import { AlertCircle, LayoutDashboard, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "ui";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Beklenmedik Bir Hata</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            İşlem sırasında bir hata oluştu. Teknik ekibimiz bilgilendirildi.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset} variant="default" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Yenile
          </Button>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Panoya Dön
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
