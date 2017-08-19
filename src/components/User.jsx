import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

class User extends Component {
  render() {
    return (
      <li>
        <span>{this.props.user.username}</span>
        <button
          onClick={() => { this.props.handleClick(this.props.user.id) }}
        >delete</button>
      </li>
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
