/*
  Warnings:

  - You are about to drop the column `userId` on the `Tier` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Tier` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tier" DROP CONSTRAINT "Tier_userId_fkey";

-- AlterTable
ALTER TABLE "Tier" DROP COLUMN "userId",
ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Tier" ADD FOREIGN KEY("ownerId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
