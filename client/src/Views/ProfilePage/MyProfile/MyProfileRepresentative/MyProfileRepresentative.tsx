import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { userActionTypes, focusActionTypes, userFocusActionTypes, companyActionTypes } from 'Store/actions/types';
import { updateUser, fetchFocuses, fetchUserFocuses, updateUserFocuses, fetchCompanies } from 'Store/actions';

import User from 'Shared/entityClasses/User';
import Company from 'Shared/entityClasses/Company';

import MyProfileRepresentativeFormBasic from './MyProfileRepresentativeFormBasic/MyProfileRepresentativeFormBasic';


interface OwnProps {
}

interface OwnState {
  basicFields: any;
}

const mapStateToProps = (state: IRootState) => {
  const user: User = state.auth.user as User;
  const company: Company = user.findCompany(state.companyData.companies) as Company;

  const isLoading_updateUser: boolean = createLoadingSelector([userActionTypes.UPDATE_USER])(state);
  const errors_updateUser: string[] = createErrorMessageSelector([userActionTypes.UPDATE_USER])(state);

  const focusesAreStale = state.focusData.isStale;
  const isLoading_fetchFocuses: boolean = createLoadingSelector([focusActionTypes.FETCH_FOCUSES])(state);
  const errors_fetchFocuses: string[] = createErrorMessageSelector([focusActionTypes.FETCH_FOCUSES])(state);

  const userFocusesAreStale = state.userFocusData.isStale;
  const isLoading_fetchUserFocuses: boolean = createLoadingSelector([userFocusActionTypes.FETCH_USER_FOCUSES])(state);
  const errors_fetchUserFocuses: string[] = createErrorMessageSelector([userFocusActionTypes.FETCH_USER_FOCUSES])(state);

  const companiesAreStale = state.companyData.isStale;
  const isLoading_fetchCompanies: boolean = createLoadingSelector([companyActionTypes.FETCH_COMPANIES])(state);
  const errors_fetchCompanies: string[] = createErrorMessageSelector([companyActionTypes.FETCH_COMPANIES])(state);

  const isLoading: boolean =
    isLoading_fetchFocuses || focusesAreStale ||
    isLoading_fetchUserFocuses || userFocusesAreStale ||
    isLoading_fetchCompanies || companiesAreStale;
  const errors_breaking: string[] = [...errors_fetchFocuses, ...errors_fetchUserFocuses, ...errors_fetchCompanies];

  return {
    user,
    company,
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

    companiesAreStale,
    isLoading_fetchCompanies,
    errors_fetchCompanies,

    isLoading,
    errors_breaking,
  };
};
const mapDispatchToProps = { updateUser, fetchFocuses, fetchUserFocuses, updateUserFocuses, fetchCompanies };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class MyProfileVolunteer extends React.Component<Props, OwnState> {
  state = { basicFields: {} };

  public componentDidMount(): void {
    if (this.props.focusesAreStale && !this.props.isLoading_fetchFocuses) {
      this.props.fetchFocuses();
    }
    if (this.props.userFocusesAreStale && !this.props.isLoading_fetchUserFocuses) {
      this.props.fetchUserFocuses();
    }
    if (this.props.companiesAreStale && !this.props.isLoading_fetchCompanies) {
      this.props.fetchCompanies();
    }

    this.setState({
      basicFields: this._getInitialBasicFields(),
    });
  }

  public componentDidUpdate(): void {
    // console.log(this.state.focusFields);
  }

  private _getInitialBasicFields(): any {
    const {
      profile_img_src,
      title
    } = this.props.user;

    return {
      profile_img_src,
      title
    };
  }

  private _getInitialDisabledFields(): any {
    const {
      email,
    } = this.props.user;

    const {
      name: companyName
    } = this.props.company;

    return {
      email,
      companyName,
    };
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
  }
  
  private _renderImg(profileImgSrc: string): JSX.Element {
    return (
      <div className="my-profile__img-container">
        <img className='my-profile__img' src={profileImgSrc} alt="Profile Picture" />
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
        <h2 className="heading-secondary">{`My Profile (Representative)`}</h2>
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
          <MyProfileRepresentativeFormBasic
            form="updateBasicRepresentativeFields"
            initialValues={ {...this._getInitialBasicFields(), ...this._getInitialDisabledFields()} }
            updateBasicFields={this._updateBasicFieldsState}
          />
        </div>

          <button onClick={() => this._onSaveChanges()}>Save Changes</button>
      </div>
    );
  }
}

export default connector(MyProfileVolunteer);
