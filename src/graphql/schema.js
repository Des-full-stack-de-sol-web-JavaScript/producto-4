import { gql } from 'graphql-tag';

export const typeDefs = gql`
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

  type AuthPayload {
    token: String!
    user: User!
  }
    
  type Estadistica {
    _id: String!
    cantidad: Int!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    voluntariados(titulo: String, tipo: String): [Voluntariado!]!
    voluntariado(id: ID!): Voluntariado
    statsVoluntariados: [Estadistica!]!
  }

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

  # --- PARTE PARA WEBSOCKETS ---
  type Subscription {
    voluntariadoCreado: Voluntariado!
  }
`;