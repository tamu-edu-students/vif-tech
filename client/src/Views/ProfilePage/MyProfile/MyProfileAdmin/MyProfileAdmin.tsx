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
  isLoading: boolean;
}

const mapStateToProps = (state: IRootState) => {
  const user: User = state.auth.user as User;

  const isLoading_updateUser: boolean = createLoadingSelector([userActionTypes.UPDATE_USER])(state);
  const errors_updateUser: string[] = createErrorMessageSelector([userActionTypes.UPDATE_USER])(state);

  const isLoading: boolean = false;

  return {
    user,

    isLoading_updateUser,
    errors_updateUser,

    isLoading,
  };
};
const mapDispatchToProps = { updateUser, fetchFocuses, fetchUserFocuses, updateUserFocuses };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class MyProfileAdmin extends React.Component<Props, OwnState> {
  state = { basicFields: {}, isLoading: false };

  public componentDidMount(): void {
    this._reloadFieldsState();
  }

  public componentDidUpdate(): void {
  }
  
  private _reloadFieldsState = (): void => {
    this.setState({
      isLoading: false,
      basicFields: this._getInitialBasicFields()
    });
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
    this.setState({ isLoading: true });
    this.props.updateUser(this.props.user?.id ?? -1, this.state.basicFields)
    .then(() => this._reloadFieldsState());
  }
  
  private _renderImg(profileImgSrc: string): JSX.Element {
    return (
      <img className='my-profile__img' src={profileImgSrc} alt={`${this.props.user.firstname} ${this.props.user.lastname}`} />
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

    if (this.state.isLoading) {
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
      <div className="my-profile">
        {
          <div className="my-profile__img-container">
          {profile_img_src && 
            this._renderImg(profile_img_src)}
          </div>
        }

        <div className="my-profile__name">{`${firstname} ${lastname}`}</div>
        
        <div>
          <MyProfileAdminFormBasic
            form="updateBasicAdminFields"
            initialValues={ {...this._getInitialBasicFields(), ...this._getInitialDisabledFields()} }
            updateBasicFields={this._updateBasicFieldsState}
          />
        </div>

        <button className="btn-wire btn-wire--small" onClick={() => this._onSaveChanges()}>Save Changes</button>
      </div>
    );
  }
}

export default connector(MyProfileAdmin);
