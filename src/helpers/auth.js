import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Verifica el token y recupera el usuario real de la Base de Datos.
 * Esto cumple con el requisito de "Estado de sesión mantenido en el servidor".
 */
export const getUserFromToken = async (token) => {
  if (!token) {
    console.log("AUTH DEBUG: No hay token");
    return null;
  }

  try {
    const tokenClean = token.startsWith('Bearer ') ? token.slice(7) : token;
    const payload = jwt.verify(tokenClean, JWT_SECRET);

    console.log("AUTH DEBUG Payload:", payload);

    const user = await User.findById(payload.userId);
    
    if (!user) {
        console.log("AUTH DEBUG: Usuario no encontrado en DB con ID:", payload.userId);
        return null;
    }

    console.log("AUTH DEBUG: Usuario encontrado:", user.email, "Rol:", user.rol);
    return user; 

  } catch (err) {
    console.log("AUTH DEBUG Error:", err.message);
    return null; 
  }
};