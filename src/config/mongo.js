import { MongoClient } from 'mongodb';

const uri = 'mongodb://admin:pass@localhost:27017/producto3?authSource=admin';

const client = new MongoClient(uri);

let db;

export async function connectDB() {
  try {
    console.log('Conectando a MongoDB...');
    await client.connect();

    db = client.db('producto3');

    console.log('✅ Conexión a MongoDB establecida.');
  } catch (error) {
    console.error('❌ No se pudo conectar a MongoDB', error);
    process.exit(1);
  }
}

export function getDB() {
  if (!db) {
    throw new Error('La base de datos no está conectada. Llama a connectDB primero.');
  }
  return db;
}