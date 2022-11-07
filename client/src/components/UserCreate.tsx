import React from 'react';
import { connect } from "react-redux";

import { createUser } from "../store/actions";
import UserForm from "./UserForm/UserForm";

interface IUserCreateProps {
  createUser?: any;
}

class UserCreate extends React.Component<IUserCreateProps, {}> {
  private _onSubmit = (formValues: any) => {
    this.props.createUser(formValues)
    .catch((err: Error) => {
      console.error(err.message);
    });
  }

  public render(): React.ReactElement<IUserCreateProps> {
    return (
      <UserForm form="userCreate" onSubmit={this._onSubmit} />
    );
  }
}

export default connect(null, { createUser })(UserCreate)
