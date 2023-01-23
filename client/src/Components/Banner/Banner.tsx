import React from 'react';

interface Props {
  children: JSX.Element | JSX.Element[];
  isHeader?: boolean;
  modifier?: string;
  modifiers?: string[];
}

interface OwnState {

}

class Banner extends React.Component<Props, OwnState> {
  private _generateModifiers(): string {
    return [
      ...(this.props.modifiers ? this.props.modifiers.map(modifier => `banner--${modifier}`) : []),
      ...(this.props.modifier ? [`banner--${this.props.modifier}`] : [])
    ].join(' ');
  }

  public render(): React.ReactElement<Props> {
    return (
      this.props.isHeader
      ? <div className={`banner ${this._generateModifiers()}`}>
          {this.props.children}
        </div>
      : <header className={`banner ${this._generateModifiers()}`}>
          {this.props.children}
        </header>
    )
  }
}

export default Banner;
