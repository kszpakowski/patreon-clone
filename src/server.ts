require("dotenv").config();
import fs from "fs";
import path from "path";
import { ApolloServer, gql as buildSchema } from "apollo-server";
import auth from "./auth";
import { Context } from "./types";
import {
  Comment,
  Post,
  Profile,
  Query,
  Tier,
  TierSubscription,
  User,
} from "./resolvers/";
import { mutations } from "./mutations";
import DataLoaders from "./dataLoaders/DataLoaders";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const schema = fs.readFileSync(path.join(__dirname, "schema.gql"), "utf-8");
const typeDefs = buildSchema(schema);

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Comment,
    User,
    TierSubscription,
    Tier,
    Profile,
    Post,
    Mutation: mutations,
  } as any,
  context: ({ req }) => {
    const ctx: Context = {
      postCommentsDataLoader: DataLoaders.createPostCommentsDataLoader(prisma),
      tierDataLoader: DataLoaders.createTierDataLoader(prisma),
      prisma,
      userId: auth.getUserId(req),
    };

    return ctx;
  },
});

server.listen(4000);
console.log(`Apollo server started on port 4000 👯‍♀️`);

//fixes https://github.com/whitecolor/ts-node-dev/issues/69
process.on("SIGTERM", () => process.exit());
