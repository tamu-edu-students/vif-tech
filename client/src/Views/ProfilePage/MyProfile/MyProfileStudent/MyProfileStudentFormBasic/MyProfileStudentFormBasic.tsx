import React from 'react';
import { Field, reduxForm } from "redux-form";
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';

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
      <form className="my-profile__form my-profile__form--basic form form--small form--my-profile" id="profile-form-basic">
        <div className="form__fields">
          <Field name="profile_img_src" id="profile_img_src" type="text" component={this._renderInput} label="Profile picture URL" />

          <Field name="email" id="email" type="text" component={this._renderInput} label="Email" disabled />

          <Field
            name="class_year"
            label="Expected graduation year"
            component={this._renderCustomSelectDropdown}
          >
            {this._renderYearOptions()}
          </Field>

          <Field
            name="class_semester"
            label="Expected graduation term"
            component={this._renderCustomSelectDropdown}
          >
            {this._renderSemesterOptions()}
          </Field>
          
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
