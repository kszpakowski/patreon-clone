import { minio } from "../minio";
import { PostResolvers, User } from "../generated/graphql";
import { Post as PostEntity } from "@prisma/client";

export const Post: PostResolvers = {
  tier: async (post, _, { tierDataLoader }) => {
    const { tierId } = post as any;
    return await tierDataLoader.load(tierId);
  },
  attachments: async ({ id }, _, { prisma }) => {
    const attachments = await prisma.attachment.findMany({
      where: {
        postId: id,
      },
    });

    return Promise.all(
      attachments.map(async ({ postId, fileName }: any) => ({
        url: await minio.presignedGetObject(
          "attachments",
          `${postId}/${fileName}`
        ),
      }))
    );
  },
  comments: async ({ id }, _, { postCommentsDataLoader }) => {
    return postCommentsDataLoader.load(id);
  },
  commentsCount: async ({ id }, _, { prisma }) => {
    return await prisma.comment.count({
      where: {
        postId: id,
      },
    });
  },
  likesCount: async ({ id }, _, { prisma }) => {
    return await prisma.postLike.count({
      where: {
        postId: id,
      },
    });
  },
  liked: async ({ id }, _, { userId, prisma }) => {
    return (
      (await prisma.postLike.count({
        //https://github.com/prisma/prisma-client-js/issues/703
        where: {
          authorId: userId,
          postId: id,
        },
      })) > 0
    );
  },
  canLike: async (_, __, { userId }) => {
    return !!userId;
  },
  author: async (post, _, { prisma }) => {
    const { authorId } = post as any as PostEntity;
    return (await prisma.user.findUnique({ where: { id: authorId } })) as User;
  },
  canComment: async (_, __, { userId }) => {
    return !!userId;
  },
  locked: async (post, _, { userId, tierDataLoader }) => {
    const { tierId } = post as any;
    const tier = await tierDataLoader.load(tierId);

    if (userId) {
      return false; //todo implement
    } else {
      return tier!.level >= 0;
    }
  },
};
