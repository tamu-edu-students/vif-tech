import React from 'react';
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';

import CustomForm from '../../../components/CustomForm/CustomForm';

interface ILoginFormProps {
  onSubmit?: any;
}

class LoginForm extends CustomForm<ILoginFormProps> {
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

const validate = ({username, email, password, password_confirmation}: any) => {
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
  form: "login",
  validate: validate,
})(LoginForm);

export default connect()(formWrapped);
