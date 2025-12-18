import mongoose from 'mongoose';

const { Schema } = mongoose;

const voluntariadoSchema = new Schema({
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        maxlength: [100, 'El título no puede exceder los 100 caracteres'],
        index: true //título indexado para búsquedas rápidas
    },
    email: {
        type: String,
        required: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Email de contacto inválido'
        ]
    },
    fecha: {
        type: String,
        required: true,
        //Validación personalizada
        validate: {
            validator: function (v) {
                return !isNaN(Date.parse(v));
            },
            message: props => `${props.value} no es una fecha válida!`
        }
    },
    descripcion: {
        type: String,
        maxlength: 500
    },
    tipo: {
        type: String,
        required: true,
        enum: ['Oferta', 'Petición'],
        message: '{VALUE} no es un tipo válido. Solo se acepta Oferta o Petición.'
    }
}, {
    //Opciones avanzadas de esquema
    timestamps: true // Crea automáticamente createdAt y updatedAt
});

//Índice para filtrar rápidamente por tipo y fecha
voluntariadoSchema.index({ tipo: 1, fecha: -1 });

// --- Método Estático con AGREGACIÓN ---
// Calcula cuántos voluntariados hay por cada tipo automáticamente.
voluntariadoSchema.statics.obtenerEstadisticas = async function () {
    return await this.aggregate([
        {
            $group: {
                _id: '$tipo',
                cantidad: { $sum: 1 }
            }
        },
        {
            $sort: { cantidad: -1 }
        }
    ]);
};

export const Voluntariado = mongoose.model('Voluntariado', voluntariadoSchema);