import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

class User extends Component {
  render() {
    return (
      <li>{this.props.user.username}</li>
    );
  }
}

export default createFragmentContainer(
  User, graphql `
    fragment User_user on User {
      id
      username
    }
  `,
);
