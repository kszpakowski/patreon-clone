import { TierResolvers } from "../generated/graphql";
import { prisma } from "../prisma";

export const Tier: TierResolvers = {
  owner: async (tier) => {
    const mapped = tier as any;
    const owner = await prisma.user.findUnique({
      where: {
        id: mapped.ownerId,
      },
    });

    return owner as any;
  },
};
