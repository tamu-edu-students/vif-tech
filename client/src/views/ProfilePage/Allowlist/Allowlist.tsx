import React from 'react';
import { connect } from 'react-redux';

interface IAllowlistProps {
  title: string
  showsPrimaryContact?: boolean;
  showsEmails?: boolean;
  showsDomains?: boolean;
  primaryContact?: any;
  emails?: any;
  domains?: any;
}

class Allowlist extends React.Component<IAllowlistProps, {}> {
  public render(): React.ReactElement<IAllowlistProps> {
    const {
      title,
      showsPrimaryContact,
      showsEmails,
      showsDomains,
      primaryContact,
      emails,
      domains,
    } = this.props;

    return (
      <div>
        Allowlist below:
        <h2>Title: {title}</h2>
        {  showsPrimaryContact && <p>primary contact: {primaryContact?.email}</p> }
        { showsEmails && <p>emails: {emails}</p> }
        { showsDomains && <p>domains: {domains}</p> }
      </div>
    );
  }
}

export default connect()(Allowlist);
