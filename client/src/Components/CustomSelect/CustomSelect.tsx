import React from 'react';
import { Field } from 'redux-form';

import { DropdownArrow } from 'Components/iconComponents';


interface BaseProps {
  startOpened?: boolean;
  disabled?: boolean;
  renderCheckbox: Function;
  onBlur?: Function;
  hasError?: boolean;

  name: string;
  initialValue: string;
  selectOptions: CustomSelectOption[];
  emptyValue: string;
}

type Props = BaseProps

interface OwnState {
  selectedOption: CustomSelectOption;
  open: boolean;
  pendingButton: HTMLSpanElement | null;
}


class CustomSelect extends React.Component<Props, OwnState> {
  _rootRef = React.createRef<HTMLDivElement>();
  _controllerRef = React.createRef<HTMLDivElement>();
  _checkboxGroupRef = React.createRef<HTMLDivElement>();
  state = { open: true, checkedOptions: [], selectedOption: {label: '', value: ''}, pendingButton: null };

  public componentDidMount(): void {
    this.setState({
      open: this.props.startOpened ?? false
    });
    this.setState({selectedOption: this._computeSelectedOption()});
    this._rootRef.current?.addEventListener('focusout', this._handleFocusOut);
  }

  public componentWillUnmount(): void {
    this._rootRef.current?.removeEventListener('focusout', this._handleFocusOut);
  }

  private _computeSelectedOption(): CustomSelectOption {
    const inputElements: HTMLInputElement[] = Array.from(this._rootRef.current?.querySelectorAll('input') as NodeListOf<HTMLInputElement>);
    return (
      this.props.selectOptions.find((option: CustomSelectOption) => inputElements.find(input => input.value === option.value)?.checked)
      ?? this.props.selectOptions.find((option: CustomSelectOption) => option.value === this.props.initialValue)
    ) as CustomSelectOption;
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

    this.setState({ selectedOption: this.props.selectOptions.find(option => option.value === e.target.value) as CustomSelectOption });
    this._closeDropdown();
  }

  private _getSelectedInput(): HTMLInputElement {
    return this._checkboxGroupRef.current?.querySelector(':checked') as HTMLInputElement;
  }

  private _getFocusedInput(): HTMLInputElement {
    return this._getFocusedWrapper().querySelector('input') as HTMLInputElement;
  }

  private _getSelectedWrapper(): HTMLDivElement {
    return this._getSelectedInput().closest('.custom-checkbox-dropdown__field-wrapper') as HTMLDivElement;
  }

  private _getFocusedWrapper(): HTMLDivElement {
    return this._getFocusedButton().closest('.custom-checkbox-dropdown__field-wrapper') as HTMLDivElement;
  }

  private _getSelectedButton(): HTMLSpanElement {
    return this._getSelectedWrapper().querySelector('span') as HTMLSpanElement;
  }

  private _getFocusedButton(): HTMLSpanElement {
    return this._checkboxGroupRef.current?.querySelector(':focus') as HTMLSpanElement;
  }

  private _handleFocusOut = (e: FocusEvent): void => {
    if (this.props.disabled) { return; }
    const props: Props = this.props;
    if (/*this.props.mode === 'select' || */!this._rootRef.current?.contains(e.relatedTarget as Node)) {
    const pendingButton: HTMLSpanElement = (this.state.pendingButton as unknown) as HTMLSpanElement;
    if (pendingButton) {
      pendingButton.closest('label')?.click();
    }
    else {
      this.setState({ selectedOption: this.props.selectOptions.find(option => option.value === this._getSelectedInput().value) as CustomSelectOption })
    }
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
  private _handleControllerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === ' ' && !this.state.open) { this._openDropdown(); }
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && this.state.open) {
      const selectedWrapper = this._getSelectedWrapper();
      const nextWrapper = selectedWrapper[e.key === 'ArrowDown' ? 'nextElementSibling' : 'previousElementSibling'];
      e.preventDefault();
      if (!nextWrapper) { return; }
      const nextButton = nextWrapper.querySelector('span') as HTMLSpanElement;
      const nextInput = nextWrapper.querySelector('input') as HTMLInputElement;
      nextButton.focus();
      this.setState({
        selectedOption: this.props.selectOptions.find(option => option.value === nextInput.value) as CustomSelectOption,
        pendingButton: nextButton,
      })
    }
    if (e.key === 'End' || e.key === 'PageDown' || e.key === 'Home' || e.key === 'PageUp') {
      e.preventDefault();
      const nextWrapper = this._checkboxGroupRef.current?.[
        (e.key === 'End' || e.key === 'PageDown') ?
        'lastElementChild'
        : 'firstElementChild'] as HTMLDivElement;
      const nextButton = nextWrapper.querySelector('span') as HTMLSpanElement;
      const nextInput = nextWrapper.querySelector('input') as HTMLInputElement;
      nextButton.focus();
      this.setState({
        selectedOption: this.props.selectOptions.find(option => option.value === nextInput.value) as CustomSelectOption,
        pendingButton: nextButton,
      });
    }
  }

  private _handleSelectGroupKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const focusedWrapper = this._getFocusedWrapper();
      const nextWrapper = focusedWrapper[e.key === 'ArrowDown' ? 'nextElementSibling' : 'previousElementSibling'];
      if (!nextWrapper) { return; }
      e.preventDefault();
      const nextButton = nextWrapper.querySelector('span') as HTMLSpanElement;
      const nextInput = nextWrapper.querySelector('input') as HTMLInputElement;
      nextButton.focus();
      this.setState({
        selectedOption: this.props.selectOptions.find(option => option.value === nextInput.value) as CustomSelectOption,
        pendingButton: nextButton,
      });
    }
    if (e.key === 'End' || e.key === 'PageDown' || e.key === 'Home' || e.key === 'PageUp') {
      e.preventDefault();
      const nextWrapper = this._checkboxGroupRef.current?.[
        (e.key === 'End' || e.key === 'PageDown') ?
        'lastElementChild'
        : 'firstElementChild'] as HTMLDivElement;
      const nextButton = nextWrapper.querySelector('span') as HTMLSpanElement;
      const nextInput = nextWrapper.querySelector('input') as HTMLInputElement;
      nextButton.focus();
      this.setState({
        selectedOption: this.props.selectOptions.find(option => option.value === nextInput.value) as CustomSelectOption,
        pendingButton: nextButton,
      });
    }
  }

  private _renderSelectBoxes(selectOptions: CustomSelectOption[], name: string): JSX.Element[] {
    return selectOptions.map(({ label, value }: CustomSelectOption) => {
      return (
        <div key={`${name}__${value}`} className="custom-checkbox-dropdown__field-wrapper">
          <Field
            name={name}
            value={value}
            id={`${name}__${value}`}
            component={this.props.renderCheckbox}
            type="radio"
            label={label}
            // checked={value === this.state.selectedOption.value}
            onChange={this._onChange}
            {...(this.props.disabled && {disabled: true})}
          />
        </div>
      )
    });
  }

  private _renderBoxes(): JSX.Element[] {
    return this._renderSelectBoxes(this.props.selectOptions, this.props.name);
  }

  private _renderSummary(): string {
    return this.state.selectedOption.label;
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
        onClick={() => this.setState({ pendingButton: null })}
        // {...(this.props.mode === 'select' && {onClick: () => this.state.open && this._closeDropdown()})}
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
            onClick={(e) => {
              this._closeDropdown();
            }}
            onKeyDown={this._handleSelectGroupKeyDown}
          >
            {this._renderBoxes()}
          </div>
          
        }
      </div>
    );
  }
}

export default CustomSelect;
