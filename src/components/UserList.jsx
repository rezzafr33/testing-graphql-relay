import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import User from './User';
import DeleteUserMutation from '../mutations/DeleteUserMutation';

class UserList extends Component {
  constructor(props) {
    super(props);
    this.handleDeleteUser = this.handleDeleteUser.bind(this);
  }

  handleDeleteUser(id) {
    DeleteUserMutation(id);
  }

  render() {
    return (
      <ul>
        {this.props.viewer.users.edges.map(
          ({ node }) => (
            <User
              key={node.__id}
              user={node}
              handleClick={this.handleDeleteUser}
            />
          ),
        )}
      </ul>
    );
  }
}

export default createFragmentContainer(
  UserList, graphql `
    fragment UserList_viewer on UserList {
      users(last: 10) @connection(key: "UserList_users", filters: []) {
        edges {
          node {
            ...User_user
          }
        }
      }
    }
  `,
);
