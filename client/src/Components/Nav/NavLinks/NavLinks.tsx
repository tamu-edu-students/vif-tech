import React from 'react';
import { Link } from 'react-router-dom';

import User from 'Shared/entityClasses/User';

interface Props {
  user?: User;
  logoutFunc: any;
}

interface OwnState {

}

class NavLinks extends React.Component<Props, OwnState> {
  render(): React.ReactElement<Props> {
    const {
      user,
      logoutFunc,
    } = this.props;

    return (
      <>
        <li className="nav__item"><Link className="nav__link" to="/companies" data-testid="companies-page-button">Companies</Link></li>
        <li className="nav__item"><Link className="nav__link" to="/faq" data-testid="faq-page-button">FAQ</Link></li>
        <li className="nav__item"><Link className="nav__link" to="/virtual-fair-schedule" data-testid="virtual-fair-schedule-page-button">Virtual Fair Schedule</Link></li>
        {
          user
          ? (
            <>
              {
                (user.isAdmin || user.isRepresentative) &&
                <li className="nav__item"><Link className="nav__link" to="/students" data-testid="students-page-button">Students</Link></li>
              }
              {
                user.isAdmin &&
                <li className="nav__item"><Link className="nav__link" to="/users" data-testid="users-page-button">Users</Link></li>
              }
              {
                !user.isAdmin &&
                <li className="nav__item"><Link className="nav__link" to="/my-events" data-testid="my-events-page-button">My Events</Link></li>
              }
              {
                user.isAdmin &&
                <li className="nav__item"><Link className="nav__link" to="/scheduling" data-testid="scheduling-page-button">Scheduling</Link></li>
              }
              <li className="nav__item nav__item--push-left"><Link className="nav__button nav__button--profile" to="/profile" data-testid="profile-page-button">Profile</Link></li>
              <li className="nav__item"><Link className="nav__button nav__button--settings" to="/settings" data-testid="settings-page-button">Settings</Link></li>
              <li className="nav__item"><button className="nav__button nav__button--logout" onClick={logoutFunc} data-testid="log-out-button">Log Out</button></li>
            </>
          )
          : (
            <>
              <li className="nav__item nav__item--push-left"><Link className="nav__button nav__button--login" to="/login" data-testid="log-in-page-button">Log In</Link></li>
              <li className="nav__item"><Link className="nav__button nav__button--register" to="/signup" data-testid="sign-up-page-button">Sign Up</Link></li>
            </>
          )
        }
      </>
    )
  }
}

export default NavLinks;
