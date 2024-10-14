/*
  Warnings:

  - You are about to drop the column `trailerUrl` on the `Movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "trailerUrl";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "verificationCodeExpired" SET DEFAULT now() + interval '1 day';
