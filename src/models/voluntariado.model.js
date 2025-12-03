import mongoose from 'mongoose';

const { Schema } = mongoose;

const voluntariadoSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    fecha: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    tipo: {
        type: String,
        enum: ['Presencial', 'Remoto', 'Híbrido', 'Oferta', 'Petición', 'Voluntariado', 'Intercambio', 'Compartir', 'Otras', 'Servicios', 'Deportes', 'Ventas'] // Añade aquí las categorías que usaste en tu seed
    }
});

export const Voluntariado = mongoose.model('Voluntariado', voluntariadoSchema);