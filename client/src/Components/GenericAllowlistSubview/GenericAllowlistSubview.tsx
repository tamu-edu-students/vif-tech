import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { allowlistActionTypes } from 'Store/actions/types';
import {
  fetchAllowlist,
  showModal,
  hideModal,
} from 'Store/actions';

import { Usertype } from 'Shared/enums';
import AllowlistEmail from 'Shared/entityClasses/AllowlistEmail';
import AllowlistDomain from 'Shared/entityClasses/AllowlistDomain';

import Allowlist from 'Components/Allowlist/Allowlist';


interface OwnProps {
  entryUsertype: Usertype;
  showsEmails?: boolean;
  showsDomains?: boolean;
  title: string;
}

interface OwnState {
}

const mapStateToProps = (state: IRootState, ownProps: OwnProps) => {
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
  showModal,
  hideModal,
};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

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

  public render(): React.ReactElement<Props> {
    if (this.props.allowlistIsStale || this.props.isLoading_fetchAllowlist) {
      return (
        <div>Loading {this.props.title}Allowlist...</div>
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
      showsEmails,
      showsDomains,
      title,
      allowlist_emails,
      allowlist_domains,
    } = this.props;
    
    return (
      <div>
        <h2>{title}Allowlist</h2>
        <br />
        <div className="allowlists" data-testid={`admin-${entryUsertype}-allowlists`}>
          <Allowlist
            title={title}
            entryUsertype={entryUsertype}
            showsEmails={showsEmails}
            showsDomains={showsDomains}
            allowlist_emails={allowlist_emails}
            allowlist_domains={allowlist_domains}
          />
        </div>
      </div>
    )
  }
}

export default connector(GenericAllowlistSubview);
