import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';

interface OwnProps {
  onClick?: () => void;
  disabled: boolean;
  modifier: string;
  children: any;
}

interface OwnState {
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  return {
    onClick: ownProps.onClick ? ownProps.onClick : (): void => {},
  };
};
const mapDispatchToProps = {}
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class TimesheetRowButton extends React.Component<Props, OwnState> {
  private _onClick = () => {
    if (this.props.disabled) { return; }
    this.props.onClick();
  }

  private _computeClassName(modifier: string): string {
    if (!modifier) { return ''; }

    return `table__time-button--${modifier}`;
  }

  public render(): React.ReactElement<Props> {
    const {
      children,
      disabled,
    } = this.props;

    return (
      <button
        disabled={disabled}
        onClick={this._onClick}
        className={`table__time-button ${this._computeClassName(this.props.modifier)}`}
      >
        {children}
      </button>
    )
  }
}

export default connector(TimesheetRowButton);
