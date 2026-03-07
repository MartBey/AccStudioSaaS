import { getAdminVerifications, getAdminUsers } from "@/app/_actions/admin-actions";
import { VerificationClient } from "./_components/verification-client";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminVerificationPage() {
  const [verifications, users] = await Promise.all([
    getAdminVerifications(),
    getAdminUsers(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500/10 ring-1 ring-orange-500/20">
              <ShieldCheck className="h-4 w-4 text-orange-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Doğrulama Talepleri</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Kullanıcı belge doğrulama başvurularını incele ve yönet.
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums">
            {verifications.filter((v) => v.status === "PENDING").length}
          </p>
          <p className="text-xs text-muted-foreground">Bekleyen</p>
        </div>
      </div>

      <VerificationClient verifications={verifications} />
    </div>
  );
}
