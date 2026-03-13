import { redirect } from "next/navigation";

import { getFinancialSummary, getPaymentsForFreelancer } from "@/app/_actions/payment-actions";
import FaturalarClient from "@/app/_components/faturalar-client";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function FreelancerKazanclarPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [payments, summary] = await Promise.all([
    getPaymentsForFreelancer(),
    getFinancialSummary("FREELANCER"),
  ]);

  return (
    <FaturalarClient
      payments={payments}
      totalPaid={summary.totalPaid}
      totalPending={summary.totalPending}
      total={summary.total}
      role="FREELANCER"
    />
  );
}
