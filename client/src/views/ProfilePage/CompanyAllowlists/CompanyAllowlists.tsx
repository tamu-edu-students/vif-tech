import React from 'react';
import { connect } from 'react-redux';

import { Usertype } from '../../../shared/enums';

import Allowlist from '../Allowlist/Allowlist';
import CompanyForm from './CompanyForm/CompanyForm';
import Modal from '../../../components/Modal/Modal';

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
  shouldShowModal: boolean;
}

class CompanyAllowlists extends React.Component<ICompanyAllowlistsProps, ICompanyAllowlistsState> {
  public constructor(props: ICompanyAllowlistsProps) {
    super(props);
    this.state = {
      isLoaded: false,
      shouldShowModal: false,
    };
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
          usertype={Usertype.REPRESENTATIVE}
          company_id={company_id}
          showsPrimaryContacts
          showsEmails
          showsDomains
          primaryContacts={ allowlist_emails.filter((email: AllowlistEmail) => email.isPrimaryContact) }
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
        <button onClick={() => this.setState({ shouldShowModal: true })}>Add New Company</button>
        {
          this.state.shouldShowModal &&
          <Modal onDismiss={() => this.setState({ shouldShowModal: false })}>
            <CompanyForm onSubmit={this._onCompanySubmit} />
          </Modal>
        }
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
