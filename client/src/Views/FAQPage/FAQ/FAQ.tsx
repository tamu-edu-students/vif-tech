import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { updateFAQ } from 'Store/actions'
import { IRootState } from 'Store/reducers';

interface OwnProps {
  id: number;
  question: string;
  answer: string;
}

const mapStateToProps = (state: IRootState) => {
  return {
  };
}
const mapDispatchToProps = { updateFAQ };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class FAQ extends React.Component<Props, {}> {
  render(): React.ReactElement<Props> {
    const {
      question,
      answer,
    } = this.props;

    return (
      <div className="FAQ">
        <h2 className="heading-secondary FAQ__question" dangerouslySetInnerHTML={{__html: question}}></h2>
        <p className="FAQ__answer" dangerouslySetInnerHTML={{__html: answer}}></p>
      </div>
    );
  }
}

export default connector(FAQ);
