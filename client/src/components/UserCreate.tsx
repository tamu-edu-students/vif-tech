import React from 'react';
import { connect } from "react-redux";

import { createUser } from "../actions";
import UserForm from "./UserForm";

interface IUserCreateProps {
  createUser?: any;
}

class UserCreate extends React.Component<IUserCreateProps, {}> {
  private _onSubmit = (formValues: any) => {
    this.props.createUser(formValues)
  }

  public render(): React.ReactElement<IUserCreateProps> {
    return (
      <UserForm onSubmit={this._onSubmit} />
    );
  }
}

export default connect(null, { createUser })(UserCreate)
