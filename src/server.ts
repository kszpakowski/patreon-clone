require("dotenv").config();
import fs from "fs";
import path from "path";
import { ApolloServer, gql as buildSchema } from "apollo-server";
import jwt from "jsonwebtoken";
import { Context } from "./types";
import {
  Post,
  Profile,
  Query,
  Tier,
  TierSubscription,
  User,
} from "./resolvers/";
import { mutations } from "./mutations";

const schema = fs.readFileSync(path.join(__dirname, "schema.gql"), "utf-8");
const typeDefs = buildSchema(schema);

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    User,
    TierSubscription,
    Tier,
    Profile,
    Post,
    Mutation: mutations,
  } as any,
  context: ({ req }) => {
    const ctx: Context = {};
    const token = req.headers.authorization || "";

    try {
      if (token) {
        const decoded = jwt.verify(
          token.replace("Bearer ", ""),
          process.env.JWT_SIGNING_KEY!
        ) as any;
        ctx.userId = decoded.sub;
      }
      return ctx;
    } catch (err) {
      console.log(err.message);
    }
  },
});

server.listen(4000);
console.log(`Apollo server started on port 4000 👯‍♀️`);

//fixes https://github.com/whitecolor/ts-node-dev/issues/69
process.on("SIGTERM", () => process.exit());
