import Fastify from "fastify";
import mercurius from "mercurius";
import {connectDB} from "./db";
import dotenv from "dotenv";
import {resolvers } from "./graphql/resolvers";
import {schema} from "./graphql/schema"

dotenv.config();



const PORT = process.env.PORT && parseInt(process.env.PORT) || 3000; 
const startServer = async () => {
  const fastify = Fastify({
    logger: true,
  });

  await connectDB();

  fastify.register(mercurius, {
    schema: schema,
    resolvers: resolvers,
    graphiql: true,
  });

  try {
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    console.log("Server started on port", PORT);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

startServer();
