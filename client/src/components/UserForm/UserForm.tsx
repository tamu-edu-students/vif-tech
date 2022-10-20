import React from 'react';
import { Field, reduxForm, InjectedFormProps } from "redux-form";
import { connect } from 'react-redux';

interface IUserFormProps {
  onSubmit?: any;
}

class UserForm extends React.Component<InjectedFormProps & IUserFormProps, {}> {
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
      <form data-testid="user-create-form" onSubmit={this.props.handleSubmit(this._onSubmit)}>
        <Field name="email" id="email" component={this._renderInput} label="Email" />
        <Field name="first_name" id="first_name" component={this._renderInput} label="First name" />
        <Field name="last_name" id="last_name" component={this._renderInput} label="Last name" />
        <Field name="password" id="password" component={this._renderInput} label="Password" />
        <Field name="password_confirmation" id="password_confirmation" component={this._renderInput} label="Confirm password" />
        <button type='submit'>Sign Up</button>
      </form>
    );
  }
}

const validate = ({username, email, password, password_confirmation}: any) => {
  const errors: any = {};

  if (!username) {
    errors.username = "You must enter a username";
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

const formWrapped = reduxForm({
  form: "userCreate",
  validate: validate,
})(UserForm);

export default connect()(formWrapped);
