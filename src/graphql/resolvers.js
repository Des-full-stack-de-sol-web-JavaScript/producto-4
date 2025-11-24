import * as UserService from '../services/usersService.js';
import * as VoluntariadoService from '../services/voluntariadosService.js';

/**
 * Resolvers de GraphQL que conectan las Queries y Mutations
 * con la capa de servicios que accede a la base de datos.
 * 
 * Cada resolver sigue la estructura:
 * - parent: resultado del resolver padre
 * - args: argumentos recibidos en la Query/Mutation
 * - context: información global (auth, tokens, etc.)
 * - info: metadatos de la operación
 */
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
    }
  },
  /** 
   * Resolvers de Mutations (inserción, edición, borrado)
   */
  Mutation: {
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
    deleteUser: async (_, { id }) => {
      return await UserService.deleteUser(id);
    },
    /**
     * Añade un voluntariado nuevo.
     * @param {object} args
     * @param {object} args.input
     * @returns {Promise<object>}
     */
    addVoluntariado: async (_, { titulo, email, fecha, descripcion, tipo }) => {
      return await VoluntariadoService.addVoluntariado({ titulo, email, fecha, descripcion, tipo });
    },
    /**
    * Actualiza un voluntariado existente.
    * @param {object} args
    * @param {string} args.id
    * @param {object} args.input
    * @returns {Promise<object|null>}
    */
    updateVoluntariado: async (_, { id, titulo, email, fecha, descripcion, tipo }) => {
      return await VoluntariadoService.updateVoluntariado(id, { titulo, email, fecha, descripcion, tipo });
    },
    /**
     * Elimina un voluntariado por ID.
     * @param {object} args
     * @param {string} args.id
     * @returns {Promise<boolean>}
     */
    deleteVoluntariado: async (_, { id }) => {
      return await VoluntariadoService.deleteVoluntariado(id);
    }
  }
};
