import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Usertype } from 'Shared/enums';

import GenericAllowlistSubview from 'Components/GenericAllowlistSubview/GenericAllowlistSubview';

interface OwnProps {
}

const mapStateToProps = null;
const mapDispatchToProps = {};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class AdminAllowlist extends React.Component<Props, {}> {
  public render(): React.ReactElement<Props> {
    return (
      <GenericAllowlistSubview
        title="Admins"
        usertype={Usertype.ADMIN}
        showsEmails
      />
    )
  }
}

export default connector(AdminAllowlist);
