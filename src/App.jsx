import React, { Component } from 'react';
import {
  Route,
  Switch,
} from 'react-router';
import Header from './components/Header';
import CreateUserForm from './components/CreateUserForm';
import UserListPage from './components/UserListPage';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={UserListPage} />
          <Route exact path="/create" component={CreateUserForm} />
        </Switch>
      </div>
    );
  }
}

export default App;
