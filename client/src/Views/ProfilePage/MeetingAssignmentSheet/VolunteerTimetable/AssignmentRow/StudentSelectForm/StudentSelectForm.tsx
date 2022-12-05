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
  initialInvitee: User | null;
}

interface OwnState {
  value: number;
  student: User | null;
}

const mapStateToProps = null;
const mapDispatchToProps = { };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class StudentSelectForm extends React.Component<Props, OwnState> {
  state = {value: -1, student: null};
  static contextType = OptionsContext;
  context!: React.ContextType<typeof OptionsContext>;

  public componentDidMount(): void {
    const initialInvitee: User | null = this.props.initialInvitee;
    if (initialInvitee) {
      this.setState({ student: initialInvitee, value: initialInvitee.id });
    }
  }

  private _onChange = (event: any): void => {
    // console.log(event.target.value)
    this.setState({value: Number.parseInt(event.target.value), student: User.findById(Number.parseInt(event.target.value), this.context.unassignedStudents)});
    if (Number.parseInt(event.target.value) === this.state.value) { return; }
    // if (!event.target.value) { this.context.reinstateOption(this.state.value); }
    // else if (!this.state.value) { this.context.stealOption(event.target.value); }
    else {
      this.context.swapOption(this.state.value, Number.parseInt(event.target.value));
    }
  }

  private _renderOptions(): JSX.Element[] {
    return [...this.context.unassignedStudents, ...(this.state.student  ? [this.state.student] : [])]
    .sort((a: User, b: User) => a.email.toLowerCase().localeCompare(b.email.toLowerCase()))
    .map((student: User) => (
      <option key={student.id} value={student.id}>{student.email}</option>
    ))
  }

  render() {
    // console.log(this.context)
    return (
      <>
        <select value={this.state.value} onChange={this._onChange}>
          <option value={-1}>UNASSIGNED</option>
          {this._renderOptions()}
        </select>
      </>
    );
  }
}

// const validate = (fields: any, formProps: any) => {
//   const errors: any = {};
//   const fieldName: string = formProps.name;
//   const fieldVal: string = fields[fieldName];

//   if (!fieldVal) {
//     errors[fieldName] = `You must select a colleague`;
//   }

//   return errors;
// };

// const formWrapped = reduxForm<any, Props>({
//   validate: validate,
// })(StudentSelectForm);

// export default connector(formWrapped);
export default connector(StudentSelectForm);
