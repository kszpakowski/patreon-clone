import { UserResolvers } from "../generated/graphql";
import prisma from "../prisma";

export const User: UserResolvers = {
  tiers: async (user) => {
    const tiers = await prisma.tier.findMany({
      where: {
        ownerId: user.id,
      },
    });
    return tiers as any;
  },
  subscriptions: async (user) => {
    const subscriptions = await prisma.tierSubscription.findMany({
      where: {
        ownerId: user.id,
      },
    });

    return subscriptions as any;
  },
  posts: async (user) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: user.id,
      },
    });
    return posts as any;
  },
};
