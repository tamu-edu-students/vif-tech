import React from 'react';
import { connect, ConnectedProps } from "react-redux";

import { createUser } from "../store/actions";
import UserForm from "./UserForm/UserForm";

interface OwnProps {
}

const mapStateToProps = null;
const mapDispatchToProps = { createUser };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class UserCreate extends React.Component<Props, {}> {
  private _onSubmit = (formValues: any) => {
    this.props.createUser(formValues)
    .catch((err: Error) => {
      console.error(err.message);
    });
  }

  public render(): React.ReactElement<Props> {
    return (
      <UserForm form="userCreate" onSubmit={this._onSubmit} />
    );
  }
}

export default connector(UserCreate);
