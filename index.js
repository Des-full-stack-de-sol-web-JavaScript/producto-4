import https from 'https'; // se usa httpS
import fs from 'fs'; // necesario para leer los certificados
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

import { connectDB } from './src/config/mongo.js';
import { typeDefs } from './src/graphql/schema.js';
import { resolvers } from './src/graphql/resolvers.js';
import { getUserFromToken } from './src/helpers/auth.js';


/**
 * Punto de entrada principal del servidor.
 * 
 * - Inicia Express.
 * - Conecta con MongoDB.
 * - Configura Apollo Server como middleware en /graphql.
 * - Inicia servidor HTTPS.
 * 
 * Este servidor se encarga de manejar todas las peticiones
 * GraphQL enviadas por Postman, frontend o clientes externos.
 */
async function startServer() {
  await connectDB();

  const app = express();
  //CONFIGURACIÓN HTTPS
  const httpsOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  };
  const httpsServer = https.createServer(httpsOptions, app);

  const port = 3000;

  // Creamos el servidor Apollo, pasándole nuestro esquema y resolvers importados
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });


  await server.start();

  app.use(express.static('public'));

  const corsOptions = {
    origin: '*', 
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'] 
  };


  // Configuramos los middlewares de Express
  app.use(
    '/graphql',
    cors(corsOptions),
    express.json(),
    expressMiddleware(server, {
      /**s
       * Context global de GraphQL.
       * Aquí se añade la autenticación leyendo el header 'Authorization'.
       */
       context: async ({ req }) => {
      // 1. Leer el token del header Authorization
      const token = req.headers.authorization || '';

      // 2. Decodificar el JWT
      const authUser = await getUserFromToken(token);

      // 3. Pasar el usuario al contexto
      return {
        user: authUser // { userId, email, rol } | null
      };
    },
  })
);

  await new Promise((resolve) => httpsServer.listen({ port }, resolve));

  console.log(`🚀 Servidor Express listo en https://localhost:${port}`);
  console.log(`🚀 Servidor GraphQL listo en https://localhost:${port}/graphql`);

}

startServer();