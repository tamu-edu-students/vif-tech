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
}

const mapStateToProps = (state: IRootState) => {
  return {
    allowlist_emails: state.allowlist.allowlist_emails.filter((allowlist_email: AllowlistEmail) => allowlist_email.usertype === Usertype.STUDENT),
    allowlist_domains: state.allowlist.allowlist_domains.filter((allowlist_domain: AllowlistDomain) => allowlist_domain.usertype === Usertype.STUDENT),
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

class StudentAllowlist extends React.Component<Props, OwnState> {
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
        <div>Loading StudentAllowlist...</div>
      );
    }

    const {
      allowlist_emails,
      allowlist_domains,
    } = this.props;

    return (
      <div>
        <h2>StudentAllowlist</h2>
        <br />
        <div className="allowlists" data-testid="admin-student-allowlists">
          <Allowlist
            title="Students"
            usertype={Usertype.STUDENT}
            showsDomains
            allowlist_emails={allowlist_emails}
            allowlist_domains={allowlist_domains}
          />
        </div>
      </div>
    )
  }
}

export default connector(StudentAllowlist);
