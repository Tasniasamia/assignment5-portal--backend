-- CreateTable
CREATE TABLE "OtpLog" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpLog_pkey" PRIMARY KEY ("id")
);
