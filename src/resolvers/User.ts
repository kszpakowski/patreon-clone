import { UserResolvers } from "../generated/graphql";

export const User: UserResolvers = {
  tiers: async ({ id }, _, { prisma }) => {
    const tiers = await prisma.tier.findMany({
      where: {
        ownerId: id,
      },
    });
    return tiers as any;
  },
  subscriptions: async ({ id }, _, { prisma }) => {
    const subscriptions = await prisma.tierSubscription.findMany({
      where: {
        ownerId: id,
      },
    });

    return subscriptions as any;
  },
  posts: async ({ id }, _, { prisma }) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: id,
      },
    });
    return posts as any;
  },
};
