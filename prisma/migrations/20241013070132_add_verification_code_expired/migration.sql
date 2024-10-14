-- AlterTable
ALTER TABLE "User" ALTER COLUMN "verificationCodeExpired" SET DEFAULT now() + interval '1 day';
