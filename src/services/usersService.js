import { getDB } from '../config/mongo.js';
import { ObjectId } from 'mongodb';

/**
 * Obtiene la colección 'usuarios' de la base de datos.
 * @returns {import('mongodb').Collection} Colección de usuarios.
 */
function getCollection() {
  return getDB().collection('users');
}

/**
 * Obtiene todos los usuarios de la base de datos.
 * @async
 * @returns {Promise<Array<object>>} Lista de usuarios.
 * @throws {Error} Si ocurre un error durante la consulta.
 */
export async function getAllUsers() {
  try {
    return await getCollection().find({}).toArray();
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
    if (!ObjectId.isValid(id)) {
      return null;
    }
    return await getCollection().findOne({ _id: new ObjectId(id) });
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
    // Verificación de email duplicado
    const existingUser = await getCollection().findOne({ email: data.email });
    if (existingUser) {
      throw new Error('El email ya está registrado.');
    }

    const nuevoUsuario = {
      nombre: data.nombre,
      email: data.email,
      password: data.password, // En un proyecto real, esto debe ser un hash
      rol: "usuario"
    };

    const result = await getCollection().insertOne(nuevoUsuario);
    return await getCollection().findOne({ _id: result.insertedId });
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
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const result = await getCollection().deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  } catch (error) {
    throw new Error(`Error al eliminar usuario: ${error.message}`);
  }
}