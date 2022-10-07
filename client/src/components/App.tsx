import React from 'react';
import { Router, Route, Switch, Redirect, Link } from "react-router-dom";
import history from "../history";

import { VifLogoMark } from './iconComponents';

import RedirectPrompt from './RedirectPrompt';
import Users from './Users';
import UserCreate from './UserCreate';
import UserForm from './UserForm';

import '../sass/main.scss';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router history={history}>
          <Link to="/users/new" className="register-button">Register!</Link>
          <Switch>
            <Route exact path="/">
              <Redirect to="/under-construction" />
            </Route>

            <Route exact path="/under-construction">
              <section className="section section--redirector">
                <RedirectPrompt
                  message={"is under construction"}
                  buttonText={"Portfolio Review Signup"}
                  href={"https://linktr.ee/vizindustryfair"}
                />
              </section>
            </Route>

            <Route exact path="/users">
              <Users />
            </Route>

            <Route exact path="/users/new">
              <UserCreate />
            </Route>

            <Route exact path="/users/new/success">
              <section className="section section--redirector">
                <RedirectPrompt
                  message={"Almost done. Click the verification link sent to your email to complete your registration."}
                  buttonText={"Return Home"}
                  pathName={"/"}
                />
              </section>
            </Route>
            
            <Route path="*" status={404}>
              <section className="section section--redirector">
                <RedirectPrompt
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
