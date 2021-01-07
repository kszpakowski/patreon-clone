import { prisma } from "../prisma";
import { minio } from "../minio";
import { PostResolvers } from "../generated/graphql";

export const Post: PostResolvers = {
  tier: async (post) => {
    const mapped = post as any;
    const tier = prisma.tier.findUnique({
      where: {
        id: mapped.tierId,
      },
    });

    return tier as any;
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
  comments: async (post) => {
    const comments: any = prisma.comment.findMany({
      where: {
        postId: post.id,
      },
    });
    return comments;
  },
};
