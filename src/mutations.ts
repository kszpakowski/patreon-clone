import { MutationResolvers, User } from "./generated/graphql";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { jwtSigningKey } from "./auth";

const prisma = new PrismaClient();
const argon = require("argon2");

export const mutations: MutationResolvers = {
  async register(_, { registerInput: { name, email, password } }) {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await argon.hash(password),
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
    return user as User;
  },
  async login(_, { loginInput: { email, password } }) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const passMatch = await argon.verify(user?.password, password);
    if (!passMatch) {
      return {
        errors: [
          {
            message: "Invalid credentials",
          },
        ],
      };
    }

    const token = jwt.sign({ sub: user?.id }, jwtSigningKey);
    return {
      token: token,
    };
  },
  async subscribe(_, { subscribeInput: { tierId } }, { userId }) {
    return prisma.tierSubscription.create({
      data: {
        owner: {
          connect: {
            id: userId,
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
  async createPost(_, { createPostInput: { title, tierId } }, { userId }) {
    const tiers = await prisma.tier.findMany({
      where: { ownerId: userId },
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
            id: 1,
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
};
