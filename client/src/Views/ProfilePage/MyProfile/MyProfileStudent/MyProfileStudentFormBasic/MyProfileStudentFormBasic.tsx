import React from 'react';
import { Field, reduxForm, InjectedFormProps, change } from "redux-form";
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { allowlistActionTypes } from 'Store/actions/types';

import Focus from 'Shared/entityClasses/Focus';

import CustomForm from 'Components/CustomForm/CustomForm';


interface OwnProps {
  initialValues: any;
  updateBasicFields: Function;
}

interface OwnState {
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  return {
    onChange: ownProps.updateBasicFields
  };
};
const mapDispatchToProps = {};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;


class MyProfileStudentFormBasic extends CustomForm<Props, OwnState> {
  public componentDidMount(): void {
    this.setState({
      ...this.props.initialValues
    });
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

  public render(): React.ReactElement<Props> {
    return (
      <form id="student-profile-form">
        <Field name="email" id="email" type="text" component={this._renderInput} label="Email" disabled />

        <Field name="profile_img_src" id="profile_img_src" type="text" component={this._renderInput} label="Profile Picture URL" />

        <Field name="class_year" id="class_year" component={this._renderSelect} label="Expected graduation year">
          {this._renderYearOptions()}
        </Field>

        <Field name="class_semester" id="class_semester" component={this._renderSelect} label="Expected graduation term">
          {this._renderSemesterOptions()}
        </Field>
        
        <Field name="resume_link" id="resume_link" type="text" component={this._renderInput} label="Resume URL" />

        <Field name="portfolio_link" id="portfolio_link" type="text" component={this._renderInput} label="Portfolio URL" />
      </form>
    );
  }
}

const formWrapped = reduxForm<any, Props>({
  enableReinitialize: true,
})(MyProfileStudentFormBasic);

export default connector(formWrapped);
