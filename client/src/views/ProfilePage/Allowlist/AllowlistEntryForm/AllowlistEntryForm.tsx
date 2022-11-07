import React from 'react';
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';

import CustomForm from '../../../../components/CustomForm/CustomForm';

export interface IAllowlistEntryFormProps {
  onSubmit?: any;
  onCancel?: any;
  name: string;
  id: string;
  label: string;
  form: string;
}

class AllowlistEntryForm extends CustomForm<IAllowlistEntryFormProps> {
  private _onSubmit = (formValues: any) => {
    this.props.onSubmit(formValues);
  }
 
  public render() {
    const {
      name,
      id,
      label,
    } = this.props;

    return (
      <form data-testid="company-create-form" onSubmit={this.props.handleSubmit(this._onSubmit)}>
        <Field name={name} id={id} type="text" component={this._renderInput} label={label}/>
        <button type='submit' data-testid="create-company-form-button">Confirm</button>
        <button onClick={() => this.props.onCancel()} type='button'>Cancel</button>
      </form>
    );
  }
}

const validate = (fields: any, formProps: any) => {
  const errors: any = {};
  const fieldName: string = formProps.name;
  const fieldVal: string = fields[fieldName];

  if (!fieldVal) {
    errors[fieldName] = `You must enter a${(fieldName).match(/^[aeiou]/i) ? 'n' : ''} ${fieldName}`;
  }

  return errors;
};

const formWrapped = reduxForm<any, IAllowlistEntryFormProps>({
  validate: validate,
})(AllowlistEntryForm);

export default connect()(formWrapped);
