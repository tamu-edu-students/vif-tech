import React from 'react';
import { Link } from "react-router-dom";
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';

import { PathContext } from 'Components/SubNav/SubNav';

interface OwnProps {
  to: string;
  children: any;
}

interface OwnState {
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  return {
    isCurrent: window.location.pathname === ownProps.to,
  };
};
const mapDispatchToProps = {};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class SubNavLink extends React.Component<Props, OwnState> {
  static contextType = PathContext;
  context!: React.ContextType<typeof PathContext>;

  private _matchesCurrentPath(): boolean {
    return this.context.fullPath === this.props.to;
  }

  public render(): React.ReactElement<Props> {
    const {
      to,
      children,
    } = this.props;

    return (
      <Link className={`sub-nav__link ${this._matchesCurrentPath() ? 'sub-nav__link--current' : ''}`} to={to}>{children}</Link>
    );
  }
}

export default connector(SubNavLink);
