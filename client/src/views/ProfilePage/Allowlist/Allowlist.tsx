import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Usertype } from '../../../shared/enums';

import AllowlistSubgroup from './AllowlistSubgroup/AllowlistSubgroup';

import {
  createAllowlistEmail,
  createAllowlistDomain,
  deleteAllowlistEmail,
  deleteAllowlistDomain,
  fetchCompanies,
} from "../../../store/actions";

interface OwnProps {
  title: string;
  usertype: Usertype;
  company_id?: number;
  showsPrimaryContacts?: boolean;
  showsEmails?: boolean;
  showsDomains?: boolean;
  primaryContacts?: AllowlistEmail[];
  allowlist_emails?: AllowlistEmail[];
  allowlist_domains?: AllowlistDomain[];
}

const mapStateToProps = null;
const mapDispatchToProps = {
  createAllowlistEmail,
  createAllowlistDomain,
  deleteAllowlistEmail,
  deleteAllowlistDomain,
  fetchCompanies,
}
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class Allowlist extends React.Component<Props, {}> {
  private _onSubmitPrimaryContact = (formValues: any) => {
    this.props.createAllowlistEmail({
      email: formValues.email,
      usertype: this.props.usertype,
      company_id: this.props.company_id,
      isPrimaryContact: true,
    })
    .then(() => {
      if (this.props.usertype === Usertype.REPRESENTATIVE) {
        this.props.fetchCompanies();
      }
    });
  }

  private _onSubmitEmail = (formValues: any) => {
    this.props.createAllowlistEmail({
      email: formValues.email,
      usertype: this.props.usertype,
      company_id: this.props.company_id,
    })
    .then(() => {
      if (this.props.usertype === Usertype.REPRESENTATIVE) {
        this.props.fetchCompanies();
      }
    });
  }

  private _onSubmitDomain = (formValues: any) => {
    this.props.createAllowlistDomain({
      email_domain: formValues.email_domain,
      usertype: this.props.usertype,
      company_id: this.props.company_id,
    })
    .then(() => {
      if (this.props.usertype === Usertype.REPRESENTATIVE) {
        this.props.fetchCompanies();
      }
    });
  }

  public render(): React.ReactElement<Props> {
    const {
      title,
      usertype,
      showsPrimaryContacts,
      showsEmails,
      showsDomains,
      primaryContacts=[],
      allowlist_emails = [],
      allowlist_domains = [],
    } = this.props;

    return (
      <div className="allowlist">
        <h2 className="heading-secondary">Title: {title}</h2>
        { showsPrimaryContacts &&
          <AllowlistSubgroup
            heading="Primary Contacts"
            entries={allowlist_emails}
            usertype={usertype}
            onSubmit={this._onSubmitEmail}
            onDelete={this.props.deleteAllowlistEmail}
            name="email"
            isPrimaryContact={true}
          />
        }

        { showsEmails && (
          <AllowlistSubgroup
            heading="Personal Emails"
            entries={primaryContacts}
            usertype={usertype}
            onSubmit={this._onSubmitPrimaryContact}
            onDelete={this.props.deleteAllowlistEmail}
            name="email"
            isPrimaryContact={false}
          />
        )}
        
        { showsDomains && (
          <AllowlistSubgroup
            heading="Domains"
            entries={allowlist_domains}
            usertype={usertype}
            onSubmit={this._onSubmitDomain}
            onDelete={this.props.deleteAllowlistDomain}
            name="email_domain"
          />
        )}
      </div>
    );
  }
}

export default connector(Allowlist);
