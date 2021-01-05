import { prisma } from "../prisma";
import { minio } from "../minio";
import { ProfileResolvers } from "../generated/graphql";
import { User } from "@prisma/client";

export const Profile: ProfileResolvers = {
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
    //TODO compute locked posts basing on userId
    const profileId = (profile as User).id;

    const posts = await prisma.post.findMany({
      where: {
        authorId: profileId,
      },
    });

    return posts as any;
  },
  avatarUrl: async (profile) => {
    const fileName = (profile as User).avatarFileName;
    if (fileName) {
      return await minio.presignedGetObject("avatars", fileName);
    } else {
      return null;
    }
  },
  coverPhotoUrl: async (profile) => {
    const fileName = (profile as User).coverPhotoFileName;
    if (fileName) {
      return await minio.presignedGetObject("covers", fileName);
    } else {
      return null;
    }
  },
};
