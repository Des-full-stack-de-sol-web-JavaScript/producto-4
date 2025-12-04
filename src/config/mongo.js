import mongoose from "mongoose";

const uri = 'mongodb://admin:pass@localhost:27017/producto3?authSource=admin';

//Opciones de Conexión Escalable
const clientOptions = {
  serverSelectionTimeoutMS: 5000, // Tiempo máximo para intentar conectarse
  maxPoolSize: 10, // Pool de conexiones permite 10 operaciones simultáneas
  minPoolSize: 2,  // Mantener siempre al menos 2 conexiones vivas
};

export async function connectDB() {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log('✅ Conexión a MongoDB establecida.');
  } catch (error) {
    console.error('❌ No se pudo conectar a MongoDB', error);
    process.exit(1);
  }
}