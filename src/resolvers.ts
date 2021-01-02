import { Resolvers, User } from "./generated/graphql";
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
    profile: async (_, { name }) => {
      console.log(`Resolving profile ${name}`);
      return await prisma.user.findUnique({
        where: {
          name,
        },
      });
    },
    posts: async () => {
      return []; // TODO implement
    },
  },
  Mutation: {
    async register(_, { registerInput }) {
      const user = await prisma.user.create({
        data: {
          name: registerInput.name,
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
          paymentId: "uuid",
        },
      }) as any;
    },
    async createPost(_, { createPostInput: { title, tierId } }) {
      console.log(`Creating post ${title}, tier - ${tierId}`);

      const tiers = await prisma.tier.findMany({
        where: { ownerId: ctx.userId },
      });

      const isOwnTier = tiers.some((t) => t.id === tierId);

      if (!isOwnTier) {
        throw new Error("403"); // How to return Http 403?
      }

      const post = await prisma.post.create({
        data: {
          title,
          author: {
            connect: {
              id: ctx.userId,
            },
          },
          tier: {
            connect: {
              id: tierId,
            },
          },
        },
      });

      return post as any;
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
  },
  Post: {
    tier: async (post) => {
      console.log(post);
      const mapped = post as any;
      const tier = prisma.tier.findUnique({
        where: {
          id: mapped.tierId,
        },
      });

      return tier as any;
    },
  },
};
