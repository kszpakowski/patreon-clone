import { TierResolvers } from "../generated/graphql";

export const Tier: TierResolvers = {
  owner: async (tier, _, { prisma }) => {
    const mapped = tier as any;
    const owner = await prisma.user.findUnique({
      where: {
        id: mapped.ownerId,
      },
    });

    return owner as any;
  },
};
