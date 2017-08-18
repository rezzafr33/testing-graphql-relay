import React, { Component } from 'react';
import {
  QueryRenderer,
  graphql,
} from 'react-relay';

import environment from '../Environment';
import UserList from './UserList';

const UserListPageQuery = graphql `
  query UserListPageQuery {
    userList {
      ...UserList_userList
    }
  }
`;

class UserListPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={UserListPageQuery}
        render={({ error, props }) => {
          if (error) {
            return <div>{error.message}</div>;
          } else if (props) {
            return <UserList userList={props.userList} />;
          }
          return <div>Loading</div>;
        }}
      />
    );
  }
}

export default UserListPage;