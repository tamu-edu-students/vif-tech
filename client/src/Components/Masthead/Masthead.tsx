import React from 'react';
import { Link } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { showModal, hideModal } from 'Store/actions';

import User from 'Shared/entityClasses/User';

import { VifLogoWide } from 'Components/iconComponents';
import { VifLogoMark } from 'Components/iconComponents';
import Nav from 'Components/Nav/Nav';
import Hamburger from './Hamburger/Hamburger';

interface OwnProps {
  user?: User;
}

interface OwnState {
  isSmallWidth: boolean;
  modalNavIsOpen: boolean;
}

const mapStateToProps = (state: IRootState) => {
  return { modalIsShowing: state.modal.shouldRender };
};
const mapDispatchToProps = { showModal, hideModal };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class Masthead extends React.Component<Props, OwnState> {
  state = {
    isSmallWidth: window.matchMedia('(max-width: 1240px)').matches,
    modalNavIsOpen: false
  };

  public componentDidMount(): void {
    window.matchMedia('(max-width: 1240px)').addEventListener('change', this._setMediaState);
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<OwnState>, snapshot?: any): void {
    if (!this.state.isSmallWidth && this.state.modalNavIsOpen)  {
      this.props.hideModal();
    }
  }

  public componentWillUnmount(): void {
    window.matchMedia('(max-width: 1240px)').removeEventListener('change', this._setMediaState);
  }

  private _setMediaState = (e: MediaQueryListEvent) => {
    this.setState({ isSmallWidth: e.matches });
  }

  private _renderModalNav = (): void => {
    this.props.showModal(
      <Nav modifier="modal" />,
      {
        onDismiss: () => this.setState({modalNavIsOpen: false}),
        onShow: () => this.setState({modalNavIsOpen: true}),
      }
    )
  }

  public render(): React.ReactElement<Props> {
    const { isSmallWidth } = this.state;

    return (
      <header className="masthead">
        <Link to="/" className={`masthead__logo-container ${ isSmallWidth ? 'masthead__logo-container--push-right' : ''}`}>
          {!isSmallWidth && <VifLogoWide className="masthead__logo masthead__logo-wide" /> }
          {isSmallWidth && <VifLogoMark className="masthead__logo masthead__logo-mark" /> }
        </Link>

        {
          !isSmallWidth &&
          <Nav />
        }

        {
          (isSmallWidth && !this.props.modalIsShowing) &&
          <Hamburger
            onClick={this._renderModalNav}
          />
        }
      </header>
    );
  }
}

export default connector(Masthead);
