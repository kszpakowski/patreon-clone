import {
  CommentResolvers,
  Comment as GqlComment,
  Profile,
} from "../generated/graphql";
import { Context } from "../types";

const isCommentOwner = async (
  comment: GqlComment,
  _: any,
  { userId, prisma }: Context
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
  author: async (commnet: any, _, { prisma }) => {
    const { authorId } = commnet;
    return (await prisma.user.findUnique({
      where: {
        id: authorId,
      },
    })) as Profile;
  },
  replies: async (comment, _, { prisma }) => {
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
  likes: async (comment, _, { prisma }) => {
    return await prisma.commentLike.count({
      where: {
        commentId: comment.id,
      },
    });
  },
  liked: async (comment, _, { userId, prisma }) => {
    if (!userId) {
      return false;
    }

    return (
      (await prisma.commentLike.count({
        where: {
          commentId: comment.id,
          authorId: userId,
        },
      })) > 0
    );
  },
};
