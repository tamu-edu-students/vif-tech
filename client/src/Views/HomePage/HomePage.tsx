import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';

interface OwnProps {
}

const mapStateToProps = (state: IRootState) => {
  return {
    user: state.auth.user
  };
}
const mapDispatchToProps = {};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class HomePage extends React.Component<Props, {}> {
  public render(): React.ReactElement<Props> {
    // const { user } = this.props;
      return (
        <div className="home-page">
          <div className='banner-container'>
            {/* <img src={'/images/happy-crowd-01.png'} alt="Home Banner" /> */}
          </div>
        </div>
      );
  }
}

export default connector(HomePage);
