import { gql } from 'graphql-tag';

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
<<<<<<< HEAD
    voluntariados(titulo: String, tipo: String): [Voluntariado!]!
    voluntariado(id: ID!): Voluntariado
=======

    voluntariados(filtro: FiltroVoluntariado): [Voluntariado!]!
    voluntariado(id: ID!): Voluntariado
  
>>>>>>> 464865c1fcebec28d58c95c2ad434c70e5537833
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