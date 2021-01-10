/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[ownerId,tierId]` on the table `TierSubscription`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Unique_subscription_per_tier" ON "TierSubscription"("ownerId", "tierId");
