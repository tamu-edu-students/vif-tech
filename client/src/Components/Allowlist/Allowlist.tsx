import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { allowlistActionTypes } from 'Store/actions/types';
import {
  createAllowlistEmail,
  createAllowlistDomain,
  deleteAllowlistEmail,
  deleteAllowlistDomain,
} from "Store/actions";

import { Usertype } from 'Shared/enums';
import AllowlistEmail from 'Shared/entityClasses/AllowlistEmail';
import AllowlistDomain from 'Shared/entityClasses/AllowlistDomain';

import AllowlistSubgroupPrimaryContact from './AllowlistSubgroup/AllowlistSubgroupPrimaryContact';
import AllowlistSubgroupEmails from './AllowlistSubgroup/AllowlistSubgroupEmails';
import AllowlistSubgroupDomains from './AllowlistSubgroup/AllowlistSubgroupDomains';


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

interface OwnState {
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  const title = ownProps.title;
  const actionOptions = [
    allowlistActionTypes.CREATE_ALLOWLIST_EMAIL,
    allowlistActionTypes.CREATE_ALLOWLIST_DOMAIN,
    allowlistActionTypes.DELETE_ALLOWLIST_EMAIL,
    allowlistActionTypes.DELETE_ALLOWLIST_DOMAIN,
  ].map((option: string) => title+option);
  return {
    isLoading: createLoadingSelector(actionOptions)(state),
    errors: createErrorMessageSelector(actionOptions)(state),
  };
};
const mapDispatchToProps = {
  createAllowlistEmail,
  createAllowlistDomain,
  deleteAllowlistEmail,
  deleteAllowlistDomain,
}
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class Allowlist extends React.Component<Props, OwnState> {
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

    if (this.props.isLoading) {
      return (
        <div>{`Loading ${title} Allowlist...`}</div>
      );
    }

    if (this.props.errors.length > 0) {
      this.props.errors.forEach((error: string) => console.error(error));
    }

    return (
      <div className="allowlist">
        <h2 className="heading-secondary">Title: {title}</h2>
        { showsPrimaryContact &&
          <AllowlistSubgroupPrimaryContact
            parentTitle={title}
            entry={primaryContact}
            entryUsertype={entryUsertype}
            onSubmit={() => {this.setState({ isLoaded: false })}}
            onDelete={() => {this.setState({ isLoaded: false })}}
            company_id={company_id}
          />
        }

        { showsEmails && (
          <AllowlistSubgroupEmails
            parentTitle={title}
            entries={allowlist_emails}
            entryUsertype={entryUsertype}
            onSubmit={() => {this.setState({ isLoaded: false })}}
            onDelete={() => {this.setState({ isLoaded: false })}}
            company_id={company_id}
          />
        )}
        
        { showsDomains && (
          <AllowlistSubgroupDomains
            parentTitle={title}
            entries={allowlist_domains}
            entryUsertype={entryUsertype}
            onSubmit={() => {this.setState({ isLoaded: false })}}
            onDelete={() => {this.setState({ isLoaded: false })}}
            company_id={company_id}
          />
        )}
      </div>
    );
  }
}

export default connector(Allowlist);
