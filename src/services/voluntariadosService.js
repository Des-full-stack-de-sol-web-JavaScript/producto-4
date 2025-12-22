import { Voluntariado } from '../models/voluntariado.model.js';

//  Obtiene voluntariados aplicando filtros de búsqueda.
export async function getVoluntariadosFiltrados({ titulo, tipo }) {
  try {
    let query = {};

    // Filtro por título: búsqueda parcial e insensible a mayúsculas
    if (titulo) {
      query.titulo = { $regex: titulo, $options: 'i' };
    }
    // Filtro por tipo: búsqueda exacta
    if (tipo) {
      query.tipo = tipo;
    }
    return await Voluntariado.find(query);
  } catch (error) {
    throw new Error(`Error al filtrar voluntariados: ${error.message}`);
  }
}

// Obtiene todos los voluntariados almacenados en la base de datos.
export async function getAllVoluntariados() {
  checkAuth(context);
  try {
    return await Voluntariado.find({});
  } catch (error) {
    throw new Error(`Error al obtener voluntariados: ${error.message}`);
  }
}

// Obtiene un voluntariado específico por su ID.
export async function getVoluntariadoById(id) {
  try {
    return await Voluntariado.findById(id);
  } catch (error) {
    throw new Error(`Error al obtener voluntariado por ID: ${error.message}`);
  }
}

// Crea un nuevo voluntariado en la base de datos.
export async function addVoluntariado(data) {
  try {
    const nuevoVoluntariado = await Voluntariado.create(data);
    return nuevoVoluntariado;
  } catch (error) {
    throw new Error(`Error al añadir voluntariado: ${error.message}`);
  }
}

// Actualiza un voluntariado existente.
export async function updateVoluntariado(id, data) {
  try {
    const updated = await Voluntariado.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    return updated;
  } catch (error) {
    throw new Error(`Error al actualizar voluntariado: ${error.message}`);
  }
}

//  Elimina un voluntariado por su ID.
export async function deleteVoluntariado(id) {
  try {
    const result = await Voluntariado.deleteOne({ _id: id });
    return result.deletedCount === 1;
  } catch (error) {
    throw new Error(`Error al eliminar voluntariado: ${error.message}`);
  }
}

// Obtiene estadísticas de los voluntariados usando agregaciones de Mongoose.
export async function getVoluntariadoStats() {
  try {
    return await Voluntariado.obtenerEstadisticas();
  } catch (error) {
    throw new Error(`Error al obtener estadísticas: ${error.message}`);
  }
  }

export async function getVoluntariadosFiltrados(filtro = {}) {
  try {
    const query = {};

    if (filtro.tipo) query.tipo = filtro.tipo;
    if (filtro.email) query.email = filtro.email;

    if (filtro.fechaInicio || filtro.fechaFin) {
      query.fecha = {};
      if (filtro.fechaInicio) query.fecha.$gte = filtro.fechaInicio; 
      if (filtro.fechaFin) query.fecha.$lte = filtro.fechaFin;       
    }

    return await Voluntariado.find(query).sort({ fecha: 1 });
  } catch (error) {
    throw new Error(`Error al filtrar voluntariados: ${error.message}`);
  }
}

