import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { Usertype } from '../../shared/enums';

interface IModalProps {
  onDismiss: any;
  children: any;
}

class Modal extends React.Component<IModalProps, {}> {
  public componentDidMount(): void {
    window.addEventListener('keydown', this._handleEscape);
    document.querySelector('body')?.classList.add('body--modal-open');
  }

  public componentWillUnmount(): void {
    window.removeEventListener('keydown', this._handleEscape);
    document.querySelector('body')?.classList.remove('body--modal-open');
  }

  private _handleEscape = (ev: KeyboardEvent): void => {
    if (ev.key === "Escape") { this._onDismiss() }
  }

  private _onDismiss(): void {
    this.props.onDismiss();
  }

  public render(): React.ReactElement<IModalProps> {
    return ReactDOM.createPortal(
      <div className="Modal">
        {this.props.children}
      </div>,
      document.querySelector('#modal') as Element | DocumentFragment
    );
  }
}

export default connect()(Modal);
