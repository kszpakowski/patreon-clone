import { ApolloServer, gql as buildSchema } from "apollo-server";
import { resolvers } from "./resolvers";
import fs from "fs";
import path from "path";

const schema = fs.readFileSync(path.join(__dirname, "schema.gql"), "utf-8");
const typeDefs = buildSchema(schema);

const server = new ApolloServer({ typeDefs, resolvers: resolvers as any });
server.listen(4000);
console.log("started");
