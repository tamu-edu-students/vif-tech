import React from 'react';

interface Props {
  className?: string;
  input: any;
  meta: any;
  id: string;
  type: string;
  rest: any;
  children?: never;
}

interface OwnState {
  checked: boolean;
}

class CustomCheckbox extends React.Component<Props, OwnState> {
  state = {checked: false};
  inputRef = React.createRef<HTMLInputElement>();
  public constructor(props: Props) {
    super(props);
  }

  public componentDidMount(): void {
    this.setState({ checked: this.inputRef.current?.checked ?? false });
  }

  private _handleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
    // if (e.button !== 0) { return; }
    // (this.inputRef.current?.closest('.form__field--checkbox')?.querySelector('label') as HTMLElement)?.dispatchEvent(new MouseEvent("click"));
  }

  private _handleMouseDown = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
    // e.preventDefault();
  }

  private _handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ checked: this.inputRef.current?.checked ?? false });
  }
  
  public render(): React.ReactElement<Props> {
    const { input, /*label,*/ id, type, rest, className } = this.props;

    return (
      <div
        className={`
          custom-checkbox
          ${className}
        `}
        onChange={this._handleChange}
        onClick={this._handleClick}
        onMouseDown={this._handleMouseDown}
      >
        <input
          ref={this.inputRef}
          className="custom-checkbox__input"
          {...input}
          type={type}
          id={id}
          {...rest}
        />
      </div>
    );
  }
}

export default CustomCheckbox;
