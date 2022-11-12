import React from "react";
import { Link } from 'react-router-dom'

import { VifLogoMark } from "Components/iconComponents";

interface RedirectPromptProps {
  message: string;
  buttonText: string;
}

interface InternalRedirectPromptProps extends RedirectPromptProps {
  href?: never;
  pathName: string;
}

interface IExternalRedirectPromptProps extends RedirectPromptProps {
  href: string
  pathName?: never;
}

class RedirectPrompt extends React.Component<InternalRedirectPromptProps | IExternalRedirectPromptProps, {}> {
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
        <a href={this.props.href} target="_blank" rel="noreferrer" className="btn redirector__link">
          <span className="btn__text">{this.props.buttonText}</span>
        </a>
      )
    }

    else {
      return null;
    }
  }

  public render(): React.ReactElement<RedirectPromptProps> {
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
