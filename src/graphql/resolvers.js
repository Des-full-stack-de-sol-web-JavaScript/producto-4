import * as UserService from '../services/usersService.js';
import * as VoluntariadoService from '../services/voluntariadosService.js';
import jwt from 'jsonwebtoken';

// Clave secreta para firmar los JWT. ¡DEBE SER UNA VARIABLE DE ENTORNO EN PRODUCCIÓN!
const JWT_SECRET = 'SUPER_SECRETO_PARA_PRODUCTO3';

/**
 * Función auxiliar para verificar la autenticación.
 * Lanza un error si el usuario no está autenticado (context.userId no está presente).
 * @param {object} context - El contexto de la petición GraphQL.
 * @throws {Error} Si el usuario no está autenticado.
 */
const checkAuth = (context) => {
  if (!context.userId) {
    throw new Error('Autenticación requerida para esta operación.');
  }
  return true;
};

export const resolvers = {
  /** 
  * Resolvers de consultas (Query)
  */
  Query: {
    /**
 * Obtiene todos los usuarios.
 * @returns {Promise<Array<object>>}
 */

    users: async () => {
      return await UserService.getAllUsers();
    },
    /**
    * Obtiene un usuario por su ID.
    * @param {object} args
    * @param {string} args.id - ID del usuario.
    * @returns {Promise<object|null>}
    */
    user: async (_, { id }) => {
      return await UserService.getUserById(id);
    },
    /**
    * Obtiene todos los voluntariados.
    * @returns {Promise<Array<object>>}
    */
    voluntariados: async () => {
      return await VoluntariadoService.getAllVoluntariados();
    },
    /**
   * Obtiene un voluntariado por su ID.
   * @param {object} args
   * @param {string} args.id
   * @returns {Promise<object|null>}
   */
    voluntariado: async (_, { id }) => {
      return await VoluntariadoService.getVoluntariadoById(id);
    },

    // Conectamos la nueva query con el servicio
    statsVoluntariados: async () => {
      return await VoluntariadoService.getVoluntariadoStats();
    }
  },
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
    login: async (_, { email, password }) => {
      const user = await UserService.loginUsuario(email, password);

      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      return {
        token,
        user
      };
    },

    /**
     * Añade un usuario nuevo.
     * @param {object} args
     * @param {object} args.input - Datos del usuario.
     * @returns {Promise<object>}
     */
    addUser: async (_, { nombre, email, password }) => {
      return await UserService.registrarUsuario({ nombre, email, password });
    },
    /**
     * Elimina un usuario por ID.
     * @param {object} args
     * @param {string} args.id
     * @returns {Promise<boolean>}
     */
    deleteUser: async (_, { id }, context) => {
      checkAuth(context);
      return await UserService.deleteUser(id);
    },
    /**
     * Añade un voluntariado nuevo.
     * @param {object} args
     * @param {object} args.input
     * @returns {Promise<object>}
     */
    addVoluntariado: async (_, { titulo, email, fecha, descripcion, tipo }, context) => {
      checkAuth(context);
      return await VoluntariadoService.addVoluntariado({ titulo, email, fecha, descripcion, tipo });
    },
    /**
    * Actualiza un voluntariado existente.
    * @param {object} args
    * @param {string} args.id
    * @param {object} args.input
    * @returns {Promise<object|null>}
    */
    updateVoluntariado: async (_, { id, titulo, email, fecha, descripcion, tipo }, context) => {
      checkAuth(context);
      return await VoluntariadoService.updateVoluntariado(id, { titulo, email, fecha, descripcion, tipo });
    },
    /**
     * Elimina un voluntariado por ID.
     * @param {object} args
     * @param {string} args.id
     * @returns {Promise<boolean>}
     */
    deleteVoluntariado: async (_, { id }, context) => {
      checkAuth(context);
      return await VoluntariadoService.deleteVoluntariado(id);
    }
  }
};
