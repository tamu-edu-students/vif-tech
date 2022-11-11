import React from 'react';
import { connect, ConnectedProps } from "react-redux";

import { createUser } from "Store/actions";
import UserForm from "Views/RegistrationPage/UserForm/UserForm";

interface OwnProps {
}

const mapStateToProps = null;
const mapDispatchToProps = { createUser };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class RegistrationPage extends React.Component<Props, {}> {
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

export default connector(RegistrationPage);
