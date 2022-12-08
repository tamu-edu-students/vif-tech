import React from 'react';
import { Field, reduxForm  } from "redux-form";
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


class MyProfileAdminFormBasic extends CustomForm<Props, OwnState> {
  public componentDidMount(): void {
    this.setState({
      ...this.props.initialValues
    });
  }

  public render(): React.ReactElement<Props> {
    return (
      <form id="volunteer-profile-form">
        <Field name="profile_img_src" id="profile_img_src" type="text" component={this._renderInput} label="Profile picture URL" />

        <Field name="email" id="email" type="text" component={this._renderInput} label="Email" disabled />
      </form>
    );
  }
}

const formWrapped = reduxForm<any, Props>({
  enableReinitialize: true,
})(MyProfileAdminFormBasic);

export default connector(formWrapped);
