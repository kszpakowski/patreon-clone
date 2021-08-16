import { prisma } from "../prisma";

export default {
  findById: async (id: number) => {
    console.log(`Fetching user with id ${id}`);
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  },
};
