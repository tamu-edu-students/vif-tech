import React from 'react';
import { Router, Route, Switch } from "react-router-dom";
import history from "../history";

import { VifLogoMark } from './iconComponents';

import '../styles/main.scss';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router history={history}>
          <Switch>
            <Route exact path="/">
              <div>App</div>
              <VifLogoMark className="logo-mark" />
            </Route>
            <Route path="*" status={404}>
              404
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
