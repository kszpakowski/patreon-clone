/*
  Warnings:

  - You are about to drop the column `userId` on the `TierSubscription` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TierSubscription" DROP CONSTRAINT "TierSubscription_userId_fkey";

-- AlterTable
ALTER TABLE "TierSubscription" DROP COLUMN "userId",
ADD COLUMN     "ownerId" INTEGER;

-- AddForeignKey
ALTER TABLE "TierSubscription" ADD FOREIGN KEY("ownerId")REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
