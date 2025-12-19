import dotenv from 'dotenv';

dotenv.config();

// Variable privada para la conexión a la base de datos
let db;
const URL = process.env.GRAPHQL_API_URL;

const almacenaje = {
  // ==========================================
  // 1. GESTIÓN DE INDEXEDDB (VOLUNTARIADOS)
  // ==========================================
  initDB() {
    return new Promise((resolve, reject) => {
      console.log("Inicializando IndexedDB...");
      const request = indexedDB.open("voluntariadoDB", 1);

      request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains("voluntariados")) {
          db.createObjectStore("voluntariados", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };

      request.onsuccess = (event) => {
        db = event.target.result;
        resolve(db);
      };

      request.onerror = () => reject("Error al abrir IndexDB");
    });
  },

  insertarVoluntariado(voluntariado) {
    return new Promise((resolve, reject) => {
      if (!db) return reject("DB no inicializada");

      const transaction = db.transaction("voluntariados", "readwrite");
      const store = transaction.objectStore("voluntariados");
      const request = store.add(voluntariado);

      request.onsuccess = () => {
        console.log("Voluntariado insertado");
        resolve();
      };
      request.onerror = () => reject("Error al insertar");
    });
  },

  obtenerVoluntariados() {
    return new Promise((resolve, reject) => {
      if (!db) return reject("DB no inicializada");

      const transaction = db.transaction("voluntariados", "readonly");
      const store = transaction.objectStore("voluntariados");
      const request = store.getAll();

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = () => reject("Error al obtener datos");
    });
  },

  borrarVoluntariado(id) {
    return new Promise((resolve, reject) => {
      if (!db) return reject("DB no inicializada");

      const transaction = db.transaction("voluntariados", "readwrite");
      const store = transaction.objectStore("voluntariados");
      const request = store.delete(Number(id));

      request.onsuccess = () => {
        console.log(`ID ${id} borrado`);
        resolve();
      };
      request.onerror = () => reject("Error al borrar");
    });
  },

  // ==========================================
  // 2. GESTIÓN DE LOCALSTORAGE Y API (USUARIOS Y SESIÓN)
  // ==========================================
  guardarToken(token) {
    if (token) {
      localStorage.setItem("jwt_token", token);
    }
  },

  obtenerToken() {
    return localStorage.getItem("jwt_token");
  },

  borrarToken() {
    localStorage.removeItem("jwt_token");
  },

  async obtenerUsuarios() {
    const query = `query Users {
      users {
          _id
          nombre
          email
          rol
      }
    }`;

    const token = this.obtenerToken();
    const headers = { "Content-Type": "application/json" };

    if (token) headers["Authorization"] = token;

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ query }),
      });

      const { data, errors } = await response.json();
      debugger

      if (errors) {
        console.error("Error de GraphQL:", errors);
        return [];
      }
      return data && data.users ? data.users : [];
    } catch (error) {
      console.error("Error de red:", error);
      return [];
    }
  },

  async registrarUsuario({ nombre, email, password, rol }) {
    const mutation = `
      mutation AddUser($nombre: String!, $email: String!, $password: String!) {
        addUser(nombre: $nombre, email: $email, password: $password) {
          _id
          nombre
          email
          rol
        }
      }
    `;

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            nombre,
            email,
            password,
            rol,
          },
        }),
      });

      const { data, errors } = await response.json();

      if (errors) {
        console.error("Error de GraphQL:", errors);
        return false;
      }

      return data.addUser;
    } catch (error) {
      console.error("Error de red:", error);
      return false;
    }
  },

  borrarUsuario(email) {
    let users = JSON.parse(localStorage.getItem("usersList") || "[]");
    const initLen = users.length;
    users = users.filter((u) => u.email !== email);

    if (users.length < initLen) {
      localStorage.setItem("usersList", JSON.stringify(users));
      return true;
    }
    return false;
  },

  async loguearUsuario(emailLogin, passwordLogin) {
    const mutation = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user {
            _id
            nombre
            rol
          }
        }
      }
    `;

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            email: emailLogin,
            password: passwordLogin,
          },
        }),
      });

      const { data, errors } = await response.json();

      if (errors) {
        console.error("Error de GraphQL:", errors);
        return null;
      }

      if (data.login && data.login.token) {
        this.guardarToken(data.login.token);
        localStorage.setItem("activeUser", JSON.stringify(data.login.user));
      }

      return data.login;
    } catch (error) {
      console.error("Error de red:", error);
      return null;
    }
  },

  logoutUser() {
    this.borrarToken();
    localStorage.removeItem("activeUser");
    console.log("Sesión cerrada");
  },

  obtenerUsuarioActivo() {
    const userJSON = localStorage.getItem("activeUser");
    return userJSON ? JSON.parse(userJSON) : null;
  },

  mostrarUsuarioActivo() {
    return this.obtenerUsuarioActivo()
      ? this.obtenerUsuarioActivo().nombre
      : "-- no login --";
  },
};

export { almacenaje };