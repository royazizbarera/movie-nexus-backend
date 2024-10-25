-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationCodeExpired" TIMESTAMP(3) DEFAULT now() + interval '1 day';
