import React from 'react';
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';
import CustomForm from '../../../../components/CustomForm/CustomForm';

interface ICompanyFormProps {
  onSubmit?: any;
  onCancel?: any;
}

class CompanyForm extends CustomForm<ICompanyFormProps> {
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
  validate: validate,
})(CompanyForm);

export default connect()(formWrapped);
