/*
  Warnings:

  - You are about to drop the column `phone` on the `Country` table. All the data in the column will be lost.
  - Added the required column `backdropUrl` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Actor" ADD COLUMN     "photoUrl" TEXT;

-- AlterTable
ALTER TABLE "Country" DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "Director" ADD COLUMN     "photoUrl" TEXT;

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "backdropUrl" TEXT NOT NULL,
ADD COLUMN     "videoUrl" TEXT,
ALTER COLUMN "trailerUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "verificationCodeExpired" SET DEFAULT now() + interval '1 day';
