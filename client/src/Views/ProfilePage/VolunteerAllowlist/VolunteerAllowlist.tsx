import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Usertype } from 'Shared/enums';

import GenericAllowlistSubview from 'Components/AllowlistGroup/AllowlistGroup';

interface OwnProps {
}

const mapStateToProps = null;
const mapDispatchToProps = {};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class VolunteerAllowlist extends React.Component<Props, {}> {
  public render(): React.ReactElement<Props> {
    return (
      <GenericAllowlistSubview
        title="Volunteers"
        entryUsertype={Usertype.VOLUNTEER}
        showsEmails
      />
    )
  }
}

export default connector(VolunteerAllowlist);
