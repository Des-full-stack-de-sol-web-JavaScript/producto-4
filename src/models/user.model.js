import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const userSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'], // Mensaje de error personalizado
        trim: true, // quita espacios
        minlength: [2, 'El nombre debe tener al menos 2 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true, //Normalización de datos
        //Validación avanzada con Regex
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor, introduce un email válido'
        ],
        index: true //indexación explícita
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        select: false //no se devuelve por defecto por seguridad
    },
    rol: {
        type: String,
        enum: {
            values: ['admin', 'usuario'],
            message: '{VALUE} no es un rol válido'
        },
        default: 'usuario'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//Índice compuesto (si solemos buscar por rol y nombre a la vez)
userSchema.index({ rol: 1, nombre: 1 });

// --- Middleware (Hook) PRE-SAVE ---
// Automatizamos la encriptación. Se ejecuta ANTES de guardar en la BD.
userSchema.pre('save', async function () {
    const user = this;

    if (!user.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;

    } catch (error) {
        throw new Error(error);
    }
});

export const User = mongoose.model('User', userSchema);