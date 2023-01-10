import React from 'react';

interface Props {
  className?: string;
  input: any;
  // label: string;
  meta: any;
  id: string;
  type: string;
  rest: any;
}

interface OwnState {

}

class CustomCheckbox extends React.Component<Props, OwnState> {
  inputRef = React.createRef<HTMLInputElement>();
  public constructor(props: Props) {
    super(props);
  }

  private _handleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
    // if (e.button !== 0) { return; }
    // (this.inputRef.current?.closest('.form__field--checkbox')?.querySelector('label') as HTMLElement)?.dispatchEvent(new MouseEvent("click"));
  }

  private _handleMouseDown = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
    e.preventDefault();
  }
  
  public render(): React.ReactElement<Props> {
    const { input, /*label,*/ id, type, rest, className } = this.props;

    return (
      <div className="custom-checkbox">
        <input
          ref={this.inputRef}
          className={className}
          {...input}
          type={type}
          id={id}
          {...rest}
        />
        <span onMouseDown={this._handleMouseDown} onClick={this._handleClick} className={"mark"}></span>
      </div>
    );
  }
}

export default CustomCheckbox;
