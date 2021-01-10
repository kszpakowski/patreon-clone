/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[ownerId,level]` on the table `Tier`. If there are existing duplicate values, the migration will fail.
  - Made the column `level` on table `Tier` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Tier" ALTER COLUMN "level" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Unique_tier_level_per_user" ON "Tier"("ownerId", "level");
