import React from 'react';
import { Field, reduxForm } from "redux-form";
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

  private _renderCheckboxGroup(focuses: Focus[]): JSX.Element[] {
    return focuses.map((focus: Focus) => (
      <Field
        key={focus.id}
        name={`focus-${focus.id.toString()}`}
        id={`focus-${focus.id.toString()}`}
        component={this._renderCheckbox}
        type="checkbox" label={focus.name}
      />
    ));
  }

  public render(): React.ReactElement<Props> {
    return (
      <form className="my-profile-form form form--small form--my-profile" id="profile-form-focuses">
        <div className="form__fields">
          <fieldset className="form__fieldset">
            <legend className="form__legend">{`Interests`}</legend>
            {this._renderCheckboxGroup(this.props.focuses)}
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
