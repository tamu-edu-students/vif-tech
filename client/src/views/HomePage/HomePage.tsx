import React from 'react';
import { connect } from 'react-redux';

interface IHomePageProps {
  user: any;
}

class HomePage extends React.Component<IHomePageProps, {}> {
  public render(): React.ReactElement<IHomePageProps> {
    const { user } = this.props;
    if (!user) {
      return (
        <div>Baba booey</div>
      )
    }

    return (
      <>
      <div>{user.firstname}</div>
      <div>{user.lastname}</div></>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    user: state.auth.user
  };
}

export default connect(mapStateToProps)(HomePage);
