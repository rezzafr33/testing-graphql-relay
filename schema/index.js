import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';

import {
  nodeDefinitions,
  fromGlobalId,
  globalIdField,
  connectionDefinitions,
  connectionArgs,
  connectionFromPromisedArray,
  mutationWithClientMutationId,
} from 'graphql-relay';

const globalIdFetcher = (globalId, { models }) => {
  const { type, id } = fromGlobalId(globalId);
  switch (type) {
    case 'UserList':
      return userList;
    case 'User':
      return models.User.findOne({ where: { id } });
    default:
      return null;
  }
};

const globalTypeResolver = obj => obj.type || UserType;

const { nodeInterface, nodeField } = nodeDefinitions(
  globalIdFetcher,
  globalTypeResolver,
);

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    username: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
  interfaces: [nodeInterface],
});

const { connectionType: UserConnectionType } = connectionDefinitions({
  name: 'User',
  nodeType: UserType,
});

const UserListType = new GraphQLObjectType({
  name: 'UserList',
  fields: {
    id: globalIdField('UserList'),
    userConnection: {
      type: UserConnectionType,
      args: connectionArgs,
      resolve: async (_, args, { models }) => connectionFromPromisedArray(
        models.User.findAll(),
        args,
      ),
    },
  },
  interfaces: [nodeInterface],
});

const userList = { type: UserListType };

const queryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    node: nodeField,
    userList: {
      type: UserListType,
      resolve: () => userList,
    },
  },
});

const createUserMutation = mutationWithClientMutationId({
  name: 'CreateUser',
  inputFields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: UserType,
      resolve: obj => obj,
    },
  },
  mutateAndGetPayload: async (params, { models }) => models.User.create(params),
});

const deleteUserMutation = mutationWithClientMutationId({
  name: 'deleteUser',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    deletedUserCount: {
      type: GraphQLInt,
      resolve: obj => obj.data,
    },
  },
  mutateAndGetPayload: async ({ userId }, { models }) => {
    const { id } = fromGlobalId(userId);
    const data = await models.User.destroy({ where: { id } });
    return { data };
  },
});

const mutationType = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    createUser: createUserMutation,
    deleteUser: deleteUserMutation,
  },
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

export default schema;
