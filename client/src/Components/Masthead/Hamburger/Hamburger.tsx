import React from 'react';

interface Props {
  onClick: Function
}

interface OwnState {

}


class Hamburger extends React.Component<Props, OwnState> {
  private _handleClick = (): void => {
    this.props.onClick()
  }

  public render(): React.ReactElement<Props> {
    return (
      <div className="hamburger">
        <button onClick={this._handleClick} className="hamburger__button" type="button">
          <div className="hamburger__bar"></div>
          <div className="hamburger__bar"></div>
          <div className="hamburger__bar"></div>
        </button>
      </div>
    );
  }
}

export default Hamburger;
