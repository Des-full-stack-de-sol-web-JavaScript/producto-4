import { PubSub } from 'graphql-subscriptions'; // 1. Importamos la herramienta de tiempo real
import * as UserService from '../services/usersService.js';
import * as VoluntariadoService from '../services/voluntariadosService.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// 2. Creamos la instancia de PubSub para gestionar los mensajes
const pubsub = new PubSub();

// Funciones auxiliares de verificación 
export const checkAdmin = (context) => {
  if (!context.user) throw new Error('Autenticación requerida');
  if (context.user.rol !== 'admin') throw new Error('Acceso denegado: solo administradores');
  return true;
};

export const checkAuth = (context) => {
  if (!context.user) throw new Error('Autenticación requerida');
  return true;
};

export const checkautorizado = (context, ownerValue, ownerType = 'userId') => {
  if (!context.user) throw new Error('Autenticación requerida');
  if (context.user.rol === 'admin') return true;
  const currentValue = ownerType === 'email' ? context.user.email : context.user.userId;
  if (currentValue !== ownerValue) throw new Error('No autorizado');
  return true;
};

export const resolvers = {
  Query: {
    users: async (_, args, context) => {
      checkautorizado(context, null);
      return await UserService.getAllUsers();
    },

    user: async (_, { id }, context) => {
      checkautorizado(context, id, 'userId');
      return await UserService.getUserById(id);
    },

    voluntariados: async (_, { titulo, tipo }) => {
      return await VoluntariadoService.getVoluntariadosFiltrados({ titulo, tipo });
    },

    voluntariado: async (_, { id }) => {
      return await VoluntariadoService.getVoluntariadoById(id);
    },

    statsVoluntariados: async () => {
      return await VoluntariadoService.getVoluntariadoStats();
    }
  },

  Mutation: {
    login: async (_, { email, password }) => {
      const user = await UserService.loginUsuario(email, password);
      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email, rol: user.rol },
        JWT_SECRET,
        { expiresIn: '1d' }
      );
      return { token, user };
    },

    addUser: async (_, { nombre, email, password }) => {
      return await UserService.registrarUsuario({ nombre, email, password });
    },

    deleteUser: async (_, { id }, context) => {
      checkautorizado(context, id, 'userId');
      return await UserService.deleteUser(id);
    },

    addVoluntariado: async (_, { titulo, email, fecha, descripcion, tipo }, context) => {
      checkAuth(context);
      const nuevo = await VoluntariadoService.addVoluntariado({ titulo, email, fecha, descripcion, tipo });
      
      // 3. ¡AVISO EN TIEMPO REAL!: Publicamos que se ha creado uno nuevo
      pubsub.publish('VOLUNTARIADO_CREADO', { voluntariadoCreado: nuevo });
      
      return nuevo;
    },

    updateVoluntariado: async (_, { id, titulo, email, fecha, descripcion, tipo }, context) => {
      const voluntariado = await VoluntariadoService.getVoluntariadoById(id);
      checkautorizado(context, voluntariado.email, 'email');
      return await VoluntariadoService.updateVoluntariado(id, { titulo, email, fecha, descripcion, tipo });
    },

    deleteVoluntariado: async (_, { id }, context) => {
      const voluntariado = await VoluntariadoService.getVoluntariadoById(id);
      checkautorizado(context, voluntariado.email, 'email');
      return await VoluntariadoService.deleteVoluntariado(id);
    }
  },

  // 4. EL CANAL DE ESCUCHA: Definimos la suscripción
  Subscription: {
    voluntariadoCreado: {
      subscribe: () => pubsub.asyncIterator(['VOLUNTARIADO_CREADO']),
    },
  },
};