import React from 'react';
import { Field, reduxForm, InjectedFormProps } from "redux-form";
import { connect } from 'react-redux';

interface ILoginFormProps {
  onSubmit?: any;
}

class LoginForm extends React.Component<InjectedFormProps & ILoginFormProps, {}> {
  private _renderInput = ({ input, label, meta, id }: any) => {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;
    return (
      <div className={className}>
        <label htmlFor={id}>{label}</label>
        <input {...input} id={id} autoComplete="off" />
        {this._renderError(meta)}
      </div>
    );
  }

  private _renderError({ error, touched }: any) {
    if (touched && error) {
      return (
        <div className="error-text">
          <div>{error}</div>
        </div>
      );
    }
  }

  private _onSubmit = (formValues: any) => {
    this.props.onSubmit(formValues);
  }
 
  public render() {
    return (
      <form data-testid="login-form" onSubmit={this.props.handleSubmit(this._onSubmit)}>
        <Field name="email" id="email" type="text" component={this._renderInput} label="Email" />
        <Field name="password" id="password" type="password" component={this._renderInput} label="Password" />
        <button type='submit'>Log In</button>
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
