import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../../store/reducers';

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
        <h1 className="heading-primary">Home Page</h1>
      );
  }
}

export default connector(HomePage);
