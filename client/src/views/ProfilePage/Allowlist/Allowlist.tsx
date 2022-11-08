import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Usertype } from '../../../shared/enums';

import AllowlistEntryForm, { OwnProps as AllowlistEntryFormProps } from './AllowlistEntryForm/AllowlistEntryForm';

import {
  createAllowlistEmail,
  createAllowlistDomain,
  deleteAllowlistEmail,
  deleteAllowlistDomain,
  fetchCompanies,
  showModal,
  hideModal,
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
  showModal,
  hideModal,
}
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class Allowlist extends React.Component<Props, {}> {
  private _showModal = (allowlistEntryFormProps: AllowlistEntryFormProps): void => {
    this.props.showModal((
      <AllowlistEntryForm
        {...allowlistEntryFormProps} 
        onCancel={this.props.hideModal}
      />
    ));
  }

  private _renderEmails(allowlist_emails: AllowlistEmail[]): JSX.Element[] {
    return allowlist_emails.map(({email, id}: AllowlistEmail) => (
      <li className="allowlist__entry" key={id}>
        <p>{email}</p>
        <button
          onClick={() => {
            this.props.deleteAllowlistEmail(id)
            .then(() => {
              if (this.props.usertype === Usertype.REPRESENTATIVE) {
                this.props.fetchCompanies();
              }
            });
          }}
        >
          Delete
        </button>
      </li>
    ));
  }

  private _renderDomains(allowlist_domains: AllowlistDomain[]): JSX.Element[] {
    return allowlist_domains.map(({email_domain, id}: AllowlistDomain) => (
      <li className="allowlist__entry" key={id}>
        @{email_domain}
        <button
          onClick={() => {
            this.props.deleteAllowlistDomain(id)
            .then(() => {
              if (this.props.usertype === Usertype.REPRESENTATIVE) {
                this.props.fetchCompanies();
              }
            });
          }}
        >
          Delete
        </button>
      </li>
    ));
  }
  
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
      email_domain: formValues.domain,
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
        <div className="allowlist__group allowlist__group--primary-contacts">
          <h3 className="heading-tertiary">primary contacts</h3>
          <ul>
            {this._renderEmails(primaryContacts)}
          </ul>
        <button
          onClick={() => this._showModal({
            onSubmit: this._onSubmitPrimaryContact,
            name: `email`,
            id: `email`,
            label: "Primary Contact",
            form: "createPrimaryContact",
            }
          )}>
            Add Primary Contact
          </button>
        </div>
        )}
        { showsEmails && (
        <div className="allowlist__group allowlist__group--emails">
          <h3 className="heading-tertiary">personal emails</h3>
          <ul>
            {this._renderEmails(allowlist_emails)}
          </ul>
          <button
            onClick={() => this._showModal({
              onSubmit: this._onSubmitEmail,
              name: `email`,
              id: `email`,
              label: "Email",
              form: "createEmail",
          })}>
            Add Email
          </button>
        </div>
        )}
        
        { showsDomains && (
        <div className="allowlist__group allowlist__group--domains">
          <h3 className="heading-tertiary">domains</h3>
          <ul>
            {this._renderDomains(allowlist_domains)}
          </ul>
          <button
            onClick={() => this._showModal({
              onSubmit: this._onSubmitDomain,
              name: `domain`,
              id: `domain`,
              label: "Domain",
              form: "createDomain",
            })}>
            Add Domain
          </button>
        </div>
        )}
      </div>
    );
  }
}

export default connector(Allowlist);
