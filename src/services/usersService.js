import { getDB } from '../config/mongo.js';
import { ObjectId } from 'mongodb';

/**
 * Función auxiliar para obtener la colección 'users'
 */
function getCollection() {
  return getDB().collection('users');
}

/**
 * Devuelve todos los usuarios
 * @returns {Promise<Array>} Un array de todos los usuarios
 */
export async function getAllUsers() {
  try {
    return await getCollection().find({}).toArray();
  } catch (error) {
    throw new Error(`Error al obtener usuarios: ${error.message}`);
  }
}

/**
 * Devuelve un usuario por su ID
 * @param {string} id - El ID del usuario
 * @returns {Promise<object|null>} El documento del usuario o null
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
 * Registra un nuevo usuario
 * @param {object} data - { nombre, email, password }
 * @returns {Promise<object>} El usuario recién creado
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
 * Elimina un usuario por su ID
 * @param {string} id - El ID del usuario
 * @returns {Promise<boolean>} True si se eliminó, false si no
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