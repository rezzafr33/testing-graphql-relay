import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import User from './User';

class UserList extends Component {
  render() {
    return (
      <ul>
        {this.props.userList.userConnection.edges.map(
          ({ node }) => <User key={node.__id} user={node} />,
        )}
      </ul>
    );
  }
}

export default createFragmentContainer(
  UserList, graphql `
    fragment UserList_userList on UserList {
      userConnection(last: 10) @connection(key: "UserList_userConnection", filters: []) {
        edges {
          node {
            ...User_user
          }
        }
      }
    }
  `,
);
