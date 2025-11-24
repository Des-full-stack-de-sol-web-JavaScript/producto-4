import http from 'http';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

import { connectDB } from './src/config/mongo.js';
import { typeDefs } from './src/graphql/schema.js';
import { resolvers } from './src/graphql/resolvers.js';


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
    expressMiddleware(server)
  );


  await new Promise((resolve) => httpServer.listen({ port }, resolve));

  console.log(`🚀 Servidor Express listo en http://localhost:${port}`);
  console.log(`🚀 Servidor GraphQL listo en http://localhost:${port}/graphql`);
}

startServer();