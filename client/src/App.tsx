import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, Switch, Redirect, Link } from "react-router-dom";
import history from "./history";

import './sass/main.scss';

import HomePage from './views/HomePage/HomePage';
import LoginPage from './views/LoginPage/LoginPage';
import RedirectPrompt from './components/RedirectPrompt';
import Users from './components/Users';
import UserCreate from './components/UserCreate';

import { fetchLoginStatus } from './store/actions'

interface IAppProps {
  fetchLoginStatus?: any;
  user: any;
}

class App extends React.Component<IAppProps, {}> {
  // componentDidMount(): void {
  //   this.props.fetchLoginStatus();
  // }

  render() {
    // console.log(this.props.user)
    return (
      <div className="App">
        <Router history={history}>
          <Link to="/users/new" className="register-button">Register!</Link>
          <Switch>
            <Route exact path="/">
              <HomePage />
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

            <Route exact path={["/login", "/login/success"]}>
              { this.props.user
                ? <Redirect to="/" />
                : <LoginPage />
              }
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

const mapStateToProps = (state: any) => {
  return {
    user: state.auth.user
  };
}

export default connect(mapStateToProps, {fetchLoginStatus})(App);
