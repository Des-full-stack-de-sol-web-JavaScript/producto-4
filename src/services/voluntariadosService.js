import { getDB } from '../config/mongo.js';
import { ObjectId } from 'mongodb';

/**
 * Obtiene la colección 'voluntariados' de la base de datos.
 * @returns {import('mongodb').Collection} Colección de voluntariados.
 */
function getCollection() {
  return getDB().collection('voluntariados');
}

/**
 * Obtiene todos los voluntariados almacenados en la base de datos.
 * @async
 * @returns {Promise<Array<object>>} Lista completa de voluntariados.
 * @throws {Error} Si ocurre un error al consultar la base de datos.
 */
export async function getAllVoluntariados() {
  try {
    return await getCollection().find({}).toArray();
  } catch (error) {
    throw new Error(`Error al obtener voluntariados: ${error.message}`);
  }
}

/**
 * Obtiene un voluntariado específico por su ID.
 * @async
 * @param {string} id - ID del voluntariado en formato string.
 * @returns {Promise<object|null>} Documento de voluntariado encontrado o null si no existe.
 * @throws {Error} Si ocurre un error en la consulta.
 */
export async function getVoluntariadoById(id) {
  try {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    return await getCollection().findOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw new Error(`Error al obtener voluntariado por ID: ${error.message}`);
  }
}

/**
 * Crea un nuevo voluntariado en la base de datos.
 * @async
 * @param {object} data - Datos del voluntariado a crear.
 * @param {string} data.titulo - Título del voluntariado.
 * @param {string} data.descripcion - Descripción del voluntariado.
 * @param {string} data.fecha - Fecha del evento.
 * @param {string} data.organizador - Nombre del organizador.
 * @returns {Promise<object>} Voluntariado recién insertado.
 * @throws {Error} Si ocurre un error al insertar.
 */
export async function addVoluntariado(data) {
  try {
    const result = await getCollection().insertOne(data);
    return await getCollection().findOne({ _id: result.insertedId });
  } catch (error) {
    throw new Error(`Error al añadir voluntariado: ${error.message}`);
  }
}

/**
 * Actualiza un voluntariado existente.
 * @async
 * @param {string} id - ID del voluntariado a actualizar.
 * @param {object} data - Campos a actualizar.
 * @returns {Promise<object|null>} El voluntariado actualizado o null si no existe.
 * @throws {Error} Si ocurre un error en la actualización.
 */
export async function updateVoluntariado(id, data) {
  try {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const updateDoc = {};

    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        updateDoc[key] = data[key];
      }
    });

    if (Object.keys(updateDoc).length === 0) {
      return await getCollection().findOne({ _id: new ObjectId(id) });
    }

    await getCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    return await getCollection().findOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw new Error(`Error al actualizar voluntariado: ${error.message}`);
  }
}

/**
 * Elimina un voluntariado por su ID.
 * @async
 * @param {string} id - ID del voluntariado a eliminar.
 * @returns {Promise<boolean>} true si se eliminó correctamente, false si no existe.
 * @throws {Error} Si ocurre un error durante la eliminación.
 */
export async function deleteVoluntariado(id) {
  try {
    if (!ObjectId.isValid(id)) {
      return false;
    }

    const result = await getCollection().deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  } catch (error) {
    throw new Error(`Error al eliminar voluntariado: ${error.message}`);
  }
}