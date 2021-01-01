import { Resolvers, User, Tier } from "./generated/graphql";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ctx = {
  //mock context
  userId: 1,
};

export const resolvers: Resolvers = {
  Query: {
    me: async () =>
      (await prisma.user.findUnique({ where: { id: ctx.userId } })) as User,
  },
  Mutation: {
    async register(_, { registerInput }) {
      const user = await prisma.user.create({
        data: {
          email: registerInput.email,
          password: registerInput.password, //todo hash
          tiers: {
            // create default tiers
            create: [
              {
                name: "Basic",
                price: 5.0,
                description: "",
              },
              {
                name: "Silver",
                price: 15.0,
                description: "",
              },
              {
                name: "Gold",
                price: 25.0,
                description: "",
              },
            ],
          },
        },
      });
      return user as User; //TODO implement mapper, or generate mappers
    },
    async subscribe(_, { subscribeInput: { tierId } }) {
      return prisma.tierSubscription.create({
        data: {
          owner: {
            connect: {
              id: ctx.userId,
            },
          },
          tier: {
            connect: {
              id: tierId,
            },
          },
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      }) as any;
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
};