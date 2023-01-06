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

class CompanyForm extends CustomForm<Props, {}> {
  private _onSubmit = (formValues: any) => {
    this.props.onSubmit(formValues);
  }
 
  public render() {
    return (
      <form
        className="allowlist-form form form--modal form--allowlist"
        onSubmit={this.props.handleSubmit(this._onSubmit)}
        data-testid="company-create-form"
      >
        <div className="form__fields">
          <Field name="name" id="name" type="text" component={this._renderInput} label="Company name" autoFocus />
        </div>
        <div className="form__button-group">
          <button className="btn-wire" type='submit' data-testid="create-company-form-button">Confirm</button>
          <button className="btn-wire" onClick={() => this.props.onCancel()} type='button'>Cancel</button>
        </div>
      </form>
    );
  }
}

const validate = ({name}: any) => {
  const errors: any = {};

  if (!name) {
    errors.name = "Enter a company name";
  }

  return errors;
};

const formWrapped = reduxForm<any, Props>({
  validate: validate,
})(CompanyForm);

export default connector(formWrapped);
