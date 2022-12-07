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
      <form data-testid="allowlist-entry-create-form" onSubmit={this.props.handleSubmit(this._onSubmit)}>
        <div>
          <p>Note: Primary Contact status can only be transferred to <em>existing</em> users.</p>
          <br />
          <Field name={name} id={name} component={this._renderSelect} label={label}>
            <option />
            {this._renderColleagueOptions()}
          </Field>
        </div>
        <button type='submit' data-testid="create-allowlist-entry-form-button">Confirm</button>
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
    errors[fieldName] = `You must select a colleague`;
  }

  return errors;
};

const formWrapped = reduxForm<any, Props>({
  validate: validate,
})(AllowlistTransferForm);

export default connector(formWrapped);
