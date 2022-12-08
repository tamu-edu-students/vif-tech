import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { userActionTypes } from 'Store/actions/types';
import { updateUser, fetchFocuses, fetchUserFocuses, updateUserFocuses } from 'Store/actions';

import User from 'Shared/entityClasses/User';

import MyProfileAdminFormBasic from './MyProfileAdminFormBasic/MyProfileAdminFormBasic';


interface OwnProps {
}

interface OwnState {
  basicFields: any;
}

const mapStateToProps = (state: IRootState) => {
  const user: User = state.auth.user as User;

  const isLoading_updateUser: boolean = createLoadingSelector([userActionTypes.UPDATE_USER])(state);
  const errors_updateUser: string[] = createErrorMessageSelector([userActionTypes.UPDATE_USER])(state);

  // const focusesAreStale = state.focusData.isStale;
  // const isLoading_fetchFocuses: boolean = createLoadingSelector([focusActionTypes.FETCH_FOCUSES])(state);
  // const errors_fetchFocuses: string[] = createErrorMessageSelector([focusActionTypes.FETCH_FOCUSES])(state);

  // const userFocusesAreStale = state.userFocusData.isStale;
  // const isLoading_fetchUserFocuses: boolean = createLoadingSelector([userFocusActionTypes.FETCH_USER_FOCUSES])(state);
  // const errors_fetchUserFocuses: string[] = createErrorMessageSelector([userFocusActionTypes.FETCH_USER_FOCUSES])(state);

  const isLoading: boolean = /*isLoading_fetchFocuses || focusesAreStale || isLoading_fetchUserFocuses || userFocusesAreStale*/ false;
  const errors_breaking: string[] = [/*...errors_fetchFocuses, ...errors_fetchUserFocuses*/];

  return {
    user,

    isLoading_updateUser,
    errors_updateUser,

    // focusesAreStale,
    // isLoading_fetchFocuses,
    // errors_fetchFocuses,

    // userFocusesAreStale,

    isLoading,
    errors_breaking,
  };
};
const mapDispatchToProps = { updateUser, fetchFocuses, fetchUserFocuses, updateUserFocuses };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class MyProfileAdmin extends React.Component<Props, OwnState> {
  state = { basicFields: {}, focusFields: {} };

  public componentDidMount(): void {
    // if (this.props.focusesAreStale && !this.props.isLoading_fetchFocuses) {
    //   this.props.fetchFocuses();
    // }
    // if (this.props.userFocusesAreStale && !this.props.isLoading_fetchUserFocuses) {
    //   this.props.fetchUserFocuses();
    // }

    this.setState({
      basicFields: this._getInitialBasicFields(),
    });
  }

  public componentDidUpdate(): void {
    // console.log(this.state.focusFields);
  }

  private _getInitialBasicFields(): any {
    const {
      profile_img_src
    } = this.props.user;

    return {
      profile_img_src
    };
  }

  private _getInitialDisabledFields(): any {
    const {
      email,
    } = this.props.user;

    return {
      email,
    }
  }

  private _updateBasicFieldsState = (newBasicFields: any): void => {
    const modifiedObj: any = {};
    Object.entries(this.state.basicFields).forEach(([key, _]) => {
      modifiedObj[key] = newBasicFields[key] ?? ''
    });
    this.setState({basicFields: {...modifiedObj}});
  }

  private _onSaveChanges = (): void => {
    this.props.updateUser(this.props.user?.id ?? -1, this.state.basicFields);
    const newFocusIds = Object.entries(this.state.focusFields)
      .filter(([_, isChecked]) => isChecked)
      .map(([id, _]): number => Number.parseInt(id.replace(/focus-/, '')));
    this.props.updateUserFocuses(this.props.user?.id ?? -1, newFocusIds);
  }
  
  private _renderImg(profileImgSrc: string): JSX.Element {
    return (
      <div className="my-profile__img-container">
        <img className='my-profile__img' src={profileImgSrc} alt={`${this.props.user.firstname} ${this.props.user.lastname}`} />
      </div>
    );
  }

  public render(): React.ReactElement<Props> {
    const {
      user,
    } = this.props;
    const {
      firstname,
      lastname,
      profile_img_src,
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
        <h2 className="heading-secondary">{`My Profile (Admin)`}</h2>
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
          <MyProfileAdminFormBasic
            form="updateBasicVolunteerFields"
            initialValues={ {...this._getInitialBasicFields(), ...this._getInitialDisabledFields()} }
            updateBasicFields={this._updateBasicFieldsState}
          />
        </div>

          <button onClick={() => this._onSaveChanges()}>Save Changes</button>
      </div>
    );
  }
}

export default connector(MyProfileAdmin);
