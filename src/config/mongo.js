import mongoose from "mongoose";

const uri = 'mongodb://admin:pass@localhost:27017/producto3?authSource=admin';

export async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log('✅ Conexión a MongoDB establecida.');
  } catch (error) {
    console.error('❌ No se pudo conectar a MongoDB', error);
    process.exit(1);
  }
}