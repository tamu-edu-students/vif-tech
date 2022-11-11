import React from "react";
import { connect } from "react-redux"

interface IMyProfileProps {

}

class MyProfile extends React.Component<IMyProfileProps, {}> {
  public render(): React.ReactElement<IMyProfileProps> {
    return (
      <h2 className="heading-secondary">MyProfile</h2>
    );
  }
}

export default connect()(MyProfile);
