import React from 'react';
import { Field, reduxForm } from "redux-form";
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';

import CustomForm from 'Components/CustomForm/CustomForm';
import CustomCheckboxDropdown from 'Components/CustomCheckboxDropdown/CustomCheckboxDropdown';


interface CheckboxOption {
  name: string;
  label: string;
}

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

  private _generateHiringForOptions(): CheckboxOption[] {
    return  [
      { name: 'hiring_for_fulltime', label: 'Full-time' },
      { name: 'hiring_for_parttime', label: 'Part-time' },
      { name: 'hiring_for_intern', label: 'Interns' },
    ];
  }

  public render(): React.ReactElement<Props> {
    const { isPrimaryContact } = this.props;

    return (
      <form className="my-profile__form my-profile__form--basic form form--small form--my-profile" id="profile-form-basic">
        <div className="form__fields">
          <Field name="logo_img_src" id="logo_img_src" type="text" component={this._renderInput} label="Logo image URL" disabled={!isPrimaryContact} />

          <Field name="location" id="location" type="text" component={this._renderInput} label="Location" disabled={!isPrimaryContact} />

          <Field name="website_link" id="website_link" type="text" component={this._renderInput} label="Website URL" disabled={!isPrimaryContact} />

          <fieldset className="form__fieldset" disabled={!isPrimaryContact}>
            <legend className="form__legend">{`Hiring for...`}</legend>
            <CustomCheckboxDropdown
              checkboxOptions={this._generateHiringForOptions()}
              renderCheckbox={this._renderCustomCheckbox}
              disabled={!isPrimaryContact}
            />
          </fieldset>
        </div>
      </form>
    );
  }
}

const formWrapped = reduxForm<any, Props>({
  enableReinitialize: true,
})(CompanyProfileFormBasic);

export default connector(formWrapped);
