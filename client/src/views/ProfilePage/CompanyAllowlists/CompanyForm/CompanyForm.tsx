import React from 'react';
import { Field, reduxForm } from "redux-form";
import { connect, ConnectedProps } from 'react-redux';
import CustomForm from 'Components/CustomForm/CustomForm';

interface OwnProps {
  onSubmit?: any;
  onCancel?: any;
}

const mapStateToProps = null;
const mapDispatchToProps = { };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class CompanyForm extends CustomForm<Props> {
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

const formWrapped = reduxForm<any, Props>({
  validate: validate,
})(CompanyForm);

export default connector(formWrapped);
