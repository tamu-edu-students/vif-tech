import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { userActionTypes, focusActionTypes, userFocusActionTypes } from 'Store/actions/types';
import { updateUser, fetchFocuses, fetchUserFocuses } from 'Store/actions';

import User from 'Shared/entityClasses/User';

import MyProfileStudentForm from './MyProfileStudentForm/MyProfileStudentForm';


interface OwnProps {
}

interface OwnState {
  basicFields: any;
}

const mapStateToProps = (state: IRootState) => {
  const isLoading_updateUser: boolean = createLoadingSelector([userActionTypes.UPDATE_USER])(state);
  const errors_updateUser: string[] = createErrorMessageSelector([userActionTypes.UPDATE_USER])(state);

  const focusesAreStale = state.focusData.isStale;
  const isLoading_fetchFocuses: boolean = createLoadingSelector([focusActionTypes.FETCH_FOCUSES])(state);
  const errors_fetchFocuses: string[] = createErrorMessageSelector([focusActionTypes.FETCH_FOCUSES])(state);

  const userFocusesAreStale = state.userFocusData.isStale;
  const isLoading_fetchUserFocuses: boolean = createLoadingSelector([userFocusActionTypes.FETCH_USER_FOCUSES])(state);
  const errors_fetchUserFocuses: string[] = createErrorMessageSelector([userFocusActionTypes.FETCH_USER_FOCUSES])(state);

  const isLoading: boolean = isLoading_fetchFocuses || focusesAreStale || isLoading_fetchUserFocuses || userFocusesAreStale;
  const errors_breaking: string[] = [...errors_fetchFocuses, ...errors_fetchUserFocuses];

  return {
    user: state.auth.user,

    isLoading_updateUser,
    errors_updateUser,

    focusesAreStale,
    isLoading_fetchFocuses,
    errors_fetchFocuses,

    userFocusesAreStale,
    isLoading_fetchUserFocuses,
    errors_fetchUserFocuses,

    isLoading,
    errors_breaking,
  };
};
const mapDispatchToProps = { updateUser, fetchFocuses, fetchUserFocuses };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class MyProfileStudent extends React.Component<Props, OwnState> {
  state = { basicFields: {} };

  public componentDidMount(): void {
    if (this.props.focusesAreStale && !this.props.isLoading_fetchFocuses) {
      this.props.fetchFocuses();
    }
    if (this.props.userFocusesAreStale && !this.props.isLoading_fetchUserFocuses) {
      this.props.fetchUserFocuses();
    }
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
    
    if (this.props.errors_updateUser.length > 0) {
      this.props.errors_updateUser.forEach((error: string) => console.error(error));
    }

    if (this.props.errors_breaking.length > 0) {
      this.props.errors_breaking.forEach((error: string) => console.error(error));
      return <div className="error">{this.props.errors_breaking}</div>
    }

    if (this.props.isLoading_updateUser) {
      return (
        <div>Saving changes...</div>
      );
    }

    if (this.props.isLoading) {
      return (
        <div>Loading My Profile...</div>
      );
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
