import http from "http"; // 1. Cambiado de https a http
// import fs from "fs"; // 2. Ya no es necesario leer certificados
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import { connectDB } from "./src/config/mongo.js";
import { typeDefs } from "./src/graphql/schema.js";
import { resolvers } from "./src/graphql/resolvers.js";
import { getUserFromToken } from "./src/helpers/auth.js";
import dotenv from "dotenv";

import { Server } from "socket.io";

// Cargar variables de entorno si no se han cargado automáticamente
dotenv.config();

async function startServer() {
  await connectDB();

  const app = express();

  // 3. Creamos un servidor HTTP simple (CodeSandbox pone el HTTPS por fuera)
  const httpServer = http.createServer(app);

  const port = 3000;

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Socket.io se conecta al servidor HTTP
  const io = new Server(httpServer, {
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

  await new Promise((resolve) => httpServer.listen({ port }, resolve));

  console.log("API URL:", process.env.GRAPHQL_API_URL);
  console.log(`🚀 Servidor listo en http://localhost:${port}/graphql`);
}

startServer();
