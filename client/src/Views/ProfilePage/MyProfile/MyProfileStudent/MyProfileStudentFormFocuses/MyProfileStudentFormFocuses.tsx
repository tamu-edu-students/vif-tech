import React from 'react';
import { Field, reduxForm } from "redux-form";
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';

import Focus from 'Shared/entityClasses/Focus';

import CustomForm from 'Components/CustomForm/CustomForm';
import CustomCheckbox from 'Components/CustomCheckbox/CustomCheckbox';
import CustomCheckboxDropdown from 'Components/CustomCheckboxDropdown/CustomCheckboxDropdown';


interface CheckboxOption {
  label: string;
  name: string;
}

interface OwnProps {
  initialValues: any;
  focuses: Focus[];
  updateFocusFields: Function;
}

interface OwnState {
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  console.log(ownProps.initialValues)
  return {
    onChange: ownProps.updateFocusFields
  };
};
const mapDispatchToProps = {};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class MyProfileStudentFormFocuses extends CustomForm<Props, OwnState> {
  public componentDidMount(): void {
    this.setState({
      ...this.props.initialValues
    });
  }

  private _renderCheckboxGroup(focuses: Focus[]): JSX.Element[] {
    return focuses.map((focus: Focus) => (
      <Field
        key={focus.id}
        name={`focus-${focus.id.toString()}__${focus.name}`}
        id={`focus-${focus.id.toString()}__${focus.name}`}
        component={this._renderCustomCheckbox}
        type="checkbox"
        label={focus.name}
      />
    ));
  }

  private _generateFocusOptions(focuses: Focus[]): CheckboxOption[] {
    return focuses.map((focus: Focus): CheckboxOption => {
      return { label: focus.name, name: `focus-${focus.id.toString()}__${focus.name}` }
    })
  }

  public render(): React.ReactElement<Props> {
    return (
      <form className="my-profile-form form form--small form--my-profile" id="profile-form-focuses">
        <div className="form__fields">
          <fieldset className="form__fieldset">
            <legend className="form__legend">{`Interests`}</legend>
            {/* {this._renderCheckboxGroup(this.props.focuses)} */}
            <CustomCheckboxDropdown
              checkboxOptions={this._generateFocusOptions(this.props.focuses)}
              renderCheckbox={this._renderCustomCheckbox}
            />
          </fieldset>
        </div>
      </form>
    );
  }
}

const formWrapped = reduxForm<any, Props>({
  enableReinitialize: true,
})(MyProfileStudentFormFocuses);

export default connector(formWrapped);
