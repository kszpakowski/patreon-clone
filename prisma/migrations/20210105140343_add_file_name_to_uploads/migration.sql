/*
  Warnings:

  - Added the required column `fileName` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "fileName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarFileName" TEXT,
ADD COLUMN     "coverPhotoFileName" TEXT;
