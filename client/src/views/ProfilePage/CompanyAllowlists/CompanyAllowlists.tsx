import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, Link } from "react-router-dom";

import Allowlist from '../Allowlist/Allowlist';

import {
  fetchCompanies,
} from '../../../store/actions';

interface ICompanyAllowlistsProps {
  fetchCompanies?: any;
  companies: any;
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

  private _renderAllowlists(): JSX.Element {
    return this.props.companies.map(({ allowlist_emails=[], allowlist_domains=[], id: company_id, name }: any) => (
      <React.Fragment key={company_id}>
        <Allowlist
          title={name}
          showsPrimaryContact
          showsEmails
          showsDomains
          primaryContact={ allowlist_emails.find((email: any) => email.is_primary_contact === true) }
          emails={allowlist_emails}
          domains={allowlist_domains}
        />
      </React.Fragment>
    ));
  }

  public render(): React.ReactElement<ICompanyAllowlistsProps> {
    if (!this.state.isLoaded) {
      return (
        <div>Loading CompanyAllowlists...</div>
      )
    }

    return (
      <div>
        <h2>CompanyAllowlists</h2>
        { this._renderAllowlists() }
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    companies: state.companies,
  };
}

export default connect(mapStateToProps, { fetchCompanies })(CompanyAllowlists);
