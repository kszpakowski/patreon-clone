-- CreateTable
CREATE TABLE "CommentLike" (
"id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommentLike" ADD FOREIGN KEY("authorId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD FOREIGN KEY("commentId")REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
