import http from 'http';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

import { connectDB } from './src/config/mongo.js';
import { typeDefs } from './src/graphql/schema.js';
import { resolvers } from './src/graphql/resolvers.js';

/**
 * Punto de entrada principal del servidor.
 * 
 * - Inicia Express.
 * - Conecta con MongoDB.
 * - Configura Apollo Server como middleware en /graphql.
 * - Inicia servidor HTTP.
 * 
 * Este servidor se encarga de manejar todas las peticiones
 * GraphQL enviadas por Postman, frontend o clientes externos.
 */
async function startServer() {
  await connectDB();

  const app = express();
  const httpServer = http.createServer(app);
  const port = 3000;

  // Creamos el servidor Apollo, pasándole nuestro esquema y resolvers importados
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });


  await server.start();

  // Configuramos los middlewares de Express
  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server//, {
      /**
       * Context global de GraphQL.
       * Aquí puedes añadir autenticación.
       */
      //context: async ({ req }) => {
      //  return {
      //   token: req.headers.authorization || null,
      // };
      //  },
      //}
    )
  );



  await new Promise((resolve) => httpServer.listen({ port }, resolve));

  console.log(`🚀 Servidor Express listo en http://localhost:${port}`);
  console.log(`🚀 Servidor GraphQL listo en http://localhost:${port}/graphql`);
}

startServer();