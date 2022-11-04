import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, Link } from "react-router-dom";

import Allowlist from '../Allowlist/Allowlist';
import CompanyForm from './CompanyForm/CompanyForm';

import {
  fetchCompanies,
  createCompany,
} from '../../../store/actions';

interface ICompanyAllowlistsProps {
  fetchCompanies?: any;
  createCompany?: any;
  companies: Company[];
}

interface ICompanyAllowlistsState {
  isLoaded: boolean;
}

class CompanyAllowlists extends React.Component<ICompanyAllowlistsProps, ICompanyAllowlistsState> {
  public constructor(props: ICompanyAllowlistsProps) {
    super(props);
    this.state = { isLoaded: false };
  }

  public componentDidMount(): void {
    this.setState({ isLoaded: false });
    this.props.fetchCompanies().then(() => this.setState({ isLoaded: true }));
  }

  private _renderAllowlists(): JSX.Element[] {
    return this.props.companies.map(({ allowlist_emails=[], allowlist_domains=[], id: company_id, name }: any) => (
      <React.Fragment key={company_id}>
        <Allowlist
          title={name}
          showsPrimaryContact
          showsEmails
          showsDomains
          primaryContact={ allowlist_emails.find((email: AllowlistEmail) => email.isPrimaryContact) }
          allowlist_emails={allowlist_emails.filter((email: AllowlistEmail) => !email.isPrimaryContact)}
          allowlist_domains={allowlist_domains}
        />
      </React.Fragment>
    ));
  }

  private _onCompanySubmit = (formValues: any) => {
    this.props.createCompany(formValues)
    .catch((err: Error) => {
      console.error(err.message);
    });
  }

  public render(): React.ReactElement<ICompanyAllowlistsProps> {
    if (!this.state.isLoaded) {
      return (
        <div>Loading CompanyAllowlists...</div>
      );
    }

    const {
      companies
    } = this.props;

    if (this.props.companies.length === 0) {
      return (
        <div>No companies yet!</div>
      )
    }

    return (
      <div>
        <h2>CompanyAllowlists</h2>
        <br />
        <div className="allowlists">
          {
            companies.length > 0
            ? (<>{ this._renderAllowlists() }</>)
            : (<p>No companies yet!</p>)
          }
        </div>
        <CompanyForm onSubmit={this._onCompanySubmit} />
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    companies: state.companies,
  };
}

export default connect(mapStateToProps, { fetchCompanies, createCompany })(CompanyAllowlists);
