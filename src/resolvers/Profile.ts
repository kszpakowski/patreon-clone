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
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts as any;
  },
  avatarUrl: async (profile) => {
    const { id, avatarFileName } = profile as User;
    if (avatarFileName) {
      return await minio.presignedGetObject(
        "avatars",
        `${id}/${avatarFileName}`
      );
    } else {
      return null;
    }
  },
  coverPhotoUrl: async (profile) => {
    const { id, coverPhotoFileName } = profile as User;
    if (coverPhotoFileName) {
      return await minio.presignedGetObject(
        "covers",
        `${id}/${coverPhotoFileName}`
      );
    } else {
      return null;
    }
  },
};
