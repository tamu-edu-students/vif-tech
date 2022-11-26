import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Usertype } from 'Shared/enums';

import AllowlistSubgroupPrimaryContact from './AllowlistSubgroup/AllowlistSubgroupPrimaryContact';
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
  entryUsertype: Usertype;
  company_id?: number;
  showsPrimaryContact?: boolean;
  showsEmails?: boolean;
  showsDomains?: boolean;
  primaryContact?: AllowlistEmail | null;
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
      entryUsertype,
      company_id,
      showsPrimaryContact = false,
      showsEmails = false,
      showsDomains = false,
      primaryContact = null,
      allowlist_emails = [],
      allowlist_domains = [],
    } = this.props;

    return (
      <div className="allowlist">
        <h2 className="heading-secondary">Title: {title}</h2>
        { showsPrimaryContact &&
          <AllowlistSubgroupPrimaryContact
            parentTitle={title}
            entry={primaryContact}
            usertype={entryUsertype}
            onSubmit={() => {}}
            onDelete={() => {}}
            company_id={company_id}
          />
        }

        { showsEmails && (
          <AllowlistSubgroupEmails
            parentTitle={title}
            entries={allowlist_emails}
            usertype={entryUsertype}
            onSubmit={() => {}}
            onDelete={() => {}}
            company_id={company_id}
          />
        )}
        
        { showsDomains && (
          <AllowlistSubgroupDomains
            parentTitle={title}
            entries={allowlist_domains}
            usertype={entryUsertype}
            onSubmit={() => {}}
            onDelete={() => {}}
            company_id={company_id}
          />
        )}
      </div>
    );
  }
}

export default connector(Allowlist);
