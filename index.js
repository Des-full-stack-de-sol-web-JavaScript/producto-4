import http from 'http';
import express from 'express';
import cors from 'cors';
import { connectDB } from './src/config/mongo.js';


async function startServer() {
  await connectDB();
  
  const app = express();
  const httpServer = http.createServer(app);
  const port = 3000;

  app.use(cors());
  app.use(express.json()); 

  app.get('/', (req, res) => {
    res.send('✅ Servidor Express funcionando y conectado a MongoDB.');
  });


  await new Promise((resolve) => httpServer.listen({ port }, resolve));
  
  console.log(`🚀 Servidor Express listo en http://localhost:${port}`);
}

startServer();