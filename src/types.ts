import { Comment, PrismaClient, Tier } from "@prisma/client";
import DataLoader from "dataloader";

export interface Context {
  postCommentsDataLoader: DataLoader<number, Comment[]>;
  tierDataLoader: DataLoader<number, Tier>;
  prisma: PrismaClient;
  userId?: number;
}
