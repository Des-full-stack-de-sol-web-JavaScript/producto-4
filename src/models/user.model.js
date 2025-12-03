import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['admin', 'usuario'],
        default: 'usuario'
    }
});


export const User = mongoose.model('User', userSchema);