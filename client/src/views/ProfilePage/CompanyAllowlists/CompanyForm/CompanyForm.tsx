import React from 'react';
import { Field, reduxForm, InjectedFormProps } from "redux-form";
import { connect } from 'react-redux';

interface ICompanyFormProps {
  onSubmit?: any;
  onCancel?: any;
}

class CompanyForm extends React.Component<InjectedFormProps<any, ICompanyFormProps> & ICompanyFormProps, {}> {
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
        <Field name="name" id="name" type="text" component={this._renderInput} label="Company name" />
        <button type='submit' data-testid="create-company-form-button">Confirm</button>
        <button onClick={() => this.props.onCancel()} type='button'>Cancel</button>
      </form>
    );
  }
}

const validate = ({name}: any) => {
  const errors: any = {};

  if (!name) {
    errors.name = "You must enter a company name";
  }

  return errors;
};

const formWrapped = reduxForm<any, ICompanyFormProps>({
  form: "companyCreate",
  validate: validate,
})(CompanyForm);

export default connect()(formWrapped);
