import CustomForm from 'Components/CustomForm/CustomForm';
import React from 'react';
import { Field } from 'redux-form';


interface CheckboxOption {
  label: string;
  name: string;
}

interface Props {
  startOpened?: boolean;
  disabled?: boolean;
  checkboxOptions: CheckboxOption[];
  initialValues: any;
  renderCheckbox: Function;
}

interface OwnState {
  selectedValues: any;
  open: boolean;
}


class CustomCheckboxDropdown extends React.Component<Props, OwnState> {
  _controllerRef = React.createRef<HTMLDivElement>();
  _rootRef = React.createRef<HTMLDivElement>();
  state = { open: true, selectedValues: {} };

  public componentDidMount(): void {
    this.setState({
      open: this.props.startOpened ?? false,
      selectedValues: {...this.props.initialValues},
    });
    this._rootRef.current?.addEventListener('focusout', this._handleFocusOut);
  }

  public componentWillUnmount(): void {
    this._rootRef.current?.removeEventListener('focusout', this._handleFocusOut);
  }

  private _toggleOpenState = (): void => { this.setState({ open: !this.state.open }); }
  private _closeDropdown = (): void => { this.setState({ open: false }); }
  private _openDropdown = (): void => { this.setState({ open: true }); }

  private _handleFocusOut = (e: FocusEvent) => {
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
            {...(this.props.disabled && {disabled: true})}
          />
        </div>
      )
    });
  }

  private _renderSummary(): any {
    return Object.entries(this.state.selectedValues)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => key.replace(/focus-.*__/, ''))
      .sort((key1: string, key2: string) => key1.toLowerCase().localeCompare(key2.toLowerCase()))
      .join(' | ');
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

        <div
          ref={this._controllerRef}
          className={`
            custom-checkbox-dropdown__controller
            ${!open ? 'custom-checkbox-dropdown__controller--closed' : ''}
            ${disabled ? 'custom-checkbox-dropdown__controller--disabled' : ''}
          `}
          onClick={!disabled ? this._handleControllerClick : undefined}
          onKeyDown={!disabled ? this._handleControllerKeyDown : undefined}
          tabIndex={!disabled ? 0 : -1}
        >
          <input
            value={this._renderSummary()}
            readOnly
            tabIndex={-1}
            className="custom-checkbox-dropdown__summary form__element form__input"
          />
          <div className="custom-checkbox-dropdown__arrow"></div>
        </div>
        
        { open &&
          <div className={`custom-checkbox-dropdown__checkbox-group ${!open ? 'custom-checkbox-dropdown__checkbox-group--closed' : ''}`}>
            {this._renderCheckboxes(checkboxOptions)}
          </div>
        }

      </div>
    );
  }
}

export default CustomCheckboxDropdown;
