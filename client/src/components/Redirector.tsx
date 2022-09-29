import React from "react";
import { Link } from 'react-router-dom'

import { VifLogoMark } from "./iconComponents";

export interface IRedirectorProps {
  message: string;
  buttonText: string;
  route: string;
}

class Redirector extends React.Component<IRedirectorProps, {}> {
  render(): React.ReactElement<IRedirectorProps> {
    return (
      <div className="redirector">
        <VifLogoMark className="redirector__logo-mark" />
        <p className="redirector__message">{this.props.message}</p>
        <Link to={this.props.route} className="btn redirector__link">
          <span className="btn__text">{this.props.buttonText}</span>
        </Link>
      </div>
    );
  }
}

export default Redirector;
