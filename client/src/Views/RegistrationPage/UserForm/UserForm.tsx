import React from 'react';
import { Field, reduxForm, InjectedFormProps, change } from "redux-form";
import { connect, ConnectedProps } from 'react-redux';

import CustomForm from 'Components/CustomForm/CustomForm';
import { Usertype } from "Shared/enums";
import { fetchCompanies } from "Store/actions";
import { IRootState } from 'Store/reducers';

interface OwnProps {
  onSubmit?: any;
}

const mapStateToProps = (state: IRootState) => {
  return {
    usertype: state.form?.userCreate?.values.usertype ?? Usertype.STUDENT,
    companies: state.companies,
  }
}
const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  const formName = ownProps.form;
  return {
    changeFieldValue : function(field: any, value: any) {
      dispatch(change(formName, field, value));
    },
    fetchCompanies: () => dispatch(fetchCompanies()),
  }
}
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class UserForm extends CustomForm<Props, {}> {
  public componentDidUpdate(prevProps: Readonly<InjectedFormProps<any, Props, string> & Props>, prevState: Readonly<{}>, snapshot?: any): void {
    if (this.props.usertype !== prevProps.usertype) {
      if (this.props.usertype === Usertype.REPRESENTATIVE) {
        this.props.fetchCompanies();
      }
      if (this.props.usertype !== Usertype.REPRESENTATIVE) {
        this.props.changeFieldValue('company_id', '');
      }
    }
  }

  private _renderCompanyOptions(): JSX.Element[] {
    return this.props.companies.map(({id: company_id, name}: Company) => (
      <option key={company_id} value={company_id}>{name}</option>
    ));
  }

  private _onSubmit = (formValues: any) => {
    this.props.onSubmit(formValues);
  }
 
  public render() {
    return (
      <form data-testid="user-create-form" onSubmit={this.props.handleSubmit(this._onSubmit)}>
        <Field name="email" id="email" type="email" component={this._renderInput} label="Email" />
        <Field name="firstname" id="firstname" type="text" component={this._renderInput} label="First name" />
        <Field name="lastname" id="lastname" type="text" component={this._renderInput} label="Last name" />
        <Field name="password" id="password" type="password" component={this._renderInput} label="Password" />
        <Field name="password_confirmation" id="password-confirmation" type="password" component={this._renderInput} label="Confirm password" />
        <fieldset>
          <Field name="usertype" id="usertype--student" type="radio" component={this._renderInput} label="Student" value={Usertype.STUDENT} />
          <Field name="usertype" id="usertype--volunteer" type="radio" component={this._renderInput} label="Volunteer" value={Usertype.VOLUNTEER} />
          <Field name="usertype" id="usertype--representative" type="radio" component={this._renderInput} label="Company Representative" value={Usertype.REPRESENTATIVE} />
        </fieldset>
        {
          this.props.usertype === Usertype.REPRESENTATIVE &&
          (
          <div>
            <label htmlFor="company_id">Company</label>
            <Field name="company_id" id="company_id" component={this._renderSelect}>
              <option />
              {this._renderCompanyOptions()}
            </Field>
          </div>
          )
        }
        <button type='submit' data-testid="sign-up-form-button">Sign Up</button>
      </form>
    );
  }
}

const validate = ({firstname, lastname, email, password, password_confirmation, company_id, usertype}: any) => {
  const errors: any = {};

  if (!firstname) {
    errors.firstname = "You must enter your first name";
  }

  if (!lastname) {
    errors.lastname = "You must enter your last name";
  }

  if (!email) {
    errors.email = "You must enter an email address";
  }

  if (!password) {
    errors.password = "You must enter a password";
  }

  if (password !== password_confirmation) {
    errors.password_confirmation = "Passwords do not match";
  }

  if (usertype === Usertype.REPRESENTATIVE && !company_id) {
    errors.company_id = "You must choose your company";
  }

  return errors;
};

const formWrapped = reduxForm<any, Props>({
  initialValues: { usertype: Usertype.STUDENT },
  validate: validate,
})(UserForm);

export default connector(formWrapped);
