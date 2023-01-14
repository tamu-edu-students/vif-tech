import React from 'react';
import { Field } from 'redux-form';

import { DropdownArrow } from 'Components/iconComponents';


interface BaseProps {
  startOpened?: boolean;
  disabled?: boolean;
  renderCheckbox: Function;
  onBlur?: Function;
  hasError?: boolean;

  checkboxOptions: CustomCheckboxOption[];
}

type Props = BaseProps

interface OwnState {
  checkedOptions: CustomCheckboxOption[];
  open: boolean;
}


class CustomCheckboxDropdown extends React.Component<Props, OwnState> {
  _rootRef = React.createRef<HTMLDivElement>();
  _controllerRef = React.createRef<HTMLDivElement>();
  _checkboxGroupRef = React.createRef<HTMLDivElement>();
  state = { open: true, checkedOptions: [], selectedOption: {label: '', value: ''} };

  public componentDidMount(): void {
    this.setState({
      open: this.props.startOpened ?? false,
      checkedOptions: this._computeChecked()
    });
  }

  public componentWillUnmount(): void {
    this._rootRef.current?.removeEventListener('focusout', this._handleFocusOut);
  }

  private _computeChecked(): CustomCheckboxOption[] {
    const inputElements: HTMLInputElement[] = Array.from(this._rootRef.current?.querySelectorAll('input') as NodeListOf<HTMLInputElement>);
    return this.props.checkboxOptions.filter((option: CustomCheckboxOption) => inputElements.find(input => input.name === option.name)?.checked);
  }

  private _toggleOpenState = (): void => { this.setState({ open: !this.state.open }); }
  private _closeDropdown = (): void => { this.setState({ open: false }); }
  private _openDropdown = (): void => { this.setState({ open: true }); }

  private _onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (this.props.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    this.setState({ checkedOptions: e.target.checked ?
      [...this.state.checkedOptions, this.props.checkboxOptions.find(option => option.name === e.target.name) as CustomCheckboxOption] :
      this.state.checkedOptions.filter((option: CustomCheckboxOption) => option.name !== e.target.name)
    });
  }

  private _handleFocusOut = (e: FocusEvent): void => {
    if (this.props.disabled) { return; }
    const props: Props = this.props;
    if (!this._rootRef.current?.contains(e.relatedTarget as Node)) {
      this._closeDropdown();
    }
    this.props.onBlur?.();
  }

  private _handleControllerClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (e.button === 0) {
      if (this.state.open) {
        this._closeDropdown();
      }
      else {
        this._openDropdown();
      }
    }
  }
  private _handleControllerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => { if (e.key === " ") { this._toggleOpenState(); } }

  private _renderCheckboxes(checkboxOptions: CustomCheckboxOption[]): JSX.Element[] {
    return checkboxOptions.map(({ label, name }: CustomCheckboxOption) => {
      return (
        <div key={name} className="custom-checkbox-dropdown__field-wrapper">
          <Field
            name={name}
            id={name}
            component={this.props.renderCheckbox}
            type="checkbox"
            label={label}
            onChange={this._onChange}
            {...(this.props.disabled && {disabled: true})}
          />
        </div>
      )
    });
  }

  private _renderBoxes(): JSX.Element[] {
      return this._renderCheckboxes(this.props.checkboxOptions);
  }

  private _renderSummary(): string {
    return this.state.checkedOptions
      .map(({label}: CustomCheckboxOption) => label)
      .sort((label1: string, label2: string) => label1.toLowerCase().localeCompare(label2.toLowerCase()))
      .join(';   ');
  }

  public render(): React.ReactElement<Props> {
    const {
      disabled = false,
      hasError = false,
    } = this.props;

    const {
      open
    } = this.state;

    return (
      <div
        ref={this._rootRef} className="custom-checkbox-dropdown"
        onMouseDown={() => document.getSelection()?.empty()}
      >

        {/* CONTROLLER */}
        <div
          ref={this._controllerRef}
          className={`
            custom-checkbox-dropdown__controller
            ${open ? 'custom-checkbox-dropdown__controller--open' : ''}
            ${disabled ? 'custom-checkbox-dropdown__controller--disabled' : ''}
            ${hasError ? 'custom-checkbox-dropdown__controller--error' : ''}
          `}
          onClick={!disabled ? this._handleControllerClick : undefined}
          onKeyDown={!disabled ? this._handleControllerKeyDown : undefined}
          tabIndex={!disabled ? 0 : -1}
        >
          {/* summary */}
          <input
            value={this._renderSummary()}
            readOnly
            tabIndex={-1}
            className="custom-checkbox-dropdown__summary form__element form__input"
          />

          {/* marker */}
          <div className="custom-checkbox-dropdown__arrow-container">
            <DropdownArrow className={`dropdown-arrow ${open && 'dropdown-arrow--up'}`} />
          </div>
        </div>
        
        {/* CHECKBOX GROUP */}
        {
          // this.state.open &&
          <div
            ref={this._checkboxGroupRef}
            className={`custom-checkbox-dropdown__checkbox-group ${!this.state.open ? 'custom-checkbox-dropdown__checkbox-group--closed' : ''}`}
          >
            {this._renderBoxes()}
          </div>
          
        }
      </div>
    );
  }
}

export default CustomCheckboxDropdown;
