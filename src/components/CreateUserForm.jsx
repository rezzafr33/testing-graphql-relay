import React, { Component } from 'react';
import CreateUserMutation from '../mutations/CreateUserMutation';

class CreateUserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };

    this.onTextChange = this.onTextChange.bind(this);
    this.submitUser = this.submitUser.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  onTextChange(event) {
    this.setState({ username: event.target.value });
  }

  onKeyPress(event) {
    if (event.key === 'Enter') {
      this.submitUser();
    }
  }

  submitUser() {
    const { username } = this.state;
    if (username.length > 0) {
      CreateUserMutation(username, () => {
        this.userInput.value = '';
        this.props.history.push('/');
      });
    }
  }

  render() {
    return (
      <div>
        <input
          type="text"
          ref={(input) => { this.userInput = input; }}
          onKeyPress={this.onKeyPress}
          onChange={this.onTextChange}
        />
        <button
          type="button"
          onClick={this.submitUser}
        >Create</button>

      </div>
    );
  }
}

export default CreateUserForm;
