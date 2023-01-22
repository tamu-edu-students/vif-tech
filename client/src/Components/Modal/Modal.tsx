import React from 'react';
import ReactDOM from 'react-dom';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { hideModal } from 'Store/actions'
import FocusTrap from 'focus-trap-react';

import { XSign } from 'Components/iconComponents';

interface OwnProps {
}

const mapStateToProps = (state: IRootState) => {
  return {
    children: state.modal.children,
    shouldRender: state.modal.shouldRender,
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

  private _onDismiss = (): void => {
    this.props.hideModal();
    this.props.onDismiss?.();
  }

  private _handleEscape = (ev: KeyboardEvent): void => {
    if (ev.key === "Escape") { this._onDismiss() }
  }

  public render(): React.ReactElement<Props> {
    return ReactDOM.createPortal(
        <FocusTrap active={this.props.shouldRender}>
          <div className="modal">
              <button onClick={this._onDismiss} className="modal__close-button">
                <XSign className="modal__close-button-icon" />
              </button>
              {this.props.children}
          </div>
        </FocusTrap>,
      document.querySelector('#modal') as Element | DocumentFragment
    );
  }
}

export default connector(Modal);
