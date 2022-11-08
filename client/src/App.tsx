import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Router, Route, Switch, Redirect, Link } from "react-router-dom";
import history from "./history";

import './sass/main.scss';

import HomePage from './views/HomePage/HomePage';
import LoginPage from './views/LoginPage/LoginPage';
import RedirectPrompt from './components/RedirectPrompt';
import Users from './components/Users';
import UserCreate from './components/UserCreate';
import Modal from './components/Modal/Modal';

import { fetchLoginStatus, logOut } from './store/actions'
import ProfilePage from './views/ProfilePage/ProfilePage';
import { IRootState } from './store/reducers';

interface OwnProps {
}

const mapStateToProps = (state: IRootState) => {
  return {
    user: state.auth.user,
    isLoggedIn: state.auth.isLoggedIn,
    shouldShowModal: state.modal.shouldRender,
  };
}
const mapDispatchToProps = { fetchLoginStatus, logOut };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class App extends React.Component<Props, {}> {
  componentDidMount(): void {
      this.props.fetchLoginStatus();
  }

  render(): React.ReactElement<Props> {
    if (this.props.isLoggedIn === null) {
      return (
        <div>Checking login status...</div>
      );
    }

    return (
      <div className="App">
        <Router history={history}>
          <nav className="nav">
            <ul>
              {
                this.props.user
                ? (
                  <>
                    <li>firstname: {this.props.user.firstname}</li>
                    <li>lastname: {this.props.user.lastname}</li>
                    <li><Link to="/profile" data-testid="profile-page-button">Profile</Link></li>
                    <li><button onClick={this.props.logOut} data-testid="log-out-button">Log Out</button></li>
                  </>
                )
                : (
                  <>
                    <li><Link to="/login" data-testid="log-in-page-button">Log In</Link></li>
                    <li><Link to="/users/new" className="register-button" data-testid="sign-up-page-button">Register!</Link></li>
                  </>
                )
              }
            </ul>
          </nav>

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

            <Route
              path={"/profile"}
              render={ (routeProps: any) => {
                return (
                  this.props.user
                  ? <ProfilePage {...routeProps} />
                  : <Redirect to={'/login'} />
                )
              } }
            />
            
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

          {
            this.props.shouldShowModal && <Modal />
          }
        </Router>
      </div>
    );
  }
}

export default connector(App);
