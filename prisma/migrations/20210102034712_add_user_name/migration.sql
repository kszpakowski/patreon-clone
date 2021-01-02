/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[name]` on the table `User`. If there are existing duplicate values, the migration will fail.
  - Added the required column `paymentId` to the `TierSubscription` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TierSubscription" ADD COLUMN     "paymentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User.name_unique" ON "User"("name");
