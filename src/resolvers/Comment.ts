import { prisma } from "../prisma";
import { CommentResolvers } from "../generated/graphql";

export const Comment: CommentResolvers = {
  author: async (commnet: any) => {
    const author: any = await prisma.user.findUnique({
      where: {
        id: commnet.authorId,
      },
    });
    return author;
  },
  replies: async (comment) => {
    const replies: any = await prisma.comment.findMany({
      where: {
        parentCommentId: comment.id,
      },
    });
    return replies;
  },
};
