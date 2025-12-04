import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';

/**
 * Obtiene todos los usuarios de la base de datos.
 * @async
 * @returns {Promise<Array<object>>} Lista de usuarios.
 * @throws {Error} Si ocurre un error durante la consulta.
 */
export async function getAllUsers() {
  try {
    return await User.find({});
  } catch (error) {
    throw new Error(`Error al obtener usuarios: ${error.message}`);
  }
}

/**
 * Obtiene un usuario por su ID.
 * @async
 * @param {string} id - ID del usuario en formato string.
 * @returns {Promise<object|null>} Usuario encontrado o null.
 * @throws {Error} Si ocurre un error en la consulta.
 */
export async function getUserById(id) {
  try {
    return await User.findById(id);
  } catch (error) {
    throw new Error(`Error al obtener usuario por ID: ${error.message}`);
  }
}

/**
 * Crea un nuevo usuario en la base de datos.
 * @async
 * @param {object} data - Datos del usuario.
 * @param {string} data.nombre - Nombre del usuario.
 * @param {string} data.email - Email del usuario.
 * @param {string} data.password - Contraseña del usuario.
 * @returns {Promise<object>} Usuario recién creado.
 * @throws {Error} Si ocurre un error al insertar.
 */
export async function registrarUsuario(data) {
  try {
    // Verificación de email duplicado (Mongoose: findOne)
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('El email ya está registrado.');
    }

    // USANDO MODELO DE MONGOOSE para crear el documento
    const nuevoUsuario = await User.create({
      nombre: data.nombre,
      email: data.email,
      password: data.password,
      rol: data.rol || "usuario" // Usa el rol de los datos o "usuario" por defecto
    });

    // Retornamos el objeto Mongoose sin la contraseña
    const { password: _, ...userWithoutPassword } = nuevoUsuario.toObject();
    return userWithoutPassword;
  } catch (error) {
    // Captura el error de 'email duplicado' o cualquier error de la BD
    throw new Error(`Error al registrar usuario: ${error.message}`);
  }
}

/**
 * Elimina un usuario por su ID.
 * @async
 * @param {string} id - ID del usuario a eliminar.
 * @returns {Promise<boolean>} true si fue eliminado, false si no existe.
 * @throws {Error} Si ocurre un error durante la eliminación.
 */
export async function deleteUser(id) {
  try {
    const result = await User.deleteOne({ _id: id });
    return result.deletedCount === 1;
  } catch (error) {
    throw new Error(`Error al eliminar usuario: ${error.message}`);
  }

}

/**
 * Autentica a un usuario por email y contraseña.
 * * Es el paso esencial donde se verifica la identidad del usuario.
 * @async
 * @param {string} email - Email del usuario.
 * @param {string} password - Contraseña en texto plano.
 * @returns {Promise<object|null>} Usuario si las credenciales son correctas (sin contraseña).
 * @throws {Error} Si las credenciales son incorrectas.
 */
export async function loginUsuario(email, password) {
  try {
    // Buscamos el usuario, FORZANDO A MONGOOSE A INCLUIR LA CONTRASEÑA
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Usuario no encontrado o credenciales incorrectas.');
    }

    // Comparamos el texto plano con el hash guardado
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error('Credenciales incorrectas.');
    }

    // Devolvemos el usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = user.toObject();

    return userWithoutPassword;
  } catch (error) {
    throw new Error(`Error durante el inicio de sesión: ${error.message}`);
  }
}
