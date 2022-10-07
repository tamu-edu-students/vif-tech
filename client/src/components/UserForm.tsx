import React from 'react';
import { Field, reduxForm, InjectedFormProps } from "redux-form";

interface IUserFormProps {
  onSubmit?: any;
}

class UserForm extends React.Component<InjectedFormProps & IUserFormProps, {}> {
  private _renderInput = ({ input, label, meta }: any) => {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input {...input} autoComplete="off" />
        {this._renderError(meta)}
      </div>
    );
  }

  private _renderError({ error, touched }: any) {
    if (touched && error) {
      return (
        <div className="error">
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
      <form onSubmit={this.props.handleSubmit(this._onSubmit)}>
        <Field name="username" component={this._renderInput} label="Username" />
        <Field name="email" component={this._renderInput} label="Email" />
        <Field name="password" component={this._renderInput} label="Password" />
        <Field name="password_confirmation" component={this._renderInput} label="Confirm password" />
        <button type='submit'>Add User</button>
      </form>
    );
  }
}

const validate = ({username, email, password, password_confirmation}: any) => {
  const errors: any = {};

  if (!username) {
    errors.username = "You must enter a description";
  }

  if (!email) {
    errors.email = "You must enter an email address";
  }

  if (!password) {
    errors.password = "You must enter a password";
  }

  if (password !== password_confirmation) {
    errors.password_confirmation = "Passwords do no match";
  }

  return errors;
};

export default reduxForm({
  form: "userCreate",
  validate: validate,
})(UserForm);
