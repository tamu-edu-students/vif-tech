import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { allowlistActionTypes } from 'Store/actions/types';
import {
  fetchAllowlist,
} from 'Store/actions';

import { Usertype } from 'Shared/enums';
import AllowlistEmail from 'Shared/entityClasses/AllowlistEmail';
import AllowlistDomain from 'Shared/entityClasses/AllowlistDomain';
import Company from 'Shared/entityClasses/Company';

import Allowlist from 'Components/Allowlist/Allowlist';


interface OwnProps {
  entryUsertype: Usertype;
  showsPrimaryContact?: boolean;
  showsEmails?: boolean;
  showsDomains?: boolean;
}

type GenericAllowlistsProps = {
  companies?: never;
}

type CompanyAllowlistsProps = {
  entryUsertype: Usertype.REPRESENTATIVE;
  companies: Company[];
}

interface OwnState {
}

const mapStateToProps = (state: IRootState, ownProps: OwnProps & (GenericAllowlistsProps | CompanyAllowlistsProps)) => {
  return {
    allowlist_emails: AllowlistEmail.filterByUsertype(ownProps.entryUsertype, state.allowlist.allowlist_emails),
    allowlist_domains: AllowlistDomain.filterByUsertype(ownProps.entryUsertype, state.allowlist.allowlist_domains),

    allowlistIsStale: state.allowlist.isStale,
    isLoading_fetchAllowlist: createLoadingSelector([allowlistActionTypes.FETCH_ALLOWLIST])(state),
    errors_fetchAllowlist: createErrorMessageSelector([allowlistActionTypes.FETCH_ALLOWLIST])(state),
  };
}
const mapDispatchToProps = {
  fetchAllowlist,
};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps & (GenericAllowlistsProps | CompanyAllowlistsProps);

class GenericAllowlistSubview extends React.Component<Props, OwnState> {
  public componentDidMount(): void {
    if (this.props.allowlistIsStale && !this.props.isLoading_fetchAllowlist) {
      this.props.fetchAllowlist();
    }
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<OwnState>, snapshot?: any): void {
    if (this.props.allowlistIsStale && !this.props.isLoading_fetchAllowlist) {
      this.props.fetchAllowlist();
    }
  }

  private _renderCompanyAllowlists(companies: Company[]): JSX.Element[] {
    return companies.map((company: Company) => {
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

  private _generateTitle(): string {
    switch(this.props.entryUsertype) {
      case Usertype.STUDENT: return 'Students';
      case Usertype.VOLUNTEER: return 'Volunteers';
      case Usertype.ADMIN: return 'Admins';
      default:
        throw new Error(`ERROR: Invalid user type "${this.props.entryUsertype}" while generating allowlist title`)
    }
  }

  public render(): React.ReactElement<Props> {
    if (this.props.allowlistIsStale || this.props.isLoading_fetchAllowlist) {
      return (
        <div>Loading Allowlist...</div>
      );
    }
    
    if (this.props.errors_fetchAllowlist.length > 0) {
      this.props.errors_fetchAllowlist.forEach((error: string) => console.error(error));
      return (
        <div className='error'>{this.props.errors_fetchAllowlist}</div>
      );
    }

    const {
      entryUsertype,
      showsPrimaryContact,
      showsEmails,
      showsDomains,
      allowlist_emails,
      allowlist_domains,
      companies,
    } = this.props;
    
    return (
      <div>
        <div className="allowlists">
          {
            companies
            ? this._renderCompanyAllowlists(companies)
            : (
              <Allowlist
                title={this._generateTitle()}
                entryUsertype={entryUsertype}
                showsPrimaryContact={showsPrimaryContact}
                showsEmails={showsEmails}
                showsDomains={showsDomains}
                allowlist_emails={allowlist_emails}
                allowlist_domains={allowlist_domains}
              />
            )
          }
        </div>
      </div>
    )
  }
}

export default connector(GenericAllowlistSubview);
