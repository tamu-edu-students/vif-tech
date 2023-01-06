import React from 'react';
import { connect, ConnectedProps } from "react-redux";
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { userActionTypes } from 'Store/actions/types';

import { createUser } from "Store/actions";
import SignupForm from "Views/SignupPage/SignupForm/SignupForm";

interface OwnProps {
}

const mapStateToProps = (state: IRootState) => {
  return {
    isLoading_createUser: createLoadingSelector([userActionTypes.CREATE_USER])(state),
    errors_createUser: createErrorMessageSelector([userActionTypes.CREATE_USER])(state),
  }
};
const mapDispatchToProps = { createUser };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class SignupPage extends React.Component<Props, {}> {
  private _onSubmit = (formValues: any) => {
    this.props.createUser(formValues);
  }

  public render(): React.ReactElement<Props> {
    if (this.props.isLoading_createUser) {
      return (
        <div>Creating user...</div>
      )
    }

    if (this.props.errors_createUser.length > 0) {
      this.props.errors_createUser.forEach((error: string) => console.error(error));
    }

    return (
      <div className="signup-page page page--signup">
        <h1 className="heading-primary">Sign Up</h1>
        <SignupForm form="userCreate" onSubmit={this._onSubmit} />
      </div>
    );
  }
}

export default connector(SignupPage);
