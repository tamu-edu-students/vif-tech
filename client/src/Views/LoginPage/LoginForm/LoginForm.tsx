import React from 'react';
import { Field, reduxForm } from "redux-form";
import { connect, ConnectedProps } from 'react-redux';

import CustomForm from 'Components/CustomForm/CustomForm';


interface OwnProps {
  onSubmit?: any;
}

const mapStateToProps = null;
const mapDispatchToProps = {};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class LoginForm extends CustomForm<Props, {}> {
  private _onSubmit = (formValues: any) => {
    this.props.onSubmit(formValues);
  }
 
  public render() {
    return (
      <form data-testid="login-form" onSubmit={this.props.handleSubmit(this._onSubmit)}>
        <Field name="email" id="email" type="text" component={this._renderInput} label="Email" />
        <Field name="password" id="password" type="password" component={this._renderInput} label="Password" />
        <button type='submit' data-testid="log-in-form-button">Log In</button>
      </form>
    );
  }
}

const validate = ({email, password}: any) => {
  const errors: any = {};

  if (!email) {
    errors.email = "You must enter an email address";
  }

  if (!password) {
    errors.password = "You must enter a password";
  }

  return errors;
};

const formWrapped = reduxForm({
  validate: validate,
})(LoginForm);

export default connector(formWrapped);
