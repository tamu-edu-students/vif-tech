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
  renderCheckbox: Function;
}

interface OwnState {
  selectedValues: (string | number)[];
  open: boolean;
}


class CustomCheckboxDropdown extends React.Component<Props, OwnState> {
  //TODO: Handle selectedValues passed in as prop?
  state = { open: true, selectedValues: [] };

  public componentDidMount(): void {
    this.setState({ open: this.props.open ?? false });
  }

  private _toggleOpenState = (): void => { this.setState({ open: !this.state.open }); }
  private _handleControllerClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => { if (e.button === 0) { this._toggleOpenState(); } }
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
          />
        </div>
      )
    });
  }

  public render(): React.ReactElement<Props> {
    return (
      <div className="custom-checkbox-dropdown">
        <div
          className="custom-checkbox-dropdown__controller"
          onClick={this._handleControllerClick}
          onKeyDown={this._handleControllerKeyDown}
          tabIndex={0}
        >
         
        </div>
        <div className="custom-checkbox-dropdown__checkbox-group">
          {this._renderCheckboxes(this.props.checkboxOptions)}
        </div>
      </div>
    );
  }
}

export default CustomCheckboxDropdown;
