import React from 'react';
import { connect } from 'react-redux';

interface IAllowlistProps {
  title: string;
  usertype: Usertype;
  company_id?: number;
  showsPrimaryContact?: boolean;
  showsEmails?: boolean;
  showsDomains?: boolean;
  primaryContact?: AllowlistEmail | null;
  allowlist_emails?: AllowlistEmail[];
  allowlist_domains?: AllowlistDomain[];
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

  public render(): React.ReactElement<IAllowlistProps> {
    const {
      title,
      showsPrimaryContact,
      showsEmails,
      showsDomains,
      primaryContact,
      allowlist_emails = [],
      allowlist_domains = [],
    } = this.props;

    return (
      <div className="allowlist">
        <h2 className="heading-secondary">Title: {title}</h2>
        { showsPrimaryContact && (
          <div className="allowlist_group allowlist__group--primary-contact">
            <h3 className="heading-tertiary">primary contact</h3>
            <ul>
              {
                primaryContact && (<li>{primaryContact?.email}</li>)
              }
            </ul>
          </div>
        )}
        { showsEmails && (
        <div className="allowlist_group allowlist_group--emails">
          <h3 className="heading-tertiary">personal emails</h3>
          <ul>
            {this._renderEmails(allowlist_emails)}
          </ul>
        </div>
        )}
        
        { showsDomains && (
        <div className="allowlist_group allowlist_group--domains">
          <h3 className="heading-tertiary">domains</h3>
          <ul>
            {this._renderDomains(allowlist_domains)}
          </ul>
        </div>
        )}
      </div>
    );
  }
}

export default connect()(Allowlist);
