import dotenv from "dotenv";
import Fastify, { FastifyRequest } from "fastify";
import { mercurius } from "mercurius";

import { createAuthContext } from "./context/auth.context";
import { connectDB } from "./db";
import { resolvers } from "./graphql/resolvers";
import { schema } from "./graphql/schema";

dotenv.config();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI environment variable is required");
}

const PORT = (process.env.PORT && parseInt(process.env.PORT)) || 3000;
const startServer = async () => {
  const fastify = Fastify({
    logger: true,
  });

  await connectDB();

  fastify.register(mercurius, {
    schema: schema,
    resolvers: resolvers,
    graphiql: true,
    context: async (request: FastifyRequest) => {
      return createAuthContext(request.headers["authorization"]);
    },
  });

  try {
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};
// start the server
startServer();
