/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[commentId,authorId]` on the table `CommentLike`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Unique_like_per_user" ON "CommentLike"("commentId", "authorId");
