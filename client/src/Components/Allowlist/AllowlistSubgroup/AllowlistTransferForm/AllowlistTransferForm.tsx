import React from 'react';
import { Field, reduxForm } from "redux-form";
import { connect, ConnectedProps } from 'react-redux';

import User from 'Shared/entityClasses/User';

import CustomForm from 'Components/CustomForm/CustomForm';


interface OwnProps {
  onSubmit?: any;
  onCancel?: any;
  name: string;
  id: string;
  label: string;
  form: string;
  colleagues: User[];
}

const mapStateToProps = null;
const mapDispatchToProps = { };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class AllowlistTransferForm extends CustomForm<Props, {}> {
  private _onSubmit = (formValues: any) => {
    this.props.onSubmit(formValues);
  }

  private _renderColleagueOptions(): JSX.Element[] {
    return this.props.colleagues.map(({id: user_id, firstname, lastname, email}: User) => (
      <option key={user_id} value={user_id}>
          {`${firstname} ${lastname}\n(${email})`}
      </option>
    ));
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
        onSubmit={this.props.handleSubmit(this._onSubmit)}
        data-testid="allowlist-entry-create-form"
      >
        <p className="form__note">Note: Primary Contact status can only be transferred to <em>existing</em> users.</p>
        <div className="form__fields">
          <Field name={name} id={id} component={this._renderSelect} label={label}>
            <option />
            {this._renderColleagueOptions()}
          </Field>
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
    errors[fieldName] = `Select a colleague`;
  }

  return errors;
};

const formWrapped = reduxForm<any, Props>({
  validate: validate,
})(AllowlistTransferForm);

export default connector(formWrapped);
