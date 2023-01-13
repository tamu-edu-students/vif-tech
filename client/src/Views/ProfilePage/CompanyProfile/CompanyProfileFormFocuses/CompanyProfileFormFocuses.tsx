import React from 'react';
import { reduxForm, Field } from "redux-form";
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';

import Focus from 'Shared/entityClasses/Focus';

import CustomForm from 'Components/CustomForm/CustomForm';


interface OwnProps {
  initialValues: any;
  focuses: Focus[];
  updateFocusFields: Function;
  isPrimaryContact: boolean;
}

interface OwnState {
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  return {
    onChange: ownProps.updateFocusFields
  };
};
const mapDispatchToProps = {};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class CompanyProfileFormFocuses extends CustomForm<Props, OwnState> {
  public componentDidMount(): void {
    this.setState({
      ...this.props.initialValues
    });
  }

  private _generateFocusOptions(focuses: Focus[]): CustomCheckboxOption[] {
    return focuses.map((focus: Focus): CustomCheckboxOption => {
      return { label: focus.name, name: `focuses.${focus.id}` }
    });
  }

  public render(): React.ReactElement<Props> {
    return (
      <form className="my-profile__form my-profile__form--focuses form form--small form--my-profile" id="profile-form-focuses">
        <div className="form__fields">
          <Field
            name="focuses"
            legend="Focuses"
            checkboxOptions={this._generateFocusOptions(this.props.focuses)}
            component={this._renderCustomCheckboxDropdown}
            disabled={!this.props.isPrimaryContact}
          />
        </div>
      </form>
    );
  }
}

const formWrapped = reduxForm<any, Props>({
  enableReinitialize: true,
})(CompanyProfileFormFocuses);

export default connector(formWrapped);
