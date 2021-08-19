import prisma from "../prisma";
import { minio } from "../minio";
import { PostResolvers, User } from "../generated/graphql";
import { Post as PostEntity } from "@prisma/client";

export const Post: PostResolvers = {
  tier: async (post, _, { tierDataLoader }) => {
    const { tierId } = post as any;
    return await tierDataLoader.load(tierId);
  },
  attachments: async (post) => {
    const attachments = await prisma.attachment.findMany({
      where: {
        postId: post.id,
      },
    });

    return Promise.all(
      attachments.map(async ({ postId, fileName }) => ({
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
  commentsCount: async (post) => {
    return await prisma.comment.count({
      where: {
        postId: post.id,
      },
    });
  },
  likesCount: async (post) => {
    return await prisma.postLike.count({
      where: {
        postId: post.id,
      },
    });
  },
  liked: async ({ id }, _, { userId }) => {
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
  author: async (post) => {
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
