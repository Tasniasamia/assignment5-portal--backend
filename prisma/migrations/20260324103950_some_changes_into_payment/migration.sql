/*
  Warnings:

  - A unique constraint covering the columns `[stripeEventId]` on the table `payment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "idea" ADD COLUMN     "paymentStatus" "PaymentStatus";

-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "invoiceUrl" TEXT,
ADD COLUMN     "stripeEventId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payment_stripeEventId_key" ON "payment"("stripeEventId");
