-- -- AlterEnum
-- -- This migration adds more than one value to an enum.
-- -- With PostgreSQL versions 11 and earlier, this is not possible
-- -- in a single migration. This can be worked around by creating
-- -- multiple migrations, each migration adding only one value to
-- -- the enum.


-- ALTER TYPE "PaymentStatus" ADD VALUE 'PENDING';
-- ALTER TYPE "PaymentStatus" ADD VALUE 'FAILED';
-- ALTER TYPE "PaymentStatus" ADD VALUE 'CANCELLED';

-- -- AlterTable
-- ALTER TABLE "payment" ADD COLUMN     "paymentGatewayData" JSONB,
-- ALTER COLUMN "status" SET DEFAULT 'PENDING';


-- Step 1: আগে enum values add করো
ALTER TYPE "PaymentStatus" ADD VALUE 'PENDING';
ALTER TYPE "PaymentStatus" ADD VALUE 'FAILED';
ALTER TYPE "PaymentStatus" ADD VALUE 'CANCELLED';