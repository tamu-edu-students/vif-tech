import React from 'react';
import { Field, reduxForm } from "redux-form";
import { connect, ConnectedProps } from 'react-redux';

import CustomForm from 'Components/CustomForm/CustomForm';

interface OwnProps {
  onSubmit?: any;
  onCancel?: any;
  name: string;
  id: string;
  label: string;
  form: string;
}

const mapStateToProps = null;
const mapDispatchToProps = { };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class AllowlistEntryForm extends CustomForm<Props, {}> {
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
      <form
        className="allowlist-form form form--modal form--allowlist"
        data-testid="allowlist-entry-create-form"
        onSubmit={this.props.handleSubmit(this._onSubmit)}
      >
        <div className="form__fields">
          <Field name={name} id={id} type="text" component={this._renderInput} label={label} autoFocus />
        </div>
        <div className="form__button-group">
          <button className="btn-wire" type='submit' data-testid="create-allowlist-entry-form-button">Confirm</button>
          <button className="btn-wire" onClick={() => this.props.onCancel()} type='button'>Cancel</button>
        </div>
      </form>
    );
  }
}

const validate = (fields: any, formProps: any) => {
  const errors: any = {};
  const fieldName: string = formProps.name;
  const fieldVal: string = fields[fieldName];

  if (!fieldVal) {
    errors[fieldName] = `Enter a${(fieldName).match(/^[aeiou]/i) ? 'n' : ''} ${fieldName}`;
  }

  return errors;
};

const formWrapped = reduxForm<any, Props>({
  validate: validate,
})(AllowlistEntryForm);

export default connector(formWrapped);
