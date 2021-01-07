import { prisma } from "../prisma";
import { CommentResolvers, Comment as GqlComment } from "../generated/graphql";
import { Context } from "../types";

const isCommentOwner = async (
  comment: GqlComment,
  _: any,
  { userId }: Context
) => {
  if (!userId) {
    return false;
  }
  return (
    (await prisma.comment.count({
      where: {
        id: comment.id,
        authorId: userId!,
      },
    })) > 0
  );
};

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
  canDelete: isCommentOwner,
  canEdit: isCommentOwner,
  canLike: async (_, __, { userId }) => {
    return userId !== null || userId !== undefined;
  },
  likes: async (comment) => {
    return await prisma.commentLike.count({
      where: {
        commentId: comment.id,
      },
    });
  },
  liked: async (comment, _, { userId }) => {
    if (!userId) {
      return false;
    }
    return (
      (await prisma.commentLike.count({
        where: {
          commentId: comment.id,
          author: userId,
        },
      })) > 1
    );
  },
};
