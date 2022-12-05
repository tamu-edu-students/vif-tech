import React from 'react';
import { Field, reduxForm } from "redux-form";
import { connect, ConnectedProps } from 'react-redux';

import User from 'Shared/entityClasses/User';

import CustomForm from 'Components/CustomForm/CustomForm';
import { OptionsContext } from 'Views/ProfilePage/MeetingAssignmentSheet/OptionsContext';


interface OwnProps {
  // reinstateOption: any;
  // stealOption: any;
  // options: string[];
}

interface OwnState {
  value: string;
}

const mapStateToProps = null;
const mapDispatchToProps = { };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class StudentSelectForm extends React.Component<Props, OwnState> {
  state = {value: ''};
  static contextType = OptionsContext;
  context!: React.ContextType<typeof OptionsContext>

  private _onChange = (event: any): void => {
    // console.log(event.target.value)
    if (event.target.value === this.state.value) { return; }
    // if (!event.target.value) { this.context.reinstateOption(this.state.value); }
    // else if (!this.state.value) { this.context.stealOption(event.target.value); }
    else {
      this.context.swapOption(this.state.value, event.target.value)
    }
    this.setState({value: event.target.value});
  }

  private _renderOptions(): JSX.Element[] {
    return [...this.context.options, ...(this.state.value ? [this.state.value] : [])]
    .sort((a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map((option: string) => (
      <option key={option} value={option}>{option}</option>
    ))
  }

  render() {
    // console.log(this.context)
    return (
      <>
        <select value={this.state.value} onChange={this._onChange}>
          <option value={''}>UNASSIGNED</option>
          {this._renderOptions()}
        </select>
      </>
    );
  }
}

const validate = (fields: any, formProps: any) => {
  const errors: any = {};
  const fieldName: string = formProps.name;
  const fieldVal: string = fields[fieldName];

  if (!fieldVal) {
    errors[fieldName] = `You must select a colleague`;
  }

  return errors;
};

// const formWrapped = reduxForm<any, Props>({
//   validate: validate,
// })(StudentSelectForm);

// export default connector(formWrapped);
export default connector(StudentSelectForm);
