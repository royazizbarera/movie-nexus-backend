-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "verificationCodeExpired" SET DEFAULT now() + interval '1 day';
