import React from 'react';
import ReactDOM from 'react-dom';
import { connect, ConnectedProps } from 'react-redux';

import { hideModal } from 'Store/actions'
import { IRootState } from 'Store/reducers';

interface OwnProps {
}

const mapStateToProps = (state: IRootState) => {
  return {
    children: state.modal.children,
    ...(state.modal.handlers),
  };
}
const mapDispatchToProps = { hideModal };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class Modal extends React.Component<Props, {}> {
  public componentDidMount(): void {
    window.addEventListener('keydown', this._handleEscape);
    document.querySelector('body')?.classList.add('body--modal-open');
    this.props.onShow?.();
  }

  public componentWillUnmount(): void {
    window.removeEventListener('keydown', this._handleEscape);
    document.querySelector('body')?.classList.remove('body--modal-open');
  }

  private _onDismiss(): void {
    this.props.hideModal();
    this.props.onDismiss?.();
  }

  private _handleEscape = (ev: KeyboardEvent): void => {
    if (ev.key === "Escape") { this._onDismiss() }
  }

  public render(): React.ReactElement<Props> {
    return ReactDOM.createPortal(
      <div className="modal">
        {this.props.children}
      </div>,
      document.querySelector('#modal') as Element | DocumentFragment
    );
  }
}

export default connector(Modal);
