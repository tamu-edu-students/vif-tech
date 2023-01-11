import CustomForm from 'Components/CustomForm/CustomForm';
import React from 'react';
import { Field } from 'redux-form';


interface CheckboxOption {
  label: string;
  name: string;
}

interface Props {
  open?: boolean;
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
      open: this.props.open ?? false,
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
            // {...(!this.state.open && {disabled: true})}
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
    return (
      <div ref={this._rootRef} className="custom-checkbox-dropdown">
        <div
          ref={this._controllerRef}
          className={`custom-checkbox-dropdown__controller ${!this.state.open ? 'custom-checkbox-dropdown__controller--closed' : ''}`}
          onClick={this._handleControllerClick}
          onKeyDown={this._handleControllerKeyDown}
          tabIndex={0}
        >
          <input
            value={this._renderSummary()}
            readOnly
            tabIndex={-1}
            className="custom-checkbox-dropdown__summary form__element form__input"
          />
          <div className="custom-checkbox-dropdown__arrow"></div>
        </div>
        { this.state.open &&
          <div className={`custom-checkbox-dropdown__checkbox-group ${!this.state.open ? 'custom-checkbox-dropdown__checkbox-group--closed' : ''}`}>
            {this._renderCheckboxes(this.props.checkboxOptions)}
          </div>
        }
      </div>
    );
  }
}

export default CustomCheckboxDropdown;
