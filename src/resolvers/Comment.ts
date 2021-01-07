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
};