import { TierSubscriptionResolvers } from "../generated/graphql";
import { prisma } from "../prisma";

export const TierSubscription: TierSubscriptionResolvers = {
  tier: async (subscription) => {
    const mappedSubscription = subscription as any; //TODO as Prisma model?
    const tier = await prisma.tier.findUnique({
      where: {
        id: mappedSubscription.tierId,
      },
    });

    return tier as any;
  },
};
