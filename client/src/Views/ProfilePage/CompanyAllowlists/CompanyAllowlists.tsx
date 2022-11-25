import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Usertype } from 'Shared/enums';

import Allowlist from 'Components/Allowlist/Allowlist';
import CompanyForm from './CompanyForm/CompanyForm';

import {
  fetchCompanies,
  createCompany,
  showModal,
  hideModal,
  fetchAllowlist,
} from 'Store/actions';
import { IRootState } from 'Store/reducers';
import Company from 'Shared/entityClasses/Company';
import AllowlistEmail from 'Shared/entityClasses/AllowlistEmail';

interface OwnProps {
}

const mapStateToProps = (state: IRootState) => {
  return {
    companies: state.companies,

    allowlist_emails: state.allowlist.allowlist_emails,
    allowlist_domains: state.allowlist.allowlist_domains,
  };
}
const mapDispatchToProps = {
  fetchCompanies,
  createCompany,
  showModal,
  hideModal,
  fetchAllowlist,
};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

interface OwnState {
  isLoaded: boolean;
}

class CompanyAllowlists extends React.Component<Props, OwnState> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  public componentDidMount(): void {
    (async () => {
      this.setState({ isLoaded: false });
      await this.props.fetchCompanies();
      await this.props.fetchAllowlist();
      this.setState({ isLoaded: true });
    })();
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
    return this.props.companies.map((company: Company) => {
      const { id: company_id, name, } = company;
      const [primaryContact, allowlist_emails, allowlist_domains] = [
        company.findPrimaryContact(),
        company.findAllowlistEmails(),
        company.findAllowlistDomains(),
      ];
      
      return (
        <React.Fragment key={company_id}>
          <Allowlist
            title={name}
            usertype={Usertype.REPRESENTATIVE}
            company_id={company_id}
            showsPrimaryContact
            showsEmails
            showsDomains
            primaryContact={primaryContact}
            allowlist_emails={allowlist_emails.filter((allowlist_email: AllowlistEmail) => !allowlist_email.isPrimaryContact)}
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
    if (!this.state.isLoaded) {
      return (
        <div>Loading CompanyAllowlists...</div>
      );
    }

    const {
      companies
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
        <button onClick={this._renderForm}>Add New Company</button>
      </div>
    )
  }
}

export default connector(CompanyAllowlists);
