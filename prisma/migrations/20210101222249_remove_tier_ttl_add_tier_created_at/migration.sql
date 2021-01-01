/*
  Warnings:

  - You are about to drop the column `ttl` on the `TierSubscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TierSubscription" DROP COLUMN "ttl",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
