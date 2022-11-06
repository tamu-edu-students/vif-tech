import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { Usertype } from '../../shared/enums';

interface IModalProps {
  onDismiss: any;
  children: any;
}

class Modal extends React.Component<IModalProps, {}> {
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
