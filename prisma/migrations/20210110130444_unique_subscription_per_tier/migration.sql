/*
  Warnings:

  - Made the column `ownerId` on table `TierSubscription` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TierSubscription" ALTER COLUMN "ownerId" SET NOT NULL;
