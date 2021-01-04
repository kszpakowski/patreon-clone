import { Resolvers, User } from "./generated/graphql";
import { PrismaClient } from "@prisma/client";
import { mutations } from "./mutations";
const prisma = new PrismaClient();

export const resolvers: Resolvers = {
  Query: {
    me: async (_, __, { userId }) => {
      if (!userId) {
        console.log("me - User not logged in");
        return null;
      }
      return (await prisma.user.findUnique({
        where: { id: userId },
      })) as User;
    },
    profile: async (_, { name }) => {
      return await prisma.user.findUnique({
        where: {
          name,
        },
      });
    },
    posts: async () => {
      const posts = await prisma.post.findMany(); //todo implement
      return posts as any;
    },
  },
  User: {
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
  },
  TierSubscription: {
    tier: async (subscription) => {
      const mappedSubscription = subscription as any; //TODO as Prisma model?
      const tier = await prisma.tier.findUnique({
        where: {
          id: mappedSubscription.tierId,
        },
      });

      return tier as any;
    },
  },
  Tier: {
    owner: async (tier) => {
      const mapped = tier as any;
      const owner = await prisma.user.findUnique({
        where: {
          id: mapped.ownerId,
        },
      });

      return owner as any;
    },
  },
  Profile: {
    tiers: async (profile) => {
      const mapped = profile as any;
      const tiers = await prisma.tier.findMany({
        where: {
          ownerId: mapped.id,
        },
      });
      return tiers as any;
    },
    posts: async (profile, _, { userId }) => {
      const profileId = (profile as any).id;

      const subscriptions = await prisma.tierSubscription.findMany({
        where: {
          ownerId: userId,
        },
      });

      const subscribedTiersIds = subscriptions.map((s) => s.tierId);

      const ownTiers = await prisma.tier.findMany({
        where: {
          ownerId: userId,
        },
      });

      const ownTiersIds = ownTiers.map((t) => t.id);

      const posts = await prisma.post.findMany({
        where: {
          authorId: profileId,
          tierId: {
            in: [...subscribedTiersIds, ...ownTiersIds],
          },
        },
      });
      return posts as any;
    },
  },
  Post: {
    tier: async (post) => {
      const mapped = post as any;
      const tier = prisma.tier.findUnique({
        where: {
          id: mapped.tierId,
        },
      });

      return tier as any;
    },
  },
  Mutation: mutations,
};
