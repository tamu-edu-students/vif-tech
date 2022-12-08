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

  private _renderCheckboxGroup(focuses: Focus[]): JSX.Element[] {
    return focuses.map((focus: Focus) => (
      <Field
        key={focus.id}
        name={`focus-${focus.id.toString()}`}
        id={`focus-${focus.id.toString()}`}
        component={this._renderInput}
        type="checkbox" label={focus.name}
        disabled={!this.props.isPrimaryContact}
      />
    ));
  }

  public render(): React.ReactElement<Props> {
    const { isPrimaryContact } = this.props;

    return (
      <form id="company-profile-form-focuses">

        <fieldset>
        <label><p>{`Focuses`}</p></label>
          {this._renderCheckboxGroup(this.props.focuses)}
        </fieldset>
      </form>
    );
  }
}

const formWrapped = reduxForm<any, Props>({
  enableReinitialize: true,
})(CompanyProfileFormFocuses);

export default connector(formWrapped);
