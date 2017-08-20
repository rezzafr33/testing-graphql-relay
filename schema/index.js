import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
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

import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const USER_CREATED = 'USER_CREATED';

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
    users: {
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
    viewer: {
      type: UserListType,
      resolve: () => userList,
    },
  },
});

const subscriptionType = new GraphQLObjectType({
  name: 'RootSubscription',
  fields: {
    userCreated: {
      type: UserType,
      subscribe: () => pubsub.asyncIterator(USER_CREATED),
      resolve: obj => obj,
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
  mutateAndGetPayload: async (params, { models }) => models.User.create(params)
    .then((user) => {
      pubsub.publish(USER_CREATED, user);
      return user;
    }),
});

const deleteUserMutation = mutationWithClientMutationId({
  name: 'DeleteUser',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedUserId: {
      type: GraphQLID,
      resolve: ({ id }) => id,
    },
    viewer: {
      type: UserListType,
      resolve: () => userList,
    },
  },
  mutateAndGetPayload: async ({ userId }, { models }) => {
    const { id } = fromGlobalId(userId);
    return models.User.destroy({ where: { id } })
      .then(() => ({ id: userId }));
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
  subscription: subscriptionType,
});

export default schema;
