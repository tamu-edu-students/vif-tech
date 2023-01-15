import React from 'react';
import { Field, reduxForm } from "redux-form";
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';

import CustomForm from 'Components/CustomForm/CustomForm';
import CustomCheckboxDropdown from 'Components/CustomCheckboxDropdown/CustomCheckboxDropdown';


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

  private _renderYearOptions(): CustomSelectOption[] {
    return [2022, 2023, 2024, 2025, 2026, 2027].map((year: number): CustomSelectOption => (
      {label: `${year}`, value: year}
    ));
  }

  private _renderSemesterOptions(): CustomSelectOption[] {
    return ['spring', 'summer', 'fall'].map((semester: string): CustomSelectOption => (
      {label: semester[0].toUpperCase() + semester.slice(1), value: semester}
    ));
  }

  public render(): React.ReactElement<Props> {
    return (
      <form className="my-profile__form my-profile__form--basic form form--small form--my-profile" id="profile-form-basic">
        <div className="form__fields">
          <Field name="profile_img_src" id="profile_img_src" type="text" component={this._renderInput} label="Profile picture URL" />

          <Field name="email" id="email" type="text" component={this._renderInput} label="Email" disabled />

          <Field
            name="class_year"
            legend="Expected graduation year"
            selectOptions={this._renderYearOptions()}
            component={this._renderCustomSelectDropdown}
          />

          <Field
            name="class_semester"
            legend="Expected graduation term"
            selectOptions={this._renderSemesterOptions()}
            component={this._renderCustomSelectDropdown}
          />
          
          <Field name="resume_link" id="resume_link" type="text" component={this._renderInput} label="Resume URL" />

          <Field name="portfolio_link" id="portfolio_link" type="text" component={this._renderInput} label="Portfolio URL" />
        </div>
      </form>
    );
  }
}

const formWrapped = reduxForm<any, Props>({
  enableReinitialize: true,
})(MyProfileStudentFormBasic);

export default connector(formWrapped);
