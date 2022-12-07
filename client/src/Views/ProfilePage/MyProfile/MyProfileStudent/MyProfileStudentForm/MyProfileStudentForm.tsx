import React from 'react';
import { Field, reduxForm, InjectedFormProps, change } from "redux-form";
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { allowlistActionTypes } from 'Store/actions/types';
import CustomForm from 'Components/CustomForm/CustomForm';

interface OwnProps {
  initialValues: any;
  updateBasicFields: Function;
}

interface OwnState {
  profile_img_src: string;
  class_year: number;
  class_semester: string;
  resume_link: string;
  portfolio_link: string;
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  return {
    onChange: ownProps.updateBasicFields
  };
};
const mapDispatchToProps = {};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;


class MyProfileStudentForm extends CustomForm<Props, OwnState> {
  state = {profile_img_src: '', class_year: -1, class_semester: '', resume_link: '', portfolio_link: ''};

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

  // private _updateBasicField = (event: any) => {
  //   this.props.updateBasicField({ [event.target.name]: event.target.value });
  // }

  public render(): React.ReactElement<Props> {
    const {
      profile_img_src,
      class_year,
      class_semester,
      resume_link,
      portfolio_link,
    } = this.state;

    return (
      <form id="student-profile-form">
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

const handleOnFormChange = () => {
  // const { studentStatus: newStudentStatus } = newValues;
  // const {
  //   studentStatus: prevStudentStatus,
  //   creditValue: prevCreditValue,
  // } = previousValues;
  // const { change: changeField } = props;

  // /*
  //   if the user sets the participant as a "no show",
  //   then their credit value should be automatically set to zero
  // */
  // if (
  //   newStudentStatus !== prevStudentStatus && // to prevent dispatching every time
  //   newStudentStatus === 'noShow' &&
  //   prevCreditValue > 0
  // ) {
  //   dispatch(changeField('creditValue', 0));
  // }
};

const formWrapped = reduxForm<any, Props>({
  enableReinitialize: true,
})(MyProfileStudentForm);

export default connector(formWrapped);
