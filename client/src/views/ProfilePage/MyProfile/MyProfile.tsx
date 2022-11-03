import React from "react";
import { connect } from "react-redux"

interface IMyProfileProps {

}

class MyProfile extends React.Component<IMyProfileProps, {}> {
  public render(): React.ReactElement<IMyProfileProps> {
    return (
      <div>MyProfile</div>
    );
  }
}

export default connect()(MyProfile);
