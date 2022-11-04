import React from 'react';
import { connect } from 'react-redux';

interface IAllowlistProps {
  title: string
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
      <div key={id}>{email}</div>
    ));
  }

  private _renderDomains(allowlist_domains: AllowlistDomain[]): JSX.Element[] {
    return allowlist_domains.map(({email_domain, id}: AllowlistDomain) => (
      <div key={id}>{email_domain}</div>
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
      <div>
        Allowlist below:
        <h2>Title: {title}</h2>
        { showsPrimaryContact && <p>primary contact: {primaryContact?.email}</p> }
        { showsEmails && (
        <div>
          personal emails:
          {this._renderEmails(allowlist_emails)}
        </div>
        ) }
        
        { showsDomains && (
        <div>
          domains:
          {this._renderDomains(allowlist_domains)}
        </div>
        ) }
      </div>
    );
  }
}

export default connect()(Allowlist);
