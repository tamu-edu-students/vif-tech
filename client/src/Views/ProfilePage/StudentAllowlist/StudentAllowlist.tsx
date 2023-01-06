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

class StudentAllowlist extends React.Component<Props, {}> {
  public render(): React.ReactElement<Props> {
    return (
      <GenericAllowlistSubview
        title="Students"
        entryUsertype={Usertype.STUDENT}
        showsDomains
      />
    )
  }
}

export default connector(StudentAllowlist);
