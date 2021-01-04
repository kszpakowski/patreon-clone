import fs from "fs";
import path from "path";
import { ApolloServer, gql as buildSchema } from "apollo-server";
import { resolvers } from "./resolvers";
import { jwtSigningKey } from "./auth";
import jwt from "jsonwebtoken";
import { Context } from "./types";

const schema = fs.readFileSync(path.join(__dirname, "schema.gql"), "utf-8");
const typeDefs = buildSchema(schema);

const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers as any,
  context: ({ req }) => {
    const ctx: Context = {};
    const token = req.headers.authorization || "";

    if (token) {
      const decoded = jwt.verify(
        token.replace("Bearer ", ""),
        jwtSigningKey
      ) as any;
      ctx.userId = decoded.sub;
    }
    return ctx;
  },
});

server.listen(4000);
console.log(`Apollo server started on port 4000 👯‍♀️`);

//fixes https://github.com/whitecolor/ts-node-dev/issues/69
process.on("SIGTERM", () => process.exit());
