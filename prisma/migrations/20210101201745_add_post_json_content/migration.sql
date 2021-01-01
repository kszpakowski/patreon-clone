/*
  Warnings:

  - Added the required column `content` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "content" JSONB NOT NULL,
ALTER COLUMN "tierId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "avatarId" INTEGER,
ADD COLUMN     "coverPhotoId" INTEGER;

-- CreateTable
CREATE TABLE "Image" (
"id" SERIAL,
    "url" TEXT NOT NULL,

    PRIMARY KEY ("id")
);
