import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Router, Route, Switch, Redirect, Link } from "react-router-dom";
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { authActionTypes } from 'Store/actions/types';
import { fetchLoginStatus, logOut } from 'Store/actions'
import history from 'History/history';

import { waitThen } from 'Shared/utils';

import FAQPage from 'Views/FAQPage/FAQPage';
import HomePage from 'Views/HomePage/HomePage';
import LoginPage from 'Views/LoginPage/LoginPage';
import UsersPage from 'Views/UsersPage/UsersPage';
import RegistrationPage from 'Views/RegistrationPage/RegistrationPage';
import ProfilePage from 'Views/ProfilePage/ProfilePage';
import VirtualFairSchedule from 'Views/VirtualFairSchedule/VirtualFairSchedule';
import StudentsPage from 'Views/StudentsPage/StudentsPage';

import { VifLogoMark } from 'Components/iconComponents';
import RedirectPrompt from 'Components/RedirectPrompt';
import Modal from 'Components/Modal/Modal';

import './Sass/main.scss';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import StudentDirectory from 'Views/StudentDirectory/StudentDirectory';


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
      <div className="App">
        <Router history={history}>
          <nav className="nav">
            <ul>
              <Link to="/" className="nav__logo-container"><VifLogoMark className="nav__logo" /></Link>
              <li><Link to="/students" data-testid="student-page-button">Students</Link></li>
              <li><Link to="/faq" data-testid="faq-page-button">FAQ</Link></li>
              <li><Link to="/virtual-fair-schedule" data-testid="virtual-fair-schedule-page-button">Virtual Fair Schedule</Link></li>
              {
                this.props.user
                ? (
                  <>
                    {
                      (this.props.user.isAdmin || this.props.user.isRepresentative) &&
                      <li><Link to="/student-directory" data-testid="student-directory-page-button">Student Directory</Link></li>
                    }
                    {
                      this.props.user.isAdmin &&
                      <li><Link to="/users" data-testid="users-page-button">Users</Link></li>
                    }
                    <li className="nav__name">firstname: {this.props.user.firstname}</li>
                    <li className="nav__name">lastname: {this.props.user.lastname}</li>
                    <li className="nav__profile-button"><Link to="/profile" data-testid="profile-page-button">Profile</Link></li>
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

              <Route exact path="/students">
                <StudentsPage />
              </Route>

              <Route exact path="/faq">
                <FAQPage />
              </Route>

              <Route exact path="/virtual-fair-schedule">
                <VirtualFairSchedule />
              </Route>

              <Route exact path="/users/new">
                { this.props.user
                  ? <Redirect to="/" />
                  : <RegistrationPage />
                }
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

              {
                (this.props.user?.isAdmin || this.props.user?.isRepresentative) &&
                <Route exact path="/student-directory">
                  <StudentDirectory />
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
