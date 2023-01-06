import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { companyActionTypes, userActionTypes } from 'Store/actions/types';
import {
  fetchCompanies,
  createCompany,
  showModal,
  hideModal,
  fetchUsers,
} from 'Store/actions';

import { Usertype } from 'Shared/enums';
import Company from 'Shared/entityClasses/Company';

import AllowlistGroup from 'Components/AllowlistGroup/AllowlistGroup';
import CompanyForm from './CompanyForm/CompanyForm';

interface OwnProps {
}

interface OwnState {
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  const companiesAreStale: boolean = state.companyData.isStale;
  const usersAreStale: boolean = state.userData.isStale;
  const company_id: number | undefined = state.auth.user?.company_id;
  return {
    companies: company_id ? [Company.findById(company_id, state.companyData.companies) as Company] : state.companyData.companies,
    usertype: state.auth.user?.usertype,
    allowlist_emails: state.allowlist.allowlist_emails,
    allowlist_domains: state.allowlist.allowlist_domains,

    companiesAreStale,
    usersAreStale,
    dataIsLoaded: !(companiesAreStale || usersAreStale),
    isLoading_fetchCompanies: createLoadingSelector([companyActionTypes.FETCH_COMPANIES])(state),
    isLoading_fetchUsers: createLoadingSelector([userActionTypes.FETCH_USERS])(state),
    errors_fetch: createErrorMessageSelector([companyActionTypes.FETCH_COMPANIES, userActionTypes.FETCH_USERS])(state),
  };
}
const mapDispatchToProps = {
  fetchCompanies,
  createCompany,
  showModal,
  hideModal,
  fetchUsers
};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class CompanyAllowlistGroup extends React.Component<Props, OwnState> {
  public componentDidMount(): void {
    const { companiesAreStale, isLoading_fetchCompanies, usersAreStale, isLoading_fetchUsers } = this.props;
    if (companiesAreStale && !isLoading_fetchCompanies) { this.props.fetchCompanies(); }
    if (usersAreStale && !isLoading_fetchUsers) { this.props.fetchUsers(); }
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<OwnState>, snapshot?: any): void {
    const { companiesAreStale, isLoading_fetchCompanies, usersAreStale, isLoading_fetchUsers } = this.props;
    if (companiesAreStale && !isLoading_fetchCompanies) { this.props.fetchCompanies(); }
    if (usersAreStale && !isLoading_fetchUsers) { this.props.fetchUsers(); }
  }

  private _renderForm = (): void => {
    this.props.showModal((
      <CompanyForm
        form="createCompany"
        onSubmit={this._onCompanySubmit}
        onCancel={this.props.hideModal}
      />
    ))
  }

  private _renderAllowlists(): JSX.Element {
    return (
      <AllowlistGroup
        entryUsertype={Usertype.REPRESENTATIVE}
        companies={
          this.props.companies
          .sort((a: Company, b: Company) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        }
      />
    );
  }

  private _onCompanySubmit = (formValues: any) => {
    this.props.createCompany(formValues)
      .then(() => this.props.hideModal())
      .catch((err: Error) => {
        console.error(err.message);
      });
  }

  public render(): React.ReactElement<Props> {
    if (!this.props.dataIsLoaded) {
      return (
        <div>{`Loading CompanyAllowlist${this.props.usertype === Usertype.ADMIN ? 's' : ''}...`}</div>
      );
    }

    if (this.props.errors_fetch.length > 0) {
      this.props.errors_fetch.forEach((error: string) => console.error(error));
      return (
        <div className='error'>{this.props.errors_fetch}</div>
      );
    }

    const {
      companies,
      usertype,
    } = this.props;

    return (
      <div className="company-allowlist-group">
        {
          companies.length > 0
          ? (<>{ this._renderAllowlists() }</>)
          : (<p>No companies yet!</p>)
        }
        {
          usertype === Usertype.ADMIN &&
          <button className="btn-wire" onClick={this._renderForm}>Add New Company</button>
        }
      </div>
    )
  }
}

export default connector(CompanyAllowlistGroup);
