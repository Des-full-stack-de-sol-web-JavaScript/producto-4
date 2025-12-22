<<<<<<< HEAD
import { PubSub } from 'graphql-subscriptions'; // 1. Importamos la herramienta de tiempo real
import * as UserService from '../services/usersService.js';
import * as VoluntariadoService from '../services/voluntariadosService.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
=======
import * as UserService from "../services/usersService.js";
import * as VoluntariadoService from "../services/voluntariadosService.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
>>>>>>> 464865c1fcebec28d58c95c2ad434c70e5537833

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

<<<<<<< HEAD
// 2. Creamos la instancia de PubSub para gestionar los mensajes
const pubsub = new PubSub();

// Funciones auxiliares de verificación 
export const checkAdmin = (context) => {
  if (!context.user) throw new Error('Autenticación requerida');
  if (context.user.rol !== 'admin') throw new Error('Acceso denegado: solo administradores');
=======
/**
 * Función auxiliar para verificar si el usuario es administrador.
 * Lanza un error si el usuario no está autenticado o no es administrador(context.userId no está presente).
 * @param {object} context - El contexto de la petición GraphQL.
 * @throws {Error} Si el usuario no está autenticado o si no es admin.
 */
export const checkAdmin = (context) => {
  if (!context.user) throw new Error("Autenticación requerida");
  if (context.user.rol !== "admin") {
    throw new Error("Acceso denegado: solo administradores");
  }
>>>>>>> 464865c1fcebec28d58c95c2ad434c70e5537833
  return true;
};

export const checkAuth = (context) => {
  if (!context.user) throw new Error("Autenticación requerida");
  return true;
};

<<<<<<< HEAD
export const checkautorizado = (context, ownerValue, ownerType = 'userId') => {
  if (!context.user) throw new Error('Autenticación requerida');
  if (context.user.rol === 'admin') return true;
  const currentValue = ownerType === 'email' ? context.user.email : context.user.userId;
  if (currentValue !== ownerValue) throw new Error('No autorizado');
=======
/**
 * Verifica si el usuario puede acceder a un recurso.
 * - Admin: acceso total
 * - Usuario normal: solo a su propio recurso
 *
 * @param {object} context - Contexto GraphQL
 * @param {string} ownerValue - Identificador del dueño (userId o email)
 * @param {'userId'|'email'} ownerType - Tipo de comparación
 */
export const checkautorizado = (context, ownerValue, ownerType = "userId") => {
  if (!context.user) {
    throw new Error("Autenticación requerida");
  }

  // Admin puede todo
  if (context.user.rol === "admin") {
    return true;
  }

  // Usuario normal: solo lo suyo
  const currentValue =
    ownerType === "email" ? context.user.email : context.user.userId;

  if (currentValue !== ownerValue) {
    throw new Error("No autorizado");
  }

>>>>>>> 464865c1fcebec28d58c95c2ad434c70e5537833
  return true;
};

export const resolvers = {
<<<<<<< HEAD
  Query: {
=======
  /**
   * Resolvers de consultas (Query)
   */
  Query: {
    /**
     * Obtiene todos los usuarios.
     * @returns {Promise<Array<object>>}
     */

>>>>>>> 464865c1fcebec28d58c95c2ad434c70e5537833
    users: async (_, args, context) => {
      checkautorizado(context, null);
      return await UserService.getAllUsers();
    },
<<<<<<< HEAD

    user: async (_, { id }, context) => {
      checkautorizado(context, id, 'userId');
      return await UserService.getUserById(id);
    },

    voluntariados: async (_, { titulo, tipo }) => {
      return await VoluntariadoService.getVoluntariadosFiltrados({ titulo, tipo });
    },

=======
    /**
     * Obtiene un usuario por su ID.
     * @param {object} args
     * @param {string} args.id - ID del usuario.
     * @returns {Promise<object|null>}
     */
    user: async (_, { id }) => {
      checkautorizado(context, id, "userId");
      return await UserService.getUserById(id);
    },
    /**
    * Obtiene todos los voluntariados.
    * @returns {Promise<Array<object>>}
    */
    voluntariados: async (_, { filtro }, context) => {
    checkAuth(context); 
    return await VoluntariadoService.getVoluntariadosFiltrados(filtro);
    },
    /**
     * Obtiene un voluntariado por su ID.
     * @param {object} args
     * @param {string} args.id
     * @returns {Promise<object|null>}
     */
>>>>>>> 464865c1fcebec28d58c95c2ad434c70e5537833
    voluntariado: async (_, { id }) => {
      return await VoluntariadoService.getVoluntariadoById(id);
    },

    statsVoluntariados: async () => {
      return await VoluntariadoService.getVoluntariadoStats();
    },
  },
<<<<<<< HEAD

  Mutation: {
=======
  /**
   * Resolvers de Mutations (inserción, edición, borrado)
   */
  Mutation: {
    /**
     * Mutación para el inicio de sesión.
     * 1. Llama a loginUsuario para verificar las credenciales.
     * 2. Si es exitoso, genera un token JWT.
     * @returns {Promise<object>} AuthPayload con token y user.
     */
>>>>>>> 464865c1fcebec28d58c95c2ad434c70e5537833
    login: async (_, { email, password }) => {
      const user = await UserService.loginUsuario(email, password);
      const token = jwt.sign(
<<<<<<< HEAD
        { userId: user._id.toString(), email: user.email, rol: user.rol },
=======
        {
          userId: user._id.toString(),
          email: user.email,
          rol: user.rol,
        },
>>>>>>> 464865c1fcebec28d58c95c2ad434c70e5537833
        JWT_SECRET,
        { expiresIn: "1d" }
      );
<<<<<<< HEAD
      return { token, user };
=======

      return {
        token,
        user,
      };
>>>>>>> 464865c1fcebec28d58c95c2ad434c70e5537833
    },

    addUser: async (_, { nombre, email, password }) => {
      return await UserService.registrarUsuario({ nombre, email, password });
    },

    deleteUser: async (_, { id }, context) => {
      checkautorizado(context, id, "userId");
      return await UserService.deleteUser(id);
    },
<<<<<<< HEAD

    addVoluntariado: async (_, { titulo, email, fecha, descripcion, tipo }, context) => {
      checkAuth(context);
      const nuevo = await VoluntariadoService.addVoluntariado({ titulo, email, fecha, descripcion, tipo });
      
      // 3. ¡AVISO EN TIEMPO REAL!: Publicamos que se ha creado uno nuevo
      pubsub.publish('VOLUNTARIADO_CREADO', { voluntariadoCreado: nuevo });
      
      return nuevo;
    },

    updateVoluntariado: async (_, { id, titulo, email, fecha, descripcion, tipo }, context) => {
=======
    /**
     * Añade un voluntariado nuevo.
     * @param {object} args
     * @param {object} args.input
     * @returns {Promise<object>}
     */
    addVoluntariado: async (
      _,
      { titulo, email, fecha, descripcion, tipo },
      context
    ) => {
      // 1. Verificar seguridad
      checkAuth(context);

      // 2. Guardar en Base de Datos (usando tu servicio)
      const nuevoVoluntariado = await VoluntariadoService.addVoluntariado({
        titulo,
        email,
        fecha,
        descripcion,
        tipo,
      });

      // 3. EMITIR EL EVENTO WEBSOCKET
      // Esto le dice a todos los clientes conectados: "¡Hey, hay un nuevo voluntariado!"
      // Le pasamos el objeto 'nuevoVoluntariado' para que el front lo pinte directamente.
      if (context.io) {
        context.io.emit("nuevo_voluntariado", nuevoVoluntariado);
        console.log("📡 Evento 'nuevo_voluntariado' emitido vía Socket.io");
      }

      return nuevoVoluntariado;
    },
    /**
     * Actualiza un voluntariado existente.
     * @param {object} args
     * @param {string} args.id
     * @param {object} args.input
     * @returns {Promise<object|null>}
     */
    updateVoluntariado: async (
      _,
      { id, titulo, email, fecha, descripcion, tipo },
      context
    ) => {
>>>>>>> 464865c1fcebec28d58c95c2ad434c70e5537833
      const voluntariado = await VoluntariadoService.getVoluntariadoById(id);
      checkautorizado(context, voluntariado.email, "email");
      return await VoluntariadoService.updateVoluntariado(id, {
        titulo,
        email,
        fecha,
        descripcion,
        tipo,
      });
    },

    deleteVoluntariado: async (_, { id }, context) => {
      const voluntariado = await VoluntariadoService.getVoluntariadoById(id);
<<<<<<< HEAD
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
=======
      checkautorizado(context, voluntariado.email, "email");

      const eliminado = await VoluntariadoService.deleteVoluntariado(id);

      if (eliminado && context.io) {
        console.log(`📡 Emitiendo borrado de: ${id}`);
        context.io.emit("voluntariado_eliminado", id);
      }

      return eliminado;
    },
  },
};
>>>>>>> 464865c1fcebec28d58c95c2ad434c70e5537833
