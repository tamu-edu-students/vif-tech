import React from 'react';

interface Props {

}

interface OwnState {

}

class CustomCheckbox extends React.Component<Props, OwnState> {
  render(): React.ReactElement<Props> {
    return (
      <fieldset className="form__fieldset">
        <legend className="form__legend">{`Interests`}</legend>
        {/* {this._renderCheckboxGroup(this.props.focuses)} */}
      </fieldset>
    )
  }
}

export default CustomCheckbox;
