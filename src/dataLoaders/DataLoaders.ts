import DataLoader from "dataloader";
import prisma from "../prisma";
import { Comment, Tier } from "@prisma/client";

export default {
  createPostCommentsDataLoader: () =>
    new DataLoader<number, Comment[]>(
      async (postsIds: readonly number[]): Promise<Comment[][]> => {
        const comments = await prisma.comment.findMany({
          where: {
            postId: { in: postsIds as number[] },
            parentCommentId: null,
          },
        });

        const postIdToComments = comments.reduce((map, comment) => {
          map[comment.postId!] = [...(map[comment.postId!] || []), comment];
          return map;
        }, {} as Record<number, Comment[]>);

        return postsIds.map((id) => postIdToComments[id]);
      }
    ),
  createTierDataLoader: () =>
    new DataLoader<number, Tier>(
      async (tierIds: readonly number[]): Promise<Tier[]> => {
        const tiers = await prisma.tier.findMany({
          where: {
            id: { in: tierIds as number[] },
          },
        });

        const tierIdToTier = tiers.reduce((map, tier) => {
          map[tier.id!] = tier;
          return map;
        }, {} as Record<number, Tier>);

        return tierIds.map((id) => tierIdToTier[id]);
      }
    ),
};
