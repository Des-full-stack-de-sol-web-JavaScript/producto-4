import * as UserService from '../services/usersService.js';
import * as VoluntariadoService from '../services/voluntariadosService.js';
import jwt from 'jsonwebtoken';

// Clave secreta para firmar los JWT. ¡DEBE SER UNA VARIABLE DE ENTORNO EN PRODUCCIÓN!
const JWT_SECRET = 'SUPER_SECRETO_PARA_PRODUCTO3';

/**
 * Función auxiliar para verificar si el usuario es administrador.
 * Lanza un error si el usuario no está autenticado o no es administrador(context.userId no está presente).
 * @param {object} context - El contexto de la petición GraphQL.
 * @throws {Error} Si el usuario no está autenticado o si no es admin.
 */
export const checkAdmin = (context) => { 
  if (!context.user) throw new Error('Autenticación requerida');
  if (context.user.rol !== 'admin') {
    throw new Error('Acceso denegado: solo administradores');
  }
  return true;
};

/**
 * Función auxiliar para verificar la autenticación.
 * Lanza un error si el usuario no está autenticado (context.userId no está presente).
 * @param {object} context - El contexto de la petición GraphQL.
 * @throws {Error} Si el usuario no está autenticado.
 */

export const checkAuth = (context) => {
  if (!context.user) throw new Error('Autenticación requerida');
  return true;
};

/**
 * Verifica si el usuario puede acceder a un recurso.
 * - Admin: acceso total
 * - Usuario normal: solo a su propio recurso
 *
 * @param {object} context - Contexto GraphQL
 * @param {string} ownerValue - Identificador del dueño (userId o email)
 * @param {'userId'|'email'} ownerType - Tipo de comparación
 */
export const checkautorizado = (context, ownerValue, ownerType = 'userId') => {
  if (!context.user) {
    throw new Error('Autenticación requerida');
  }

  // Admin puede todo
  if (context.user.rol === 'admin') {
    return true;
  }

  // Usuario normal: solo lo suyo
  const currentValue =
    ownerType === 'email'
      ? context.user.email
      : context.user.userId;

  if (currentValue !== ownerValue) {
    throw new Error('No autorizado');
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

    users: async (_, args, context) => {
      checkautorizado(context, null);
      return await UserService.getAllUsers();
    },
    /**
    * Obtiene un usuario por su ID.
    * @param {object} args
    * @param {string} args.id - ID del usuario.
    * @returns {Promise<object|null>}
    */
    user: async (_, { id }) => {
      checkautorizado(context, id, 'userId');
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
        { 
          userId: user._id.toString(),
           email: user.email,
           rol: user.rol
           },
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
      checkautorizado(context, id, 'userId');
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
      const voluntariado = await VoluntariadoService.getVoluntariadoById(id);
      checkautorizado(context, voluntariado.email, 'email');
      return await VoluntariadoService.updateVoluntariado(id, { titulo, email, fecha, descripcion, tipo });
    },
    /**
     * Elimina un voluntariado por ID.
     * @param {object} args
     * @param {string} args.id
     * @returns {Promise<boolean>}
     */
    deleteVoluntariado: async (_, { id }, context) => {
      const voluntariado = await VoluntariadoService.getVoluntariadoById(id);
      checkautorizado(context, voluntariado.email, 'email');
      return await VoluntariadoService.deleteVoluntariado(id);
    }
  }
};
