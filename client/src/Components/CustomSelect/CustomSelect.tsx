import React from 'react';
import { Field } from 'redux-form';

import { DropdownArrow } from 'Components/iconComponents';


//TODO: Add separate styling to handle :focus on hover (and maybe --selected)
//TODO: Fix bug where controller isn't focused after selecting a value
interface BaseProps {
  startOpened?: boolean;
  disabled?: boolean;
  renderCheckbox: Function;
  onBlur?: Function;
  onFocus?: Function;
  hasError?: boolean;

  name: string;
  initialValue: string;
  selectOptions: CustomSelectOption[];
  emptyValue: string;
}

type Props = BaseProps

interface OwnState {
  selectedOption: CustomSelectOption;
  intermediateOption: CustomSelectOption | null;
  open: boolean;
  pendingButton: HTMLSpanElement | null;
}


class CustomSelect extends React.Component<Props, OwnState> {
  _rootRef = React.createRef<HTMLDivElement>();
  _controllerRef = React.createRef<HTMLDivElement>();
  _checkboxGroupRef = React.createRef<HTMLDivElement>();
  _shortcutList = 'ArrowUp, ArrowDown, Esc, End, PageDown, Home, PageUp'.split(', ');
  state = {
    open: false,
    checkedOptions: [],
    selectedOption: {label: '', value: ''},
    pendingButton: null,
    intermediateOption: null
  };

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
    return (
      this.props.selectOptions.find((option: CustomSelectOption) => `${option.value}` === this.props.initialValue)
    ) as CustomSelectOption;
  }

  private _toggleOpenState = (): void => { this.setState({ open: !this.state.open }); }
  private _closeDropdown = (): void => {
    this.setState({ open: false, intermediateOption: null });
  }
  private _openDropdown = (): void => { 
    this.setState({ open: true });
    this.props.onFocus?.();
  }

  private _onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (this.props.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    this.setState({
      selectedOption: this.props.selectOptions.find(option => `${option.value}` === e.target.value) as CustomSelectOption,
    });
    this._closeDropdown();
  }

  private _getSelectedInput(): HTMLInputElement {
    return this._checkboxGroupRef.current?.querySelector(`[value="${this.state.selectedOption.value}"]`) as HTMLInputElement;
  }

  private _getSelectedWrapper(): HTMLDivElement {
    return this._getSelectedInput().closest('.custom-checkbox-dropdown__field-wrapper') as HTMLDivElement;
  }

  private _getFocusedWrapper(): HTMLDivElement {
    return this._getFocusedButton().closest('.custom-checkbox-dropdown__field-wrapper') as HTMLDivElement;
  }

  private _getFocusedButton(): HTMLSpanElement {
    return this._checkboxGroupRef.current?.querySelector(':focus') as HTMLSpanElement;
  }

  private _handleFocusOut = (e: FocusEvent): void => {
    if (this.props.disabled) { return; }

    if (!this._rootRef.current?.contains(e.relatedTarget as Node)) {
      const pendingButton: HTMLSpanElement = (this.state.pendingButton as unknown) as HTMLSpanElement;
      if (pendingButton) {
        pendingButton.closest('label')?.click();
        const state = this.state;
        if (state.intermediateOption) {
          this.setState({ selectedOption: {...state.intermediateOption as CustomSelectOption} })
        }
      }

      // this.setState({ intermediateOption: null});
      this._closeDropdown();
    }
    
    this.props.onBlur?.();
  }

  private _handleControllerClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (e.button === 0) {
      if (this.state.open) { this._closeDropdown(); }
      else { this._openDropdown(); }
    }
  }

  private _handleKeyboardShortcut = (e: React.KeyboardEvent<HTMLDivElement>, initialWrapper: HTMLDivElement): void => {
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && this.state.open) {
      e.preventDefault();
      const nextWrapper = initialWrapper[e.key === 'ArrowDown' ? 'nextElementSibling' : 'previousElementSibling'];
      if (!nextWrapper) { return; }
      const nextButton = nextWrapper.querySelector('span') as HTMLSpanElement;
      const nextInput = nextWrapper.querySelector('input') as HTMLInputElement;
      nextButton.focus();
      this.setState({
        selectedOption: this.props.selectOptions.find(option => `${option.value}` === nextInput.value) as CustomSelectOption,
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
        selectedOption: this.props.selectOptions.find(option => `${option.value}` === nextInput.value) as CustomSelectOption,
        pendingButton: nextButton,
      });
    }
  }

  private _handleControllerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === ' ' && !this.state.open) {
      this._openDropdown();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      this._toggleOpenState();
    }
    if ((e.key === 'Tab' && this.state.open)) {
      e.preventDefault();
      this._closeDropdown();
    }
    if (this._shortcutList.includes(e.key) && this.state.open) {
      this._handleKeyboardShortcut(e, this._getSelectedWrapper());
      return;
    }
  }

  private _handleSelectGroupKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (this._shortcutList.includes(e.key) && this.state.open) {
      this._handleKeyboardShortcut(e, this._getFocusedWrapper());
    }
  }

  private _renderSelectBoxes(selectOptions: CustomSelectOption[], name: string): JSX.Element[] {
    return selectOptions.map(({ label, value }: CustomSelectOption) => {
      return (
        <div
          key={`${name}__${value}`}
          className={`
            custom-checkbox-dropdown__field-wrapper
            custom-checkbox-dropdown__field-wrapper--select
            ${value === this.state.selectedOption.value ? 'custom-checkbox-dropdown__field-wrapper--selected' : ''}
          `}
        >
          <Field
            name={name}
            value={`${value}`}
            id={`${name}__${value}`}
            component={this.props.renderCheckbox}
            type="radio"
            label={label}
            // checked={value === this.state.selected`${option.value}`}
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
    const intermediateOption = this.state.intermediateOption;
    if (intermediateOption) {
      return (intermediateOption as CustomSelectOption).label;
    }
    return this.state.selectedOption?.label ?? '';
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
        onClick={!disabled ? () => {this.setState({ pendingButton: null })} : undefined}
        onKeyDown={!disabled ? (e) => {if (e.key === 'Escape') { this._closeDropdown(); }} : undefined}
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
          this.state.open &&
          <div
            ref={this._checkboxGroupRef}
            className={`custom-checkbox-dropdown__checkbox-group ${!this.state.open ? 'custom-checkbox-dropdown__checkbox-group--closed' : ''}`}
            onClick={(e) => {
              if ((e.target as HTMLInputElement)?.value === `${this.state.selectedOption.value}`) {
                this._closeDropdown();
                this._controllerRef.current?.focus();
              }
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
