import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';

import Banner from 'Components/Banner/Banner';

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
      return (
        <div className="home-page">
          <Banner modifiers={['home-page', 'hero']}>
            <h1 className="heading-primary">Welcome to the 2023 VIZ Industry Fair!</h1>
            <p className="intro-text">
              The Visualization Industry Fair is an opportunity for students interested in animation,
              gaming, graphics, and interaction design to connect with prospective employers and
              receive professional feedback on their work.
            </p>
            {/* <img src={'/images/happy-crowd-01.png'} alt="Home Banner" /> */}
          </Banner>
        </div>
      );
  }
}

export default connector(HomePage);
