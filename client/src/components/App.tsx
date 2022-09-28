import React from 'react';
import { Router, Route, Switch } from "react-router-dom";
import history from "../history";

import '../styles/main.scss';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router history={history}>
          <Switch>
            <Route exact path="/">
              <div>App</div>
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
