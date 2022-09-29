import React from "react";
import { Link } from 'react-router-dom'

import { VifLogoMark } from "./iconComponents";

interface IRedirectorProps {
  message: string;
  buttonText: string;
}

interface IInternalRedirectorProps extends IRedirectorProps {
  href?: never;
  pathName: string;
}

interface IExternalRedirectorProps extends IRedirectorProps {
  href: string
  pathName?: never;
}

class Redirector extends React.Component<IInternalRedirectorProps | IExternalRedirectorProps, {}> {
  private _generateLink(): JSX.Element | null {
    if (this.props.pathName) {
      return (
        <Link to={this.props.pathName} className="btn redirector__link">
          <span className="btn__text">{this.props.buttonText}</span>
        </Link>
      )
    }

    if (this.props.href) {
      return (
        <a href={this.props.href} target="_blank" className="btn redirector__link">
          <span className="btn__text">{this.props.buttonText}</span>
        </a>
      )
    }

    else {
      return null;
    }
  }

  public render(): React.ReactElement<IRedirectorProps> {
    return (
      <div className="redirector">
        <VifLogoMark className="redirector__logo-mark" />
        <p className="redirector__message">{this.props.message}</p>
        {this._generateLink()}
      </div>
    );
  }
}

export default Redirector;
