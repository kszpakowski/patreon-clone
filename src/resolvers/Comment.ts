import { prisma } from "../prisma";
import {
  CommentResolvers,
  Comment as GqlComment,
  Profile,
} from "../generated/graphql";
import { Context } from "../types";
import userRepository from "../repository/userRepository";

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
    const { authorId } = commnet;
    return (await userRepository.findById(authorId)) as Profile;
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
          authorId: userId,
        },
      })) > 0
    );
  },
};
