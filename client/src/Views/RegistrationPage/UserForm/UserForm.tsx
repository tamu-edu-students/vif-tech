import React from 'react';
import { Field, reduxForm, InjectedFormProps, change } from "redux-form";
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { companyActionTypes } from 'Store/actions/types';
import { fetchCompanies } from "Store/actions";

import { Usertype } from "Shared/enums";
import Company from 'Shared/entityClasses/Company';

import CustomForm from 'Components/CustomForm/CustomForm';


interface OwnProps {
  onSubmit?: any;
}

const mapStateToProps = (state: IRootState) => {
  return {
    usertype: state.form?.userCreate?.values.usertype ?? Usertype.STUDENT,
    companies: state.companyData.companies,

    companiesIsStale: state.companyData.isStale,
    isLoading_fetchCompanies: createLoadingSelector([companyActionTypes.FETCH_COMPANIES])(state),
    errors_fetchCompanies: createErrorMessageSelector([companyActionTypes.FETCH_COMPANIES])(state)
  }
}
const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  const formName = ownProps.form;
  return {
    changeFieldValue : function(field: any, value: any) {
      dispatch(change(formName, field, value));
    },
    fetchCompanies: function() { dispatch(fetchCompanies()) },
  }
}
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class UserForm extends CustomForm<Props, {}> {
  public componentDidUpdate(prevProps: Readonly<InjectedFormProps<any, Props, string> & Props>, prevState: Readonly<{}>, snapshot?: any): void {
    if (this.props.usertype !== prevProps.usertype) {
      if (this.props.usertype === Usertype.REPRESENTATIVE) {
        if (this.props.companiesIsStale && !this.props.isLoading_fetchCompanies) {
          this.props.fetchCompanies();
        }
      }
      if (this.props.usertype !== Usertype.REPRESENTATIVE) {
        this.props.changeFieldValue('company_id', '');
        this.props.changeFieldValue('title', '');
      }
      if (this.props.usertype !== Usertype.STUDENT) {
        this.props.changeFieldValue('class_year', '');
        this.props.changeFieldValue('class_semester', '');
      }
    }
  }

  private _renderCompanyOptions(): JSX.Element[] {
    return this.props.companies.map(({id: company_id, name}: Company) => (
      <option key={company_id} value={company_id}>{name}</option>
    ));
  }

  private _renderYearOptions(): JSX.Element[] {
    return [2022, 2023, 2024, 2025, 2026, 2027].map((year: number) => (
      <option key={year} value={year}>{year}</option>
    ));
  }

  private _renderSemesterOptions(): JSX.Element[] {
    return ['spring', 'summer', 'fall'].map((semester: string) => (
      <option key={semester} value={semester}>{semester[0].toUpperCase() + semester.slice(1)}</option>
    ));
  }

  private _onSubmit = (formValues: any) => {
    this.props.onSubmit({
      ...formValues,
      ...(formValues.class_year ? {class_year: Number.parseInt(formValues.class_year)} : {})
    });
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
          <label><p>{`I am a:`}</p></label>
          <Field name="usertype" id="usertype--student" type="radio" component={this._renderInput} label="Student" value={Usertype.STUDENT} />
          <Field name="usertype" id="usertype--volunteer" type="radio" component={this._renderInput} label="Volunteer" value={Usertype.VOLUNTEER} />
          <Field name="usertype" id="usertype--representative" type="radio" component={this._renderInput} label="Company Representative" value={Usertype.REPRESENTATIVE} />
        </fieldset>
        {
          this.props.usertype === Usertype.REPRESENTATIVE &&
          <>
            <Field name="title" id="title" type="text" component={this._renderInput} label="Job title" />
            <div>
              {
                //TODO: add error
                this.props.isLoading_fetchCompanies
                ? <div>Loading company options...</div>
                : (
                  <>
                    <Field name="company_id" id="company_id" component={this._renderSelect} label="Company">
                      <option />
                      {this._renderCompanyOptions()}
                    </Field>
                  </>
                )
              }
            </div>
          </>
        }
        {
          this.props.usertype === Usertype.STUDENT &&
          <>
            <div>
              <Field name="class_year" id="class_year" component={this._renderSelect} label="Expected graduation year">
                <option />
                {this._renderYearOptions()}
              </Field>
            </div>
            <div>
              <Field name="class_semester" id="class_semester" component={this._renderSelect} label="Expected graduation term">
                <option />
                {this._renderSemesterOptions()}
              </Field>
            </div>
          </>
        }
        <button type='submit' data-testid="sign-up-form-button">Sign Up</button>
      </form>
    );
  }
}

const validate = ({
  firstname, lastname, email, password, password_confirmation,
  company_id, title,
  class_year, class_semester,
  usertype
}: any) => {
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

  if (usertype === Usertype.REPRESENTATIVE) {
    if (!company_id) {
      errors.company_id = "You must select your company";
    }
    if (!title) {
      errors.title = "You must enter your job title";
    }
  }

  if (usertype === Usertype.STUDENT) {
    if (!class_year) {
      errors.class_year = "You must select your expected graduation year";
    }
    if (!class_semester) {
      errors.class_semester = "You must select your expected graduation term";
    }
  }

  return errors;
};

const formWrapped = reduxForm<any, Props>({
  initialValues: { usertype: Usertype.STUDENT },
  validate: validate,
})(UserForm);

export default connector(formWrapped);
