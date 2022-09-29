import React from 'react';
import { Router, Route, Switch } from "react-router-dom";
import history from "../history";

import { VifLogoMark } from './iconComponents';

import Redirector from './Redirector';

import '../sass/main.scss';

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
              <section className="section section--redirector">
                <Redirector
                  message={"404 Page Not Found"}
                  buttonText={"Return Home"}
                  route={"/"}
                />
              </section>
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
