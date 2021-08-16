import { Comment } from "@prisma/client";
import DataLoader from "dataloader";

export interface Context {
  postCommentsDataLoader: DataLoader<number, Comment[]>;
  userId?: number;
}
