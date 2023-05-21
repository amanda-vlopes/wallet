import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import Login from './pages/Login';
import Wallet from './pages/Wallet';

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={ Login } />
          <Route exact path="/carteira" component={ Wallet } />
        </Switch>
      </div>
    );
  }
}

export default App;
