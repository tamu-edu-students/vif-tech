import React from 'react';
import { connect, ConnectedProps } from "react-redux";
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { authActionTypes } from 'Store/actions/types';
import { logIn } from "Store/actions";

import LoginForm from "./LoginForm/LoginForm";


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
      <section className="section section--login">
        <h1 className="heading-primary">Login</h1>
        <LoginForm onSubmit={this._onSubmit} form="login" />
        {
          errors_logIn.map((error: string) => (
            <div className="error" key={error}>{error}</div>
          ))
        }
      </section>
    );
  }
}

export default connector(LoginPage)
