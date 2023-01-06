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
  public render(): React.ReactElement<Props> {
    return (
      <PathContext.Provider value={{ fullPath: this.props.location.pathname }}>
        <div className={`sub-nav ${this.props.className}`}>
          <ul className='sub-nav__list'>
            {this.props.children}
          </ul>
        </div>
      </PathContext.Provider>
    );
  }
}

export default connector(SubNav);
