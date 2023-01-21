import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from "react-router-dom";
import { logOut } from 'Store/actions';

import User from 'Shared/entityClasses/User';

import { VifLogoWide } from 'Components/iconComponents';
import NavLinks from './NavLinks/NavLinks';

interface OwnProps {
  user?: User;
  className?: string;
}

interface OwnState {

}

const mapStateToProps = null;
const mapDispatchToProps = { logOut };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;


class Nav extends React.Component<Props, OwnState> {
  render(): React.ReactElement<Props> {
    const {
      user,
      className,
    } = this.props;

    return (
      <nav className={`nav nav--desktop ${className ? className : ''}`}>
        <ul className="nav__list">
          <NavLinks
            user={user}
            logoutFunc={this.props.logOut}
          />
        </ul>
      </nav>
    )
  }
}

export default connector(Nav);

