import { QueryResolvers, User } from "../generated/graphql";

export const Query: QueryResolvers = {
  me: async (_, __, { userId, prisma }) => {
    if (!userId) {
      return null;
    }
    return (await prisma.user.findUnique({
      where: { id: userId },
    })) as User;
  },
  profile: async (_, { name }, { prisma }) => {
    return await prisma.user.findUnique({
      where: {
        name,
      },
    });
  },
  posts: async (_, __, { userId, prisma }) => {
    return (await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tier: {},
      },
    })) as any;
  },
  post: async (_, { postId }, { userId, prisma }) => {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (userId) {
      return post as any;
    } else {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
        include: {
          tier: {},
        },
      });
      if (post!.tier.level >= 0) {
        return {
          ...post,
          attachments: [],
          title: `[locked] ${post!.title}`,
        };
      }
    }
  },
};
