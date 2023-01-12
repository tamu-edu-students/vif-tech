import React from 'react';
import { Field } from 'redux-form';

import { DropdownArrow } from 'Components/iconComponents';


interface CheckboxOption {
  label: string;
  name: string;
}

interface Props {
  startOpened?: boolean;
  disabled?: boolean;
  checkboxOptions: CheckboxOption[];
  renderCheckbox: Function;
}

interface OwnState {
  selectedValues: any;
  open: boolean;
}


class CustomCheckboxDropdown extends React.Component<Props, OwnState> {
  _rootRef = React.createRef<HTMLDivElement>();
  _controllerRef = React.createRef<HTMLDivElement>();
  _checkboxGroupRef = React.createRef<HTMLDivElement>();
  state = { open: true, selectedValues: {} };

  public componentDidMount(): void {
    const inputElements: HTMLInputElement[] = Array.from(this._rootRef.current?.querySelectorAll('input') as NodeListOf<HTMLInputElement>);
    this.setState({
      open: this.props.startOpened ?? false,
      selectedValues: {...Object.fromEntries(
        inputElements.map((input: HTMLInputElement) => [input.name, input.checked])
      )},
    });
    this._rootRef.current?.addEventListener('focusout', this._handleFocusOut);
  }

  public componentWillUnmount(): void {
    this._rootRef.current?.removeEventListener('focusout', this._handleFocusOut);
  }

  private _toggleOpenState = (): void => { this.setState({ open: !this.state.open }); }
  private _closeDropdown = (): void => { this.setState({ open: false }); }
  private _openDropdown = (): void => { this.setState({ open: true }); }

  private _onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({selectedValues: {...this.state.selectedValues, [e.target.name]: e.target.checked }});
  }

  private _handleFocusOut = (e: FocusEvent): void => {
    if (this.props.disabled) { return; }
    if (!this._rootRef.current?.contains(e.relatedTarget as Node)) {
      this._closeDropdown();
    }
  }

  private _handleControllerClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (e.button === 0) { this._toggleOpenState(); }
  }
  private _handleControllerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => { if (e.key === " ") { this._toggleOpenState(); } }

  private _renderCheckboxes(checkboxOptions: CheckboxOption[]): JSX.Element[] {
    return checkboxOptions.map(({label, name }: CheckboxOption) => {
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

  private _renderSummary(): any {
    return Object.entries(this.state.selectedValues)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => {
        const checkboxOption: CheckboxOption = this.props.checkboxOptions.find(checkbox => checkbox.name === key) as CheckboxOption;
        return checkboxOption.label;
      })
      .sort((key1: string, key2: string) => key1.toLowerCase().localeCompare(key2.toLowerCase()))
      .join(';   ');
  }

  public render(): React.ReactElement<Props> {
    const {
      disabled = false,
      checkboxOptions,
    } = this.props;

    const {
      open
    } = this.state;

    return (
      <div ref={this._rootRef} className="custom-checkbox-dropdown">

        {/* CONTROLLER */}
        <div
          ref={this._controllerRef}
          className={`
            custom-checkbox-dropdown__controller
            ${open ? 'custom-checkbox-dropdown__controller--open' : ''}
            ${disabled ? 'custom-checkbox-dropdown__controller--disabled' : ''}
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
        { open &&
          <div ref={this._checkboxGroupRef} className={`custom-checkbox-dropdown__checkbox-group`}>
            {this._renderCheckboxes(checkboxOptions)}
          </div>
        }

      </div>
    );
  }
}

export default CustomCheckboxDropdown;
