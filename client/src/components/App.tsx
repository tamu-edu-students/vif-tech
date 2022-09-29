import React from 'react';
import { Router, Route, Switch, Redirect } from "react-router-dom";
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
              <Redirect to="/under-construction" />
            </Route>

            <Route path="/under-construction" status={404}>
              <section className="section section--redirector">
                <Redirector
                  message={"is under construction"}
                  buttonText={"Portfolio Review Signup"}
                  href={"https://linktr.ee/vizindustryfair"}
                />
              </section>
            </Route>
            
            <Route path="*" status={404}>
              <section className="section section--redirector">
                <Redirector
                  message={"404 Page Not Found"}
                  buttonText={"Return Home"}
                  pathName={"/"}
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
