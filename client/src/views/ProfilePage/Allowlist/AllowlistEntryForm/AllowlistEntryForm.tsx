import React from 'react';
import { Field, reduxForm, InjectedFormProps } from "redux-form";
import { connect } from 'react-redux';

interface IAllowlistEntryFormProps {
  onSubmit: any;
  id: any;
  name: any;
  buttonLabel: string;
}

class AllowlistEntryForm extends React.Component<InjectedFormProps<any, IAllowlistEntryFormProps> & IAllowlistEntryFormProps, {}> {
  private _renderInput = ({ input, label, meta, id, type }: any) => {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;
    return (
      <div className={className}>
        <label htmlFor={id}>
          {label}
          <input {...input} type={type} id={id} autoComplete="off" />
          {this._renderError(meta)}
        </label>
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
      <form data-testid="company-create-form" onSubmit={this.props.handleSubmit(this._onSubmit)}>
        <Field name={this.props.name} id={this.props.id} type="text" component={this._renderInput} label="Email" />
        <button type='submit' data-testid="create-allowlist-email-form-button">{this.props.buttonLabel}</button>
      </form>
    );
  }
}

const validate = ({email}: any) => {
  const errors: any = {};

  if (!email) {
    errors.email = "You must enter a value";
  }

  return errors;
};

const formWrapped = reduxForm<any, IAllowlistEntryFormProps>({
  form: "allowlistEmailCreate",
  validate: validate,
})(AllowlistEntryForm);

export default connect()(formWrapped);
