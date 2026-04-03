/*
  Warnings:

  - Added the required column `status` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment" DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL;
