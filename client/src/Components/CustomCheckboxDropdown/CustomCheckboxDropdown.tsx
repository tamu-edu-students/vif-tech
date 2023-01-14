import React from 'react';
import { Field } from 'redux-form';

import { DropdownArrow } from 'Components/iconComponents';


interface BaseProps {
  startOpened?: boolean;
  disabled?: boolean;
  renderCheckbox: Function;
  onBlur?: Function;
  hasError?: boolean;
}

type CheckboxMode = {
  mode: 'checkbox';
  checkboxOptions: CustomCheckboxOption[];
}

type SelectMode = {
  mode: 'select';
  name: string;
  initialValue: string;
  selectOptions: CustomSelectOption[];
  emptyValue: string;
}

type Props = BaseProps & (CheckboxMode | SelectMode);

interface OwnState {
  checkedOptions: CustomCheckboxOption[];
  selectedOption: CustomSelectOption;
  open: boolean;
}


class CustomCheckboxDropdown extends React.Component<Props, OwnState> {
  _rootRef = React.createRef<HTMLDivElement>();
  _controllerRef = React.createRef<HTMLDivElement>();
  _checkboxGroupRef = React.createRef<HTMLDivElement>();
  state = { open: true, checkedOptions: [], selectedOption: {label: '', value: ''} };

  public componentDidMount(): void {
    const props: Props = this.props;
    this.setState({
      open: this.props.startOpened ?? false
    });
    switch(props.mode) {
      case 'checkbox':
        this.setState({checkedOptions: this._computeChecked(props.checkboxOptions)});
        break;
      case 'select':
        this.setState({selectedOption: this._computeSelectedOption(props.selectOptions, props.initialValue)});
        break;
    }
    this._rootRef.current?.addEventListener('focusout', this._handleFocusOut);
  }

  public componentWillUnmount(): void {
    this._rootRef.current?.removeEventListener('focusout', this._handleFocusOut);
  }

  private _computeChecked(checkboxOptions: CustomCheckboxOption[]): CustomCheckboxOption[] {
    const inputElements: HTMLInputElement[] = Array.from(this._rootRef.current?.querySelectorAll('input') as NodeListOf<HTMLInputElement>);
    return checkboxOptions.filter((option: CustomCheckboxOption) => inputElements.find(input => input.name === option.name)?.checked);
  }

  private _computeSelectedOption(selectOptions: CustomSelectOption[], initialValue: string): CustomSelectOption {
    const inputElements: HTMLInputElement[] = Array.from(this._rootRef.current?.querySelectorAll('input') as NodeListOf<HTMLInputElement>);
    return (
      selectOptions.find((option: CustomSelectOption) => inputElements.find(input => input.value === option.value)?.checked)
      ?? selectOptions.find((option: CustomSelectOption) => option.value === initialValue)
    ) as CustomSelectOption;
  }

  private _toggleOpenState = (): void => { this.setState({ open: !this.state.open }); }
  private _closeDropdown = (): void => { this.setState({ open: false }); }
  private _openDropdown = (): void => { this.setState({ open: true }); }

  private _onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log('INPUT')
    if (this.props.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const props: Props = this.props;
    switch(props.mode) {
      case 'checkbox':
        this.setState({ checkedOptions: e.target.checked ?
          [...this.state.checkedOptions, props.checkboxOptions.find(option => option.name === e.target.name) as CustomCheckboxOption] :
          this.state.checkedOptions.filter((option: CustomCheckboxOption) => option.name !== e.target.name)
        });
        break;
      case 'select':
        this.setState({ selectedOption: props.selectOptions.find(option => option.value === e.target.value) as CustomSelectOption });
        this._closeDropdown()
        break;
    }
  }

  private _handleGroupFocusOut = (e: FocusEvent): void => {
    const props: Props = this.props;
    if (props.mode === 'select') {
      if ((e.relatedTarget as HTMLInputElement).value === this.state.selectedOption.value) {
        this._closeDropdown();
      }
    }
  }

  private _handleFocusOut = (e: FocusEvent): void => {
    if (this.props.disabled) { return; }
    const props: Props = this.props;
    console.log(e)
    if (/*this.props.mode === 'select' || */!this._rootRef.current?.contains(e.relatedTarget as Node)) {
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
    const props: Props = this.props;
    switch(props.mode) {
      case 'checkbox':
        return this._renderCheckboxes(props.checkboxOptions);
      case 'select':
        return this._renderSelectBoxes(props.selectOptions, props.name);
    }
  }

  private _renderSummary(): string {
    const props: Props = this.props;
    switch(props.mode) {
      case 'checkbox': {
        return this.state.checkedOptions
          .map(({label}: CustomCheckboxOption) => label)
          .sort((label1: string, label2: string) => label1.toLowerCase().localeCompare(label2.toLowerCase()))
          .join(';   ');
        }
        case 'select': {
          return this.state.selectedOption.label;
        }
      }
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
              const props: Props = this.props;
              if (props.mode === 'select') {
                this._closeDropdown();
              }
            }}
          >
            {this._renderBoxes()}
          </div>
          
        }
      </div>
    );
  }
}

export default CustomCheckboxDropdown;
