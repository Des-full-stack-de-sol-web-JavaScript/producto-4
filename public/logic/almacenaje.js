import { apiClient } from './apiClient.js';

const almacenaje = {
  // ==========================================
  // 1. GESTIÓN DE TOKEN Y SESIÓN
  // ==========================================
  guardarToken(token) {
    if (token) localStorage.setItem("jwt_token", token);
  },

  obtenerToken() {
    return localStorage.getItem("jwt_token");
  },

  borrarToken() {
    localStorage.removeItem("jwt_token");
  },

  obtenerUsuarioActivo() {
    const userJSON = localStorage.getItem("activeUser");
    return userJSON ? JSON.parse(userJSON) : null;
  },

  logoutUser() {
    this.borrarToken();
    localStorage.removeItem("activeUser");
  },

  mostrarUsuarioActivo() {
    const user = this.obtenerUsuarioActivo();
    return user ? user.nombre : "-- no login --";
  },

  // ==========================================
  // 2. GESTIÓN DE USUARIOS 
  // ==========================================
  async obtenerUsuarios() {
    const query = `query Users {
      users { _id nombre email rol }
    }`;
    try {
      const data = await apiClient.post({ query });
      return data.users || [];
    } catch (error) {
      return [];
    }
  },

  async registrarUsuario({ nombre, email, password }) {
    const mutation = `
      mutation AddUser($nombre: String!, $email: String!, $password: String!) {
        addUser(nombre: $nombre, email: $email, password: $password) {
          _id nombre email rol
        }
      }
    `;
    try {
      const data = await apiClient.post({
        query: mutation,
        variables: { nombre, email, password }
      });
      return data.addUser;
    } catch (error) {
      return false;
    }
  },

  async loguearUsuario(email, password) {
    const mutation = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user { _id nombre rol }
        }
      }
    `;
    try {
      const data = await apiClient.post({
        query: mutation,
        variables: { email, password }
      });

      if (data.login && data.login.token) {
        this.guardarToken(data.login.token);
        localStorage.setItem("activeUser", JSON.stringify(data.login.user));
      }
      return data.login;
    } catch (error) {
      return null;
    }
  },

  async borrarUsuario(id) {
    const mutation = `
      mutation DeleteUser($id: ID!) {
        deleteUser(id: $id)
      }
    `;
    try {
      const data = await apiClient.post({
        query: mutation,
        variables: { id }
      });
      return data.deleteUser;
    } catch (error) {
      return false;
    }
  },

  // ==========================================
  // 3. GESTIÓN DE VOLUNTARIADOS 
  // ==========================================
  
  async obtenerVoluntariados() {
    const query = `query GetVoluntariados {
      voluntariados {
        _id
        titulo
        email
        fecha
        descripcion
        tipo
      }
    }`;

    try {
      const data = await apiClient.post({ query });
      return data.voluntariados || [];
    } catch (error) {
      console.error("Error obteniendo voluntariados:", error);
      return [];
    }
  },

  async insertarVoluntariado(voluntariado) {
    const mutation = `
      mutation AddVoluntariado(
        $titulo: String!, 
        $email: String!, 
        $fecha: String!, 
        $descripcion: String, 
        $tipo: String
      ) {
        addVoluntariado(
          titulo: $titulo, 
          email: $email, 
          fecha: $fecha, 
          descripcion: $descripcion, 
          tipo: $tipo
        ) {
          _id
        }
      }
    `;

    const variables = {
      titulo: voluntariado.titulo || voluntariado.title, 
      email: voluntariado.email,
      fecha: voluntariado.fecha || voluntariado.date,
      descripcion: voluntariado.descripcion || voluntariado.description,
      tipo: voluntariado.tipo || voluntariado.type
    };

    try {
      const data = await apiClient.post({
        query: mutation,
        variables: variables
      });
      return data.addVoluntariado;
    } catch (error) {
      console.error("Error insertando voluntariado:", error);
      throw error;
    }
  },

  async borrarVoluntariado(id) {
    const mutation = `
      mutation DeleteVoluntariado($id: ID!) {
        deleteVoluntariado(id: $id)
      }
    `;

    try {
      const data = await apiClient.post({
        query: mutation,
        variables: { id }
      });
      return data.deleteVoluntariado;
    } catch (error) {
      console.error("Error borrando voluntariado:", error);
      throw error;
    }
  }
};

export { almacenaje };