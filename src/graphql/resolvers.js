import * as UserService from '../services/user.service.js';
import * as VoluntariadoService from '../services/voluntariado.service.js';

export const resolvers = {
  Query: {
    users: async () => {
      return await UserService.getAllUsers();
    },
    user: async (_, { id }) => {
      return await UserService.getUserById(id);
    },
    voluntariados: async () => {
      return await VoluntariadoService.getAllVoluntariados();
    },
    voluntariado: async (_, { id }) => {
      return await VoluntariadoService.getVoluntariadoById(id);
    }
  },
  Mutation: {
    addUser: async (_, { nombre, email, password }) => {
      return await UserService.registrarUsuario({ nombre, email, password });
    },
    deleteUser: async (_, { id }) => {
      return await UserService.deleteUser(id);
    },
    addVoluntariado: async (_, { titulo, email, fecha, descripcion, tipo }) => {
      return await VoluntariadoService.addVoluntariado({ titulo, email, fecha, descripcion, tipo });
    },
    updateVoluntariado: async (_, { id, titulo, email, fecha, descripcion, tipo }) => {
      return await VoluntariadoService.updateVoluntariado(id, { titulo, email, fecha, descripcion, tipo });
    },
    deleteVoluntariado: async (_, { id }) => {
      return await VoluntariadoService.deleteVoluntariado(id);
    }
  }
};
