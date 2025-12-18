import http from 'http';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import jwt from 'jsonwebtoken';

import { connectDB } from './src/config/mongo.js';
import { typeDefs } from './src/graphql/schema.js';
import { resolvers } from './src/graphql/resolvers.js';

const JWT_SECRET = 'SUPER_SECRETO_PARA_PRODUCTO3';

/**
 * Función para obtener el ID del usuario autenticado a partir del token JWT.
 * @param {string} token - Token JWT del encabezado 'Authorization'.
 * @returns {string|null} - El userId extraído del token o null si es inválido/expirado.
 */
function getAuthUserId(token) {
  if (!token) {
    return null;
  }

  const cleanToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

  try {
    const payload = jwt.verify(cleanToken, JWT_SECRET);
    return payload.userId;
  } catch (err) {
    console.warn("Token JWT inválido o expirado:", err.message);
    return null;
  }
}

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

  app.use(express.static('public'));


  // Configuramos los middlewares de Express
  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      /**s
       * Context global de GraphQL.
       * Aquí se añade la autenticación leyendo el header 'Authorization'.
       */
      context: async ({ req }) => {
        // 1. Obtener el token del encabezado
        const token = req.headers.authorization || '';

        // 2. Obtener el userId a partir del token decodificado
        const userId = getAuthUserId(token);

        return {
          // 3. Pasar el userId al contexto, lo usan los resolvers para 'checkAuth'
          userId
        };
      },
    })
  );

  await new Promise((resolve) => httpServer.listen({ port }, resolve));

  console.log(`🚀 Servidor Express listo en http://localhost:${port}`);
  console.log(`🚀 Servidor GraphQL listo en http://localhost:${port}/graphql`);
}

startServer();