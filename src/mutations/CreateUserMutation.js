import {
  commitMutation,
  graphql,
} from 'react-relay';
import environment from '../Environment';

const mutation = graphql `
  mutation CreateUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        id
        username
        createdAt
        updatedAt
      }
    }
  }
`;

export default (username, callback) => {
  const variables = {
    input: {
      username,
      clientMutationId: '',
    },
  };

  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted: () => {
        callback();
      },
      onError: err => console.error(err),
    },
  );
};
