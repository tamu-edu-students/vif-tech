import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { userActionTypes } from 'Store/actions/types';
import { updateUser } from 'Store/actions';

import User from 'Shared/entityClasses/User';

import MyProfileStudentForm from './MyProfileStudentForm/MyProfileStudentForm';


interface OwnProps {
}

interface OwnState {
  basicFields: any;
}

const mapStateToProps = (state: IRootState) => {
  return {
    user: state.auth.user,

    isLoading_updateUser: createLoadingSelector([userActionTypes.UPDATE_USER])(state),
    errors_updateUser: createErrorMessageSelector([userActionTypes.UPDATE_USER])(state),
  };
};
const mapDispatchToProps = { updateUser };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class MyProfileStudent extends React.Component<Props, OwnState> {
  state = { basicFields: {} };

  public componentDidMount(): void {
    
  }

  public componentDidUpdate(): void {
  }

  private _updateBasicFieldsState = (newBasicFields: any): void => {
    const modifiedObj: any = {};
    Object.entries(this.state.basicFields).forEach(([key, value]) => {
      modifiedObj[key] = newBasicFields[key] ?? ''
    });
    this.setState({basicFields: {...newBasicFields}});
  }

  private _onSaveChanges = (): void => {
    this.props.updateUser(this.props.user?.id ?? -1, this.state.basicFields);
  }

  private _renderImg = (profileImgSrc: string): JSX.Element => {
    return (
      <div className="my-profile__img-container">
        <img className='my-profile__img' src={profileImgSrc} />
      </div>
    );
  }

  public render(): React.ReactElement<Props> {
    const user: User = this.props.user as User;
    const {
      firstname,
      lastname,
      profile_img_src,
      class_year,
      class_semester,
      portfolio_link,
      resume_link
    } = user;

    if (this.props.isLoading_updateUser) {
      return (
        <div>Updating profile data...</div>
      );
    }

    if (this.props.errors_updateUser) {
      this.props.errors_updateUser.forEach((error: string) => console.error(error));
    }

    return (
      <div className="My-Profile my-profile">
        <h2 className="heading-secondary">{`My Profile (Student)`}</h2>
        <h3 className="heading-tertiary">{firstname} {lastname}</h3>
        {
          profile_img_src && 
          <>
            <br />
            {this._renderImg(profile_img_src)}
          </>
        }
        <br />
        <div>
          <MyProfileStudentForm
            form="updateBasicStudentFields"
            initialValues={{
              profile_img_src,
              class_year,
              class_semester,
              portfolio_link,
              resume_link
            }}
            updateBasicFields={this._updateBasicFieldsState}
          />
          <button onClick={() => this._onSaveChanges()}>Save Changes</button>
        </div>
      </div>
    );
  }
}

export default connector(MyProfileStudent);
