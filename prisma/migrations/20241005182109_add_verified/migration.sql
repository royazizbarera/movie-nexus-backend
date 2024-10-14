-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationCode" INTEGER,
ADD COLUMN     "verificationRequestDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
