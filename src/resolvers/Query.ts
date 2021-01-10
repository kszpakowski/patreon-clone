import { prisma } from "../prisma";
import { QueryResolvers, User } from "../generated/graphql";

export const Query: QueryResolvers = {
  me: async (_, __, { userId }) => {
    if (!userId) {
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
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }); //todo implement loading only subscribed and displaying locked posts
    return posts as any;
  },
};
