import https from "https";
import fs from "fs";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import { connectDB } from "./src/config/mongo.js";
import { typeDefs } from "./src/graphql/schema.js";
import { resolvers } from "./src/graphql/resolvers.js";
import { getUserFromToken } from "./src/helpers/auth.js"; 
import { Server } from "socket.io";
async function startServer() {
  await connectDB();

  const app = express();
  
  const httpsOptions = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
  };
  const httpsServer = https.createServer(httpsOptions, app);

  const port = 3000;

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  const io = new Server(httpsServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Cliente conectado vía WebSockets: ${socket.id}`);
    socket.on("disconnect", () => {
      console.log("❌ Cliente desconectado");
    });
  });

  app.use(express.static("public"));

  const corsOptions = {
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  app.use(
    "/graphql",
    cors(corsOptions),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization || "";
        const authUser = await getUserFromToken(token);
        return {
          user: authUser,
          io: io, 
        };
      },
    })
  );

  await new Promise((resolve) => httpsServer.listen({ port }, resolve));

  console.log(`🚀 Servidor Express listo en https://localhost:${port}`);
  console.log(`🚀 Servidor GraphQL listo en https://localhost:${port}/graphql`);
}

startServer();