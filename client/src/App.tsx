import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { authActionTypes } from 'Store/actions/types';
import { fetchLoginStatus, logOut } from 'Store/actions'
import history from 'History/history';

import { waitThen } from 'Shared/utils';

import Nav from 'Components/Nav/Nav';
import FAQPage from 'Views/FAQPage/FAQPage';
import HomePage from 'Views/HomePage/HomePage';
import LoginPage from 'Views/LoginPage/LoginPage';
import UsersPage from 'Views/UsersPage/UsersPage';
import SettingsPage from 'Views/SettingsPage/SettingsPage';
import SignupPage from 'Views/SignupPage/SignupPage';
import ProfilePage from 'Views/ProfilePage/ProfilePage';
import VirtualFairSchedule from 'Views/VirtualFairSchedule/VirtualFairSchedule';
import CompaniesPage from 'Views/CompaniesPage/CompaniesPage';
import StudentsPage from 'Views/StudentsPage/StudentsPage';
import MyEventsPage from 'Views/MyEventsPage/MyEventsPage';
import SchedulingPage from 'Views/SchedulingPage/SchedulingPage';

import RedirectPrompt from 'Components/RedirectPrompt';
import Modal from 'Components/Modal/Modal';

import './Sass/main.scss';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


interface OwnProps {
}

const mapStateToProps = (state: IRootState) => {
  return {
    user: state.auth.user,
    isLoggedIn: state.auth.isLoggedIn,
    shouldShowModal: state.modal.shouldRender,

    loginStatusIsStale: state.auth.isStale,
    isLoading_fetchLoginStatus: createLoadingSelector([authActionTypes.FETCH_LOGIN_STATUS])(state),
    errors_fetchLoginStatus: createErrorMessageSelector([authActionTypes.FETCH_LOGIN_STATUS])(state),
  };
}
const mapDispatchToProps = { fetchLoginStatus, logOut };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class App extends React.Component<Props, {}> {
  componentDidMount(): void {
    if ((window as any).Cypress) {
      waitThen(150, () => this.props.fetchLoginStatus());
    }
    else {
      this.props.fetchLoginStatus();
    }
  }

  render(): React.ReactElement<Props> {
    if (this.props.isLoggedIn === null || this.props.isLoading_fetchLoginStatus) {
      return (
        <div>Checking login status...</div>
      );
    }

    if (this.props.errors_fetchLoginStatus.length > 0) {
      this.props.errors_fetchLoginStatus.forEach((error: string) => console.error(error));
      // return (
      //   <div>{this.props.errors_fetchLoginStatus}</div>
      // );
    }

    return (
      <div className="app">
        <Router history={history}>
          <Nav
            {...(this.props.user ? {user: this.props.user} : {})}
            isLoggedIn={this.props.isLoggedIn}
          />

          <main className="main">
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

              {
                this.props.user?.isAdmin &&
                <Route exact path="/users">
                  <UsersPage />
                </Route>
              }

              <Route exact path="/companies">
                <CompaniesPage />
              </Route>

              <Route exact path="/faq">
                <FAQPage />
              </Route>

              <Route exact path="/virtual-fair-schedule">
                <VirtualFairSchedule />
              </Route>

              <Route
                path={"/my-events"}
                render={ (routeProps: any) => {
                  return (
                    this.props.user && !this.props.user.isAdmin
                    ? <MyEventsPage {...routeProps} />
                    : <Redirect to={'/login'} /> //TODO: Handle My Events path if admin
                  )
                } }
              />

              <Route
                path={"/scheduling"}
                render={ (routeProps: any) => {
                  return (
                    this.props.user?.isAdmin
                    ? <SchedulingPage {...routeProps} />
                    : <Redirect to={'/login'} /> //TODO: Handle My Events path if admin
                  )
                } }
              />

              <Route exact path="/signup">
                { this.props.user
                  ? <Redirect to="/" />
                  : <SignupPage />
                }
              </Route>

              <Route exact path="/signup/success">
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

              {
                (this.props.user?.isAdmin || this.props.user?.isRepresentative) &&
                <Route exact path="/students">
                  <StudentsPage />
                </Route>
              }

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

              <Route
                path={"/settings"}
                render={ (routeProps: any) => {
                  return (
                    this.props.user
                    ? <SettingsPage {...routeProps} />
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
          </main>

          <footer className="footer"></footer>

          {
            this.props.shouldShowModal && <Modal />
          }
        </Router>
      </div>
    );
  }
}

export default connector(App);
