import React from 'react';
import { IRootState } from 'Store/reducers';
import { connect, ConnectedProps } from 'react-redux';

import User from 'Shared/entityClasses/User';
import Focus from 'Shared/entityClasses/Focus';

import { OptionsContext } from 'Views/ProfilePage/MeetingAssignmentSheet/OptionsContext';


interface OwnProps {
  initialInvitee: User | null;
  onSelectionChange: any;
  keyVal: string;
}

interface OwnState {
  value: number;
  student: User | null;
}

const mapStateToProps = (state: IRootState) => {
  return {
    focuses: state.focusData.focuses,
    userFocuses: state.userFocusData.userFocuses
  }
};
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
    const toSteal: number = Number.parseInt(event.target.value);
    const toReinstate: number = this.state.value;

    this.setState({value: toSteal, student: toSteal > -1 ? User.findById(toSteal, this.context.unassignedStudents) : null});
    if (toSteal === toReinstate) { return; }
    else {
      this.context.swapOption(toReinstate, toSteal);
      this.props.onSelectionChange(toSteal);
    }
  }

  private _renderOptions(): JSX.Element[] {
    return [...this.context.unassignedStudents, ...(this.state.student  ? [this.state.student] : [])]
    .sort((a: User, b: User) => a.email.toLowerCase().localeCompare(b.email.toLowerCase()))
    .map((student: User, index: number) => (
      <option key={`${this.props.keyVal}_${index}`} value={student.id}>{`${student.firstname} ${student.lastname} (${student.email})`}</option>
    ));
  }

  render() {
    const {
      focuses,
      userFocuses
    } = this.props;

    const focusString: string = this.state.student
      ? (this.state.student as User).findFocuses(focuses, userFocuses)
        .map((focus: Focus) => focus.name)
        .join(' | ')
      : '';

    return (
      <>
        <select className="student-select-form" value={this.state.value} onChange={this._onChange}>
          <option value={-1}>UNASSIGNED</option>
          {this._renderOptions()}
        </select>
        {
          focusString && <div className="student-focuses">{focusString}</div>
        }
      </>
    );
  }
}

export default connector(StudentSelectForm);
