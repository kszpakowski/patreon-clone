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
      attachments.map(async ({ id, fileName }) => ({
        url: await minio.presignedGetObject("attachments", `${id}/${fileName}`),
      }))
    );
  },
};
