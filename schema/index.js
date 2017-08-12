import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type User {
    id: Int!
    username: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    allUsers: [User!]!
    getUser(username: String!): User!
  }

  type Mutation {
    createUser(username: String!): User
    deleteUser(username: String!): Int!
  }
`);

export default schema;
