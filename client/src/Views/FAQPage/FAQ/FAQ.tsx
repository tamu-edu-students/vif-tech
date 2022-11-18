import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Usertype } from 'Shared/enums';
import { IRootState } from 'Store/reducers';

import FAQForm from 'Views/FAQPage/FAQForm/FAQForm';

import { updateFAQ, showModal, hideModal } from 'Store/actions'

interface OwnProps {
  id: number;
  question: string;
  answer: string;
}

const mapStateToProps = (state: IRootState) => {
  return {
    isAdmin: state.auth.user?.usertype === Usertype.ADMIN,
  };
}
const mapDispatchToProps = { updateFAQ, showModal, hideModal };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class FAQ extends React.Component<Props, {}> {
  private _onFAQEdit = (formValues: any): void => {
    this.props.updateFAQ(this.props.id, formValues)
    .then(() => this.props.hideModal())
    .catch((err: any) => {
      console.error('ERROR WHEN EDITING FAQ:', err);
      this.props.hideModal();
    });
  }

  private _renderEditor = (): void => {
    this.props.showModal((
      <FAQForm
        onSubmit={this._onFAQEdit}
        onCancel={this.props.hideModal}
      />
    ));
  }

  render(): React.ReactElement<Props> {
    const {
      question,
      answer,
    } = this.props;

    return (
      <div className="FAQ-container">
        <div className="FAQ">
          <h2 className="heading-secondary FAQ__question" dangerouslySetInnerHTML={{__html: question}}></h2>
          <p className="FAQ__answer" dangerouslySetInnerHTML={{__html: answer}}></p>
        </div>
        {
          this.props.isAdmin &&
          <div className="buttons">
            <button onClick={this._renderEditor}>Edit</button>
          </div>
        }
      </div>
    );
  }
}

export default connector(FAQ);
