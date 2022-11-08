import React from "react";
import { connect, ConnectedProps } from "react-redux"

interface OwnProps {
}

const mapStateToProps = null;
const mapDispatchToProps = {};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class MyProfile extends React.Component<Props, {}> {
  public render(): React.ReactElement<Props> {
    return (
      <h2 className="heading-secondary">MyProfile</h2>
    );
  }
}

export default connector(MyProfile);
