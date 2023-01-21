import React from 'react';
import { Link } from 'react-router-dom';

import User from 'Shared/entityClasses/User';

import { VifLogoWide } from 'Components/iconComponents';
import { VifLogoMark } from 'Components/iconComponents';
import Nav from 'Components/Nav/Nav';

interface Props {
  user?: User;
}

interface OwnState {
  isSmallWidth: boolean;
}

class Masthead extends React.Component<Props, OwnState> {
  state = { isSmallWidth: window.matchMedia('(min-width: 1240px)').matches };

  public componentDidMount(): void {
    window.matchMedia('(max-width: 1240px)').addEventListener('change', this._setMediaState);
  }

  public componentWillUnmount(): void {
    window.matchMedia('(max-width: 1240px)').removeEventListener('change', this._setMediaState);
  }

  private _setMediaState = (e: MediaQueryListEvent) => {
    this.setState({ isSmallWidth: e.matches });
  }

  public render(): React.ReactElement<Props> {
    const { isSmallWidth } = this.state;

    return (
      <header className="masthead">
        <Link to="/" className="masthead__logo-container masthead__logo-container">
          {!isSmallWidth && <VifLogoWide className="masthead__logo masthead__logo-wide" /> }
          {isSmallWidth && <VifLogoMark className="masthead__logo masthead__logo-mark" /> }
        </Link>

        {
          !isSmallWidth &&
          <Nav user={this.props.user} />
        }
      </header>
    );
  }
}

export default Masthead
