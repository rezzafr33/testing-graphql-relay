import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLInt },
    username: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      allUsers: {
        type: new GraphQLList(UserType),
        resolve: async (_, args, { models }) => models.User.findAll(),
      },
      getUser: {
        type: UserType,
        args: {
          username: { type: GraphQLString },
        },
        resolve: async (_, { username }, { models }) => models.User.findOne({
          where: { username },
        }),
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
      createUser: {
        type: UserType,
        args: {
          username: { type: GraphQLString },
        },
        resolve: async (_, args, { models }) => models.User.create(args),
      },
      deleteUser: {
        type: GraphQLInt,
        args: {
          username: { type: GraphQLString },
        },
        resolve: async (_, { username }, { models }) => models.User.destroy({
          where: { username },
        }),
      },
    },
  }),
});

export default schema;
