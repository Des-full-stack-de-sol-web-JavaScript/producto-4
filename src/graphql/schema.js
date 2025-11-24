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
  type User {
    _id: ID!
    nombre: String!
    email: String!
    password: String!
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

  # Consultas permitidas
  type Query {
    users: [User!]!
    user(id: ID!): User

    voluntariados: [Voluntariado!]!
    voluntariado(id: ID!): Voluntariado
  }

  # Operaciones de escritura
  type Mutation {
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
