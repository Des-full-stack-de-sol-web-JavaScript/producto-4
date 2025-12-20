import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';
import { Voluntariado } from '../models/voluntariado.model.js';

// Datos
import { users } from './usersData.js';
import { voluntariados } from './voluntariadosData.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const clientOptions = {
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10,
  minPoolSize: 2,
};

const seedDatabase = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('❌ MONGO_URI no está definida en el archivo .env');
    }

    // 1. CONEXIÓN
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI, clientOptions);
    console.log('✅ Conectado.');

    // 2. LIMPIEZA
    console.log('🧹 Borrando contenido de la base de datos...');
    await User.deleteMany({});
    await Voluntariado.deleteMany({});
    console.log('✨ Base de datos limpia.');

    // 3. CARGA DE USUARIOS
    console.log('👥 Insertando usuarios...');
    for (const user of users) {
      await User.create(user);
    }
    console.log(`✅ ${users.length} usuarios insertados.`);

    // 4. CARGA DE VOLUNTARIADOS
    console.log('🤝 Insertando voluntariados...');
    await Voluntariado.insertMany(voluntariados);
    console.log(`✅ ${voluntariados.length} voluntariados insertados.`);

    // 5. FINALIZACIÓN
    console.log('🚀 Script finalizado con éxito.');
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error ejecutando el seed:', error);
    process.exit(1);
  }
};

seedDatabase();