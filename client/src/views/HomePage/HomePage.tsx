import React from 'react';
import { connect } from 'react-redux';

interface IHomePageProps {
  user: User;
}

class HomePage extends React.Component<IHomePageProps, {}> {
  public render(): React.ReactElement<IHomePageProps> {
    // const { user } = this.props;
      return (
        <h1 className="heading-primary">Home Page</h1>
      );
  }
}

const mapStateToProps = (state: any) => {
  return {
    user: state.auth.user
  };
}

export default connect(mapStateToProps)(HomePage);
