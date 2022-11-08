import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Usertype } from '../../../shared/enums';

import Allowlist from '../Allowlist/Allowlist';
import CompanyForm from './CompanyForm/CompanyForm';

import {
  fetchCompanies,
  createCompany,
  showModal,
  hideModal,
} from '../../../store/actions';
import { IRootState } from '../../../store/reducers';

interface OwnProps {
}

const mapStateToProps = (state: IRootState) => {
  return {
    companies: state.companies,
  };
}
const mapDispatchToProps = {
  fetchCompanies,
  createCompany,
  showModal,
  hideModal,
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
    this.setState({ isLoaded: false });
    this.props.fetchCompanies().then(() => this.setState({ isLoaded: true }));
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
