import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';

// import SubNavLink from 'Components/SubNavLink/SubNavLink';

type PathContextType = {
  fullPath: string;
}
export const PathContext: React.Context<PathContextType> = React.createContext<PathContextType>({
  fullPath: '',
});

interface OwnProps {
  children: any;
  location: Location;
  match: Match;
  className?: string;
}

interface OwnState {
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  return {
    className: ownProps.className ?? '',
  };
};
const mapDispatchToProps = {};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class SubNav extends React.Component<Props, OwnState> {
  private _renderLinks(): JSX.Element[] {
    return this.props.children.props.children.map((subNavLink: JSX.Element) => {
      return (
        <li key={subNavLink.props.to} className='sub-nav__item'>
          {subNavLink}
        </li>
      )
    })
  }

  public render(): React.ReactElement<Props> {
    return (
      <PathContext.Provider value={{ fullPath: this.props.location.pathname }}>
        <div className={`sub-nav ${this.props.className}`}>
          <ul className='sub-nav__list'>
            {this._renderLinks()}
          </ul>
        </div>
      </PathContext.Provider>
    );
  }
}

export default connector(SubNav);
