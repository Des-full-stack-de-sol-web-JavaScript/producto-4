import { gql } from 'graphql-tag';

/**
 * Definición del esquema GraphQL (typeDefs).
 * 
 * Aquí se describen:
 * - Tipos (Type)
 * - Consultas (Query)
 * - Mutaciones (Mutation)
 * - Inputs
 * 
 * Este esquema será cargado por Apollo Server para generar
 * el endpoint /graphql.
 */
export const typeDefs = gql`
  # Input para filtrar voluntariados
  input FiltroVoluntariado {
    tipo: String
    email: String
    fechaInicio: String
    fechaFin: String
  }

  type User {
    _id: ID!
    nombre: String!
    email: String!
    password: String
    rol: String
  }

  type Voluntariado {
    _id: ID!
    titulo: String!
    email: String!
    fecha: String!
    descripcion: String
    tipo: String
  }
  # Nuevo tipo para la respuesta de autenticación: token y datos del usuario
  type AuthPayload {
    token: String!
    user: User!
  }
    
  # Nuevo tipo para el resultado de la agregación
  type Estadistica {
    _id: String!  # El nombre del tipo (ej: "Presencial")
    cantidad: Int!
  }

  # Consultas permitidas
  type Query {
    users: [User!]!
    user(id: ID!): User

    voluntariados(filtro: FiltroVoluntariado): [Voluntariado!]!
    voluntariado(id: ID!): Voluntariado
  
    statsVoluntariados: [Estadistica!]!
  }

  # Operaciones de escritura
  type Mutation {
    registrarUsuario(nombre: String!, email: String!, password: String!): User
    login(email: String!, password: String!): AuthPayload!
    addUser(nombre: String!, email: String!, password: String!): User
    deleteUser(id: ID!): Boolean

    addVoluntariado(
      titulo: String!
      email: String!
      fecha: String!
      descripcion: String
      tipo: String
    ): Voluntariado

    updateVoluntariado(
      id: ID!
      titulo: String
      email: String
      fecha: String
      descripcion: String
      tipo: String
    ): Voluntariado

    deleteVoluntariado(id: ID!): Boolean
  }
`;
