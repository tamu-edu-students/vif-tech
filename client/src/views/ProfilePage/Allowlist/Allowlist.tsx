import React from 'react';
import { connect } from 'react-redux';

import { Usertype } from '../../../shared/enums';

import AllowlistEntryForm from './AllowlistEntryForm/AllowlistEntryForm';

import { createAllowlistEmail, createAllowlistDomain, fetchCompanies } from "../../../store/actions";

interface IAllowlistProps {
  title: string;
  usertype: Usertype;
  company_id?: number;
  showsPrimaryContacts?: boolean;
  showsEmails?: boolean;
  showsDomains?: boolean;
  primaryContacts?: AllowlistEmail[];
  allowlist_emails?: AllowlistEmail[];
  allowlist_domains?: AllowlistDomain[];

  createAllowlistEmail?: any;
  createAllowlistDomain?: any;
  fetchCompanies?: any;
}

class Allowlist extends React.Component<IAllowlistProps, {}> {
  private _renderEmails(allowlist_emails: AllowlistEmail[]): JSX.Element[] {
    return allowlist_emails.map(({email, id}: AllowlistEmail) => (
      <li key={id}>{email}</li>
    ));
  }

  private _renderDomains(allowlist_domains: AllowlistDomain[]): JSX.Element[] {
    return allowlist_domains.map(({email_domain, id}: AllowlistDomain) => (
      <li key={id}>@{email_domain}</li>
    ));
  }

  _onSubmitEmail = (formValues: any) => {
    this.props.createAllowlistEmail({
      email: formValues[`email-${this.props.company_id}`],
      usertype: this.props.usertype,
      company_id: this.props.company_id,
    })
    .then(() => {
      if (this.props.usertype === Usertype.REPRESENTATIVE) {
        this.props.fetchCompanies();
      }
    });
  }

  _onSubmitDomain = (formValues: any) => {
    this.props.createAllowlistDomain({
      email_domain: formValues[`email_domain-${this.props.company_id}`],
      usertype: this.props.usertype,
      company_id: this.props.company_id,
    })
    .then(() => {
      if (this.props.usertype === Usertype.REPRESENTATIVE) {
        this.props.fetchCompanies();
      }
    });
  }

  _onSubmitPrimaryContact = (formValues: any) => {
    this.props.createAllowlistEmail({
      email: formValues[`email-primary-${this.props.company_id}`],
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

  public render(): React.ReactElement<IAllowlistProps> {
    const {
      title,
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
        { showsPrimaryContacts && (
        <div className="allowlist_group allowlist_group--primary-contacts">
          <h3 className="heading-tertiary">primary contacts</h3>
          <ul>
            {this._renderEmails(primaryContacts)}
          </ul>
          <AllowlistEntryForm
            onSubmit={this._onSubmitPrimaryContact}
            name={`email-primary-${this.props.company_id}`}
            id={`email-primary-${this.props.company_id}`}
            buttonLabel="Add Primary Contact"
          />
        </div>
        )}
        { showsEmails && (
        <div className="allowlist_group allowlist_group--emails">
          <h3 className="heading-tertiary">personal emails</h3>
          <ul>
            {this._renderEmails(allowlist_emails)}
          </ul>
          <AllowlistEntryForm
            onSubmit={this._onSubmitEmail}
            name={`email-${this.props.company_id}`}
            id={`email-${this.props.company_id}`}
            buttonLabel="Add Email"
          />
        </div>
        )}
        
        { showsDomains && (
        <div className="allowlist_group allowlist_group--domains">
          <h3 className="heading-tertiary">domains</h3>
          <ul>
            {this._renderDomains(allowlist_domains)}
          </ul>
          
          <AllowlistEntryForm
            onSubmit={this._onSubmitDomain}
            name={`email_domain-${this.props.company_id}`}
            id={`email_domain-${this.props.company_id}`}
            buttonLabel="Add Domain"
          />
        </div>
        )}
      </div>
    );
  }
}

export default connect(null, { createAllowlistEmail, createAllowlistDomain, fetchCompanies })(Allowlist);
