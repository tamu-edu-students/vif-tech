import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { userActionTypes, companyActionTypes } from 'Store/actions/types';
import { updateUser, fetchFocuses, fetchUserFocuses, updateUserFocuses, fetchCompanies } from 'Store/actions';

import User from 'Shared/entityClasses/User';
import Company from 'Shared/entityClasses/Company';

import MyProfileRepresentativeFormBasic from './MyProfileRepresentativeFormBasic/MyProfileRepresentativeFormBasic';


interface OwnProps {
}

interface OwnState {
  basicFields: any;
  isLoading: boolean;
}

const mapStateToProps = (state: IRootState) => {
  const user: User = state.auth.user as User;
  const company: Company = user.findCompany(state.companyData.companies) as Company;

  const isLoading_updateUser: boolean = createLoadingSelector([userActionTypes.UPDATE_USER])(state);
  const errors_updateUser: string[] = createErrorMessageSelector([userActionTypes.UPDATE_USER])(state);

  const companiesAreStale = state.companyData.isStale;
  const isLoading_fetchCompanies: boolean = createLoadingSelector([companyActionTypes.FETCH_COMPANIES])(state);
  const errors_fetchCompanies: string[] = createErrorMessageSelector([companyActionTypes.FETCH_COMPANIES])(state);

  const isLoading: boolean = isLoading_fetchCompanies || companiesAreStale;
  const errors_breaking: string[] = [...errors_fetchCompanies];

  return {
    user,
    company,

    isLoading_updateUser,
    errors_updateUser,

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
  state = { basicFields: {}, isLoading: false };

  public componentDidMount(): void {
    const promises: Promise<void>[] = []
    if (this.props.companiesAreStale && !this.props.isLoading_fetchCompanies) {
      promises.push(this.props.fetchCompanies());
    }

    Promise.allSettled(promises).then(() => {
      this._reloadFieldsState();
    });
  }

  public componentDidUpdate(): void {
    if (this.props.companiesAreStale && !this.props.isLoading_fetchCompanies) {
      this.props.fetchCompanies();
    }
  }

  private _reloadFieldsState = (): void => {
    this.setState({
      isLoading: false,
      basicFields: this._getInitialBasicFields()
    });
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
    this.setState({ isLoading: true });
    this.props.updateUser(this.props.user?.id ?? -1, this.state.basicFields)
    .then(() => {
      this._reloadFieldsState();
    });
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
      <div className="my-profile">
        <div className="my-profile__img-container">
          {profile_img_src &&  this._renderImg(profile_img_src)}
        </div>

        <div className="my-profile__name">{`${firstname} ${lastname}`}</div>

        <MyProfileRepresentativeFormBasic
          form="updateBasicRepresentativeFields"
          initialValues={ {...this._getInitialBasicFields(), ...this._getInitialDisabledFields()} }
          updateBasicFields={this._updateBasicFieldsState}
        />

        <button className="btn-wire btn-wire--small" onClick={() => this._onSaveChanges()}>Save Changes</button>
      </div>
    );
  }
}

export default connector(MyProfileVolunteer);
