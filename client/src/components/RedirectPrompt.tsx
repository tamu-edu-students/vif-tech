import React from "react";
import { Link } from 'react-router-dom'

import { VifLogoMark } from "./iconComponents";

interface IRedirectPromptProps {
  message: string;
  buttonText: string;
}

interface IInternalRedirectPromptProps extends IRedirectPromptProps {
  href?: never;
  pathName: string;
}

interface IExternalRedirectPromptProps extends IRedirectPromptProps {
  href: string
  pathName?: never;
}

class RedirectPrompt extends React.Component<IInternalRedirectPromptProps | IExternalRedirectPromptProps, {}> {
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

  public render(): React.ReactElement<IRedirectPromptProps> {
    return (
      <div className="redirector">
        <VifLogoMark className="redirector__logo-mark" />
        <p className="redirector__message">{this.props.message}</p>
        {this._generateLink()}
      </div>
    );
  }
}

export default RedirectPrompt;
