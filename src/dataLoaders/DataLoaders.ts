import DataLoader from "dataloader";
import prisma from "../prisma";
import { Comment } from ".prisma/client";

export default {
  createPostCommentsDataLoader: () =>
    new DataLoader<number, Comment[]>(
      async (postsIds: readonly number[]): Promise<Comment[][]> => {
        const comments = await prisma.comment.findMany({
          where: {
            postId: { in: postsIds as number[] },
            parentCommentId: null,
          },
        });

        const commentsMap: Record<number, Comment[]> = {};
        comments.forEach((comment) => {
          const postComments = commentsMap[comment.postId!];
          if (postComments) {
            postComments.push(comment);
          } else {
            commentsMap[comment.postId!] = [comment];
          }
        });

        return postsIds.map((id) => commentsMap[id]);
      }
    ),
};
