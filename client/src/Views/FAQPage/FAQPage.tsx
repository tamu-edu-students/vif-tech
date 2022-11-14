import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';

interface OwnProps {
}

const mapStateToProps = (state: IRootState) => {
  return {
  };
}
const mapDispatchToProps = {};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class FAQPage extends React.Component<Props, {}> {
  render(): React.ReactElement<Props> {
    return (
      <div>
        <h1 className="heading-primary">FAQ Page</h1>
      </div>
    );
  }
}

export default connector(FAQPage);
