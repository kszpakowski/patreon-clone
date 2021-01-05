/*
  Warnings:

  - You are about to drop the column `attachments` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "attachments";

-- CreateTable
CREATE TABLE "Attachment" (
"id" SERIAL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attachment" ADD FOREIGN KEY("postId")REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
