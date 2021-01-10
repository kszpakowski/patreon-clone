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
  posts: async (_, __, { userId }) => {
    if (!userId) {
      const posts = await prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          tier: {},
        },
      });
      return posts.map((p) => {
        if (p.tier.level >= 0) {
          return {
            id: p.id,
            createdAt: p.createdAt,
            title: `This is locked version of post "${p.title}"`,
            authorId: p.authorId,
          };
        } else {
          return p;
        }
      });
    }

    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tier: {},
      },
    }); //todo implement loading only subscribed and displaying locked posts
    console.log(posts);
    return posts as any;
  },
};
