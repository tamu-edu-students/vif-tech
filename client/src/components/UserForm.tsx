import React from 'react';
import { Field, reduxForm, InjectedFormProps } from "redux-form";
import { createUser } from '../actions';

interface IUserFormProps {
  onSubmit?: any;
}

class UserForm extends React.Component<InjectedFormProps & IUserFormProps, {}> {
  private _renderInput({ input, label, meta }: any) {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input {...input} autoComplete="off" />
        {/* {this.renderError(meta)} */}
      </div>
    );
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

export default reduxForm({
  form: "userCreate",
  // validate: validate,
})(UserForm);
