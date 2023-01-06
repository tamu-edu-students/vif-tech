import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { companyActionTypes, allowlistActionTypes, userActionTypes } from 'Store/actions/types';
import {
  fetchCompanies,
  createCompany,
  showModal,
  hideModal,
  fetchAllowlist,
  fetchUsers,
} from 'Store/actions';

import { Usertype } from 'Shared/enums';
import Company from 'Shared/entityClasses/Company';
import AllowlistEmail from 'Shared/entityClasses/AllowlistEmail';

import Allowlist from 'Components/Allowlist/Allowlist';

import CompanyForm from './CompanyForm/CompanyForm';

interface OwnProps {
  company_id?: number;
}

interface OwnState {
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  const companiesAreStale = state.companyData.isStale;
  const usersAreStale = state.userData.isStale;
  const allowlistIsStale = state.allowlist.isStale;
  return {
    companies: ownProps.company_id ? [Company.findById(ownProps.company_id, state.companyData.companies) as Company] : state.companyData.companies,
    usertype: state.auth.user?.usertype,
    allowlist_emails: state.allowlist.allowlist_emails,
    allowlist_domains: state.allowlist.allowlist_domains,

    companiesAreStale,
    usersAreStale,
    allowlistIsStale,
    dataIsLoaded: !(companiesAreStale || usersAreStale || allowlistIsStale),
    isLoading_fetchCompanies: createLoadingSelector([companyActionTypes.FETCH_COMPANIES])(state),
    isLoading_fetchUsers: createLoadingSelector([userActionTypes.FETCH_USERS])(state),
    isLoading_fetchAllowlist: createLoadingSelector([allowlistActionTypes.FETCH_ALLOWLIST])(state),
    errors_fetch: createErrorMessageSelector([companyActionTypes.FETCH_COMPANIES, userActionTypes.FETCH_USERS, allowlistActionTypes.FETCH_ALLOWLIST])(state),
  };
}
const mapDispatchToProps = {
  fetchCompanies,
  createCompany,
  showModal,
  hideModal,
  fetchAllowlist,
  fetchUsers
};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class CompanyAllowlists extends React.Component<Props, OwnState> {
  public componentDidMount(): void {
    const { companiesAreStale, isLoading_fetchCompanies, usersAreStale, isLoading_fetchUsers, allowlistIsStale, isLoading_fetchAllowlist } = this.props;
    if (companiesAreStale && !isLoading_fetchCompanies) { this.props.fetchCompanies(); }
    if (usersAreStale && !isLoading_fetchUsers) { this.props.fetchUsers(); }
    if (allowlistIsStale && !isLoading_fetchAllowlist) { this.props.fetchAllowlist(); }
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<OwnState>, snapshot?: any): void {
    const { companiesAreStale, isLoading_fetchCompanies, usersAreStale, isLoading_fetchUsers, allowlistIsStale, isLoading_fetchAllowlist } = this.props;
    if (companiesAreStale && !isLoading_fetchCompanies) { this.props.fetchCompanies(); }
    if (usersAreStale && !isLoading_fetchUsers) { this.props.fetchUsers(); }
    if (allowlistIsStale && !isLoading_fetchAllowlist) { this.props.fetchAllowlist(); }
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

  private _renderAllowlists(): JSX.Element[] {
    return this.props.companies
    .sort((a: Company, b: Company) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    .map((company: Company) => {
      const { id: company_id, name, } = company;
      const [primaryContact, allowlist_emails, allowlist_domains] = [
        company.findPrimaryContact(this.props.allowlist_emails),
        company.findAllowlistEmails(this.props.allowlist_emails),
        company.findAllowlistDomains(this.props.allowlist_domains),
      ];
      
      return (
        <React.Fragment key={company_id}>
          <Allowlist
            title={name}
            entryUsertype={Usertype.REPRESENTATIVE}
            company_id={company_id}
            showsPrimaryContact
            showsEmails
            showsDomains
            primaryContact={primaryContact}
            allowlist_emails={allowlist_emails.filter((allowlist_email: AllowlistEmail) => !allowlist_email.is_primary_contact)}
            allowlist_domains={allowlist_domains}
          />
        </React.Fragment>
      )
    });
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
      <div>
        <h2>CompanyAllowlists</h2>
        <br />
        <div className="allowlists" data-testid="admin-company-allowlists">
          {
            companies.length > 0
            ? (<>{ this._renderAllowlists() }</>)
            : (<p>No companies yet!</p>)
          }
        </div>
        {
          usertype === Usertype.ADMIN &&
          <button onClick={this._renderForm}>Add New Company</button>
        }
      </div>
    )
  }
}

export default connector(CompanyAllowlists);
