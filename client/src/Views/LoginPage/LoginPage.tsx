import React from 'react';
import { connect, ConnectedProps } from "react-redux";
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { authActionTypes } from 'Store/actions/types';
import { logIn } from "Store/actions";

import LoginForm from "./LoginForm/LoginForm";
import PageHeading from 'Components/PageHeading/PageHeading';


interface OwnProps {
}

interface OwnState {
}

const mapStateToProps = (state: IRootState) => {
  return {
    isLoading_logIn: createLoadingSelector([authActionTypes.LOG_IN])(state),
    errors_logIn: createErrorMessageSelector([authActionTypes.LOG_IN])(state),
  }
};
const mapDispatchToProps = { logIn };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class LoginPage extends React.Component<Props, OwnState> {
  private _onSubmit = (formValues: any) => {
    this.props.logIn(formValues);
  }

  public render(): React.ReactElement<Props> {
    const {isLoading_logIn, errors_logIn} = this.props;

    if (isLoading_logIn) {
      return <div>Logging in...</div>;
    }

    if (errors_logIn.length > 0) {
      console.error(errors_logIn);
    }

    return (
      <div className="login-page page page--login">
        <PageHeading heading="Log In" />

        <LoginForm onSubmit={this._onSubmit} form="login" />
        {
          errors_logIn.map((error: string) => (
            <div className="error" key={error}>{error}</div>
          ))
        }
      </div>
    );
  }
}

export default connector(LoginPage)
