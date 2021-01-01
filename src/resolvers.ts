import { Resolvers } from "./generated/graphql";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ctx = {
  //mock context
  userId: 1,
};

export const resolvers: Resolvers = {
  Query: {
    me: async () => await prisma.user.findUnique({ where: { id: ctx.userId } }),
  },
  Mutation: {
    async register(_, { registerInput }) {
      const user = await prisma.user.create({
        data: {
          email: registerInput.email,
          password: registerInput.password, //todo hash
        },
      });
      return user;
    },
  },
};
