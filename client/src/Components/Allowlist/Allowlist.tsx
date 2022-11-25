import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Usertype } from 'Shared/enums';

import AllowlistSubgroupPrimaryContacts from './AllowlistSubgroup/AllowlistSubgroupPrimaryContacts';
import AllowlistSubgroupEmails from './AllowlistSubgroup/AllowlistSubgroupEmails';
import AllowlistSubgroupDomains from './AllowlistSubgroup/AllowlistSubgroupDomains';

import {
  createAllowlistEmail,
  createAllowlistDomain,
  deleteAllowlistEmail,
  deleteAllowlistDomain,
} from "Store/actions";
import AllowlistEmail from 'Shared/entityClasses/AllowlistEmail';
import AllowlistDomain from 'Shared/entityClasses/AllowlistDomain';

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
}
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class Allowlist extends React.Component<Props, {}> {
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
          <AllowlistSubgroupPrimaryContacts
            parentTitle={title}
            entries={primaryContacts}
            usertype={usertype}
            onSubmit={() => {}}
            onDelete={() => {}}
            company_id={this.props.company_id}
          />
        }

        { showsEmails && (
          <AllowlistSubgroupEmails
            parentTitle={title}
            entries={allowlist_emails}
            usertype={usertype}
            onSubmit={() => {}}
            onDelete={() => {}}
            company_id={this.props.company_id}
          />
        )}
        
        { showsDomains && (
          <AllowlistSubgroupDomains
            parentTitle={title}
            entries={allowlist_domains}
            usertype={usertype}
            onSubmit={() => {}}
            onDelete={() => {}}
            company_id={this.props.company_id}
          />
        )}
      </div>
    );
  }
}

export default connector(Allowlist);
