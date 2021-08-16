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

        const postIdToComments = comments.reduce((map, comment) => {
          map[comment.postId!] = [...(map[comment.postId!] || []), comment];
          return map;
        }, {} as Record<number, Comment[]>);

        return postsIds.map((id) => postIdToComments[id]);
      }
    ),
};
