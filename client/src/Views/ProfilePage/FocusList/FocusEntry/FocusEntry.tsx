import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { updateFocus, showModal, hideModal, deleteFocus } from 'Store/actions'

import Focus from 'Shared/entityClasses/Focus';

import FocusForm from '../FocusForm/FocusForm';


interface OwnProps {
  focus: Focus
}

const mapStateToProps = (state: IRootState) => {
  return {
  };
}
const mapDispatchToProps = { updateFocus, showModal, hideModal, deleteFocus };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class FocusEntry extends React.Component<Props, {}> {
  private _onFocusEdit = (formValues: any): void => {
    this.props.hideModal();
    this.props.updateFocus(this.props.focus.id, formValues.name);
  }

  private _renderForm = (): void => {
    this.props.showModal((
      <FocusForm
        form="editFocus"
        onSubmit={this._onFocusEdit}
        onCancel={this.props.hideModal}
      />
    ));
  }

  private _renderDeleteConfirmation = (): void => {
    this.props.showModal((
      <div>
        <p>{`Are you sure you want to delete this focus ${this.props.focus.name}? This will remove it from any user/company as well.`}</p>
        <button onClick={() => this.props.deleteFocus(this.props.focus.id).then(() => this.props.hideModal())}>Confirm</button>
        <button onClick={this.props.hideModal}>Cancel</button>
      </div>
    ));
  }

  render(): React.ReactElement<Props> {
    const {
      focus
    } = this.props;

    return (
      <div className="focus-container">
        <div className="focus">
          <p className="focus__name">{focus.name}</p>
        </div>
        <div className="buttons">
          <button onClick={this._renderForm}>Edit</button>
          <button onClick={this._renderDeleteConfirmation}>Delete</button>
        </div>
      </div>
    );
  }
}

export default connector(FocusEntry);
