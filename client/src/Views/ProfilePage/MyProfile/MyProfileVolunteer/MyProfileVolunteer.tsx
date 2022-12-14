import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { userActionTypes, focusActionTypes, userFocusActionTypes } from 'Store/actions/types';
import { updateUser, fetchFocuses, fetchUserFocuses, updateUserFocuses } from 'Store/actions';

import User from 'Shared/entityClasses/User';
import Focus from 'Shared/entityClasses/Focus';

import MyProfileVolunteerFormBasic from './MyProfileVolunteerFormBasic/MyProfileVolunteerFormBasic';
import MyProfileVolunteerFormFocuses from './MyProfileVolunteerFormFocuses/MyProfileVolunteerFormFocuses';


interface OwnProps {
}

interface OwnState {
  basicFields: any;
  focusFields: any;
  isLoading: boolean;
}

const mapStateToProps = (state: IRootState) => {
  const user: User = state.auth.user as User;

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
    user,
    focuses: state.focusData.focuses,
    focusesOfUser: user.findFocuses(state.focusData.focuses, state.userFocusData.userFocuses),

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
const mapDispatchToProps = { updateUser, fetchFocuses, fetchUserFocuses, updateUserFocuses };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class MyProfileVolunteer extends React.Component<Props, OwnState> {
  state = { basicFields: {}, focusFields: {}, isLoading: false };

  public componentDidMount(): void {
    if (this.props.focusesAreStale && !this.props.isLoading_fetchFocuses) {
      this.props.fetchFocuses();
    }
    if (this.props.userFocusesAreStale && !this.props.isLoading_fetchUserFocuses) {
      this.props.fetchUserFocuses();
    }

    this._reloadFieldsState();
  }

  public componentDidUpdate(): void {
    if (this.props.focusesAreStale && !this.props.isLoading_fetchFocuses) {
      this.props.fetchFocuses();
    }
    if (this.props.userFocusesAreStale && !this.props.isLoading_fetchUserFocuses) {
      this.props.fetchUserFocuses();
    }
  }

  private _reloadFieldsState = (): void => {
    this.setState({
      isLoading: false,
      basicFields: this._getInitialBasicFields(),
      focusFields: this._computeInitialFocusChecks()
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

  private _computeInitialFocusChecks(): any {
    const { focuses, focusesOfUser } = this.props;
    let initialFocusChecks = {};
    focuses.forEach((focus: Focus) => {
      if (focusesOfUser.some((focusOfUser: Focus) => focus.id === focusOfUser.id)) {
        initialFocusChecks = { ...initialFocusChecks, [`focus-${focus.id.toString()}`]: true };
      }
    });

    return initialFocusChecks;
  }

  private _updateBasicFieldsState = (newBasicFields: any): void => {
    const modifiedObj: any = {};
    Object.entries(this.state.basicFields).forEach(([key, _]) => {
      modifiedObj[key] = newBasicFields[key] ?? ''
    });
    this.setState({basicFields: {...modifiedObj}});
  }

  private _updateFocusFieldsState = (newFocusFields: any): void => {
    this.setState({focusFields: {...newFocusFields}});
  }

  private _onSaveChanges = (): void => {
    this.setState({ isLoading: true });

    const promises: Promise<void>[] = [];
    promises.push(this.props.updateUser(this.props.user?.id ?? -1, this.state.basicFields));

    const newFocusIds = Object.entries(this.state.focusFields)
      .filter(([_, isChecked]) => isChecked)
      .map(([id, _]): number => Number.parseInt(id.replace(/focus-/, '')));
    promises.push(this.props.updateUserFocuses(this.props.user?.id ?? -1, newFocusIds));
    
    Promise.all(promises).then(() => {
      this._reloadFieldsState();
    });
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
      focuses,
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
      <div className="My-Profile my-profile">
        <h2 className="heading-secondary">{`My Profile (Volunteer)`}</h2>
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
          <MyProfileVolunteerFormBasic
            form="updateBasicVolunteerFields"
            initialValues={ {...this._getInitialBasicFields(), ...this._getInitialDisabledFields()} }
            updateBasicFields={this._updateBasicFieldsState}
          />
        </div>

        <div>
          <MyProfileVolunteerFormFocuses
            form="updateFocusVolunteerFields"
            initialValues={this._computeInitialFocusChecks()}
            focuses={focuses}
            updateFocusFields={this._updateFocusFieldsState}
          />
        </div>

          <button onClick={() => this._onSaveChanges()}>Save Changes</button>
      </div>
    );
  }
}

export default connector(MyProfileVolunteer);
