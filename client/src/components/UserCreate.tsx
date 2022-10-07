import React from 'react';
import { connect } from "react-redux";

import { createUser } from "../actions";
import UserForm from "./UserForm";

interface IUserCreateProps {
  
}

class UserCreate extends React.Component<IUserCreateProps, {}> {
  private _onSubmit = (formProps: any) => {
    console.log('UserCreate formProps:', formProps);
  }

  public render(): React.ReactElement<IUserCreateProps> {
    return (
      <UserForm onSubmit={this._onSubmit} />
    );
  }
}

export default connect(null, { createUser })(UserCreate)
