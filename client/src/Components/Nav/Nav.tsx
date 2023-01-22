import React from 'react';
import { Link } from "react-router-dom";
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { logOut, hideModal } from 'Store/actions';

import User from 'Shared/entityClasses/User';

import { VifLogoWide } from 'Components/iconComponents';
import NavLinks from './NavLinks/NavLinks';

interface OwnProps {
  modifier?: string;
}

interface OwnState {

}

const mapStateToProps = (state: IRootState) => {
  return {
    ...(state.auth.user && {user: state.auth.user})
  };
};
const mapDispatchToProps = { logOut, hideModal };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;


class Nav extends React.Component<Props, OwnState> {
  private _handleClick = (e: React.MouseEvent<HTMLUListElement>) => {
    if (e.target instanceof HTMLAnchorElement || e.target instanceof HTMLButtonElement) {
      this.props.hideModal();
    }
  }

  render(): React.ReactElement<Props> {
    const {
      modifier,
      user,
    } = this.props;

    return (
      <nav className={`nav ${modifier ? modifier : ''}`}>
        <ul onClick={this._handleClick} className="nav__list">
          <NavLinks
            logoutFunc={this.props.logOut}
            user={user}
          />
        </ul>
      </nav>
    )
  }
}

export default connector(Nav);

