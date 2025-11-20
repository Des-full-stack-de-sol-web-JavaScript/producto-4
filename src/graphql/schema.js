import { gql } from 'apollo-server-express';

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


  type Query {
    users: [User!]!
    user(id: ID!): User

    voluntariados: [Voluntariado!]!
    voluntariado(id: ID!): Voluntariado
  }

  type Mutation {
    registrarUsuario(nombre: String!, email: String!, password: String!): User
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
