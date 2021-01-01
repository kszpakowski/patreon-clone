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
  },
};
