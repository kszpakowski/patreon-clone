import { TierSubscriptionResolvers } from "../generated/graphql";

export const TierSubscription: TierSubscriptionResolvers = {
  tier: async (subscription, _, { prisma }) => {
    const mappedSubscription = subscription as any; //TODO as Prisma model?
    const tier = await prisma.tier.findUnique({
      where: {
        id: mappedSubscription.tierId,
      },
    });

    return tier as any;
  },
};
