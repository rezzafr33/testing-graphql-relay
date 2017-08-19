import {
  commitMutation,
  graphql,
} from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import environment from '../Environment';

const mutation = graphql `
  mutation DeleteUserMutation($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      deletedUserId
      viewer{
        users {
          edges {
            node {
              id
              username
            }
          }
        }
      }
    }
  }
`;

const sharedUpdater = (store, userId) => {
  const userProxy = store.get(
    store.getRoot('deleteUser')
      .getLinkedRecord('viewer')
      .getDataID(),
  );

  const conn = ConnectionHandler.getConnection(
    userProxy,
    'UserList_users',
  );

  ConnectionHandler.deleteNode(conn, userId);
};

export default (userId) => {
  const variables = {
    input: {
      userId,
      clientMutationId: '',
    },
  };

  commitMutation(
    environment,
    {
      mutation,
      variables,
      onError: err => console.error(err),
      optimisticUpdater: (store) => {
        sharedUpdater(store, userId);
      },
      updater: (store) => {
        const payload = store.getRootField('deleteUser');
        sharedUpdater(store, payload.getValue('deletedUserId'));
      },
    },
  );
};
