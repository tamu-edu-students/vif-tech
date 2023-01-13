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

class MyProfileStudentFormFocuses extends CustomForm<Props, OwnState> {
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
            legend="Interests"
            checkboxOptions={this._generateFocusOptions(this.props.focuses)}
            component={this._renderCustomCheckboxDropdown}
          />
        </div>
      </form>
    );
  }
}

// const validate = ({ focuses }: any) => {
//   const errors: any = {focuses: {}};

//   if(!focuses) {
//     return {};
//   }
  
//   if (!Object.values(focuses).some(value => value)) {
//     Object.keys(focuses).forEach(key => {
//       errors.focuses[key] = undefined;
//     });
//     errors.focuses.focuses = "Select something, please"
//     return errors;
//   }

//   return {};
// }

const formWrapped = reduxForm<any, Props>({
  enableReinitialize: true,
  // validate: validate,
  touchOnChange: false,
})(MyProfileStudentFormFocuses);

export default connector(formWrapped);
