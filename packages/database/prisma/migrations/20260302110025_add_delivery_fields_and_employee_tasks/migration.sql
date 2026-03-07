-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TaskStatus" ADD VALUE 'DELIVERED';
ALTER TYPE "TaskStatus" ADD VALUE 'REVISION';

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "deliveryNote" TEXT,
ADD COLUMN     "deliveryUrl" TEXT,
ADD COLUMN     "employeeId" TEXT,
ADD COLUMN     "revisionNote" TEXT;

-- CreateIndex
CREATE INDEX "Task_employeeId_idx" ON "Task"("employeeId");
