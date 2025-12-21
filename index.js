import https from 'https';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { connectDB } from './src/config/mongo.js';
import { typeDefs } from './src/graphql/schema.js';
import { resolvers } from './src/graphql/resolvers.js';
import { getUserFromToken } from './src/helpers/auth.js';

async function startServer() {
  // Conexión a la base de datos
  await connectDB();

  const app = express();

  // CONFIGURACIÓN HTTPS (Certificados)
  const httpsOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  };
  const httpsServer = https.createServer(httpsOptions, app);

  // 1. Crear el esquema ejecutable (Necesario para que Query y Subscription compartan lógica)
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // 2. Crear el servidor de WebSockets vinculado al servidor HTTPS
  const wsServer = new WebSocketServer({
    server: httpsServer,
    path: '/graphql',
  });

  // 3. Configurar el manejo de la conexión WebSocket (Suscripciones)
  const serverCleanup = useServer({ schema }, wsServer);

  const port = 3000;

  // 4. Iniciar Apollo Server con plugins para cerrar conexiones limpiamente
  const server = new ApolloServer({
    schema,
    plugins: [
      // Cierre limpio del servidor HTTP
      ApolloServerPluginDrainHttpServer({ httpServer: httpsServer }),
      // Cierre limpio del servidor de WebSockets
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(express.static('public'));

  const corsOptions = {
    origin: '*',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  };

  // Middleware de Apollo
  app.use(
    '/graphql',
    cors(corsOptions),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Autenticación por Token para las Queries y Mutations normales
        const token = req.headers.authorization || '';
        const authUser = await getUserFromToken(token);
        return { user: authUser };
      },
    })
  );

  // Iniciar el servidor HTTPS (también WSS)
  await new Promise((resolve) => httpsServer.listen({ port }, resolve));

  console.log(`✅ Servidor Express/HTTPS listo en https://localhost:${port}`);
  console.log(`🚀 GraphQL Playground: https://localhost:${port}/graphql`);
  console.log(`📡 Suscripciones activas en wss://localhost:${port}/graphql`);
}

startServer();