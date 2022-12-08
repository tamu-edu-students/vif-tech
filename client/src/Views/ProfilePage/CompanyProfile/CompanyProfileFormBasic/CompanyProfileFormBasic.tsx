import React from 'react';
import { Field, reduxForm } from "redux-form";
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';

import CustomForm from 'Components/CustomForm/CustomForm';


interface OwnProps {
  initialValues: any;
  updateBasicFields: Function;
  isPrimaryContact: boolean;
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


class CompanyProfileFormBasic extends CustomForm<Props, OwnState> {
  public componentDidMount(): void {
    this.setState({
      ...this.props.initialValues
    });
  }

  // private _renderYearOptions(): JSX.Element[] {
  //   return [2022, 2023, 2024, 2025, 2026, 2027].map((year: number) => (
  //     <option key={year} value={year}>{year}</option>
  //   ));
  // }

  // private _renderSemesterOptions(): JSX.Element[] {
  //   return ['spring', 'summer', 'fall'].map((semester: string) => (
  //     <option key={semester} value={semester}>{semester[0].toUpperCase() + semester.slice(1)}</option>
  //   ));
  // }

  public render(): React.ReactElement<Props> {
    const { isPrimaryContact } = this.props;

    return (
      <form id="company-profile-form-basic">
        <Field name="logo_img_src" id="logo_img_src" type="text" component={this._renderInput} label="Logo image URL" disabled={!isPrimaryContact} />

        <Field name="location" id="location" type="text" component={this._renderInput} label="Location" disabled={!isPrimaryContact} />

        <Field name="website_link" id="website_link" type="text" component={this._renderInput} label="Website URL" disabled={!isPrimaryContact} />

        {/* <Field name="class_year" id="class_year" component={this._renderSelect} label="Expected graduation year">
          {this._renderYearOptions()}
        </Field>

        <Field name="class_semester" id="class_semester" component={this._renderSelect} label="Expected graduation term">
          {this._renderSemesterOptions()}
        </Field> */}
      </form>
    );
  }
}

const formWrapped = reduxForm<any, Props>({
  enableReinitialize: true,
})(CompanyProfileFormBasic);

export default connector(formWrapped);
