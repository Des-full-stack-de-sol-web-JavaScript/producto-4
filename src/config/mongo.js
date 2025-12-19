import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

//Opciones de Conexión Escalable
const clientOptions = {
  serverSelectionTimeoutMS: 5000, // Tiempo máximo para intentar conectarse
  maxPoolSize: 10, // Pool de conexiones permite 10 operaciones simultáneas
  minPoolSize: 2,  // Mantener siempre al menos 2 conexiones vivas
};

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, clientOptions);
    console.log('✅ Conexión a MongoDB establecida.');
  } catch (error) {
    console.error('❌ No se pudo conectar a MongoDB', error);
    process.exit(1);
  }
}