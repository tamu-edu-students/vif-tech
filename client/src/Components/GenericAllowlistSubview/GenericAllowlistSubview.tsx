import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Usertype } from 'Shared/enums';

import Allowlist from 'Components/Allowlist/Allowlist';

import {
  fetchAllowlist,
  showModal,
  hideModal,
} from 'Store/actions';
import { IRootState } from 'Store/reducers';

interface OwnProps {
  usertype: Usertype;
  showsEmails?: boolean;
  showsDomains?: boolean;
  title: string;
}

const mapStateToProps = (state: IRootState, ownProps: OwnProps) => {
  return {
    allowlist_emails: state.allowlist.allowlist_emails.filter((allowlist_email: AllowlistEmail) => allowlist_email.usertype === ownProps.usertype),
    allowlist_domains: state.allowlist.allowlist_domains.filter((allowlist_domain: AllowlistDomain) => allowlist_domain.usertype === ownProps.usertype),
  };
}
const mapDispatchToProps = {
  fetchAllowlist,
  showModal,
  hideModal,
};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

interface OwnState {
  isLoaded: boolean;
}

class AdminAllowlist extends React.Component<Props, OwnState> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  public componentDidMount(): void {
    this.setState({ isLoaded: false });
    this.props.fetchAllowlist().then(() => this.setState({ isLoaded: true }));
  }

  public render(): React.ReactElement<Props> {
    if (!this.state.isLoaded) {
      return (
        <div>Loading {this.props.title}Allowlist...</div>
      );
    }

    const {
      usertype,
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
        <div className="allowlists" data-testid={`admin-${usertype}-allowlists`}>
          <Allowlist
            title={title}
            usertype={usertype}
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

export default connector(AdminAllowlist);
