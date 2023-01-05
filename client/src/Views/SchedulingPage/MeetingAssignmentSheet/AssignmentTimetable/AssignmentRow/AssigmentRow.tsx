import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { updateMeeting } from 'Store/actions';

import { msToTimeString } from 'Shared/utils';
import Meeting from 'Shared/entityClasses/Meeting';
import StudentSelectForm from './StudentSelectForm/StudentSelectForm';
import User from 'Shared/entityClasses/User';

import { OptionsContext } from '../../OptionsContext';

import TimetableRowButton from 'Components/TimetableRowButton/TimetableRowButton';

enum ModStatus {
  PENDING,
  UNUSED,
  DISABLED,
  FILLED,
  DELETING,
  ADDING,
  SWAPPING,
}


interface OwnProps {
  start_time: string;
  end_time: string;
  event_id: number;
  meeting: Meeting;
}

interface OwnState {
  isChanging: boolean;
  initialModStatus: ModStatus;
  modStatus: ModStatus;
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  const meeting: Meeting = ownProps.meeting;
  const initialInvitee: User | null = meeting?.findInvitee(state.userData.users) ?? null;
  const hadAssignment: boolean = initialInvitee ? true : false;
  return {
    owner_id: meeting.owner_id,
    initialInvitee,
    hadAssignment,
    keyVal: `${ownProps.event_id} ${meeting.id} ${ownProps.owner_id} ${ownProps.start_time} ${ownProps.end_time}`,
  };
};
const mapDispatchToProps = { updateMeeting };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class AssignmentRow extends React.Component<Props, OwnState> {
  state = {
    isChanging: false,
    initialModStatus: ModStatus.PENDING,
    modStatus: ModStatus.PENDING
  };
  static contextType = OptionsContext;
  context!: React.ContextType<typeof OptionsContext>;

  public componentDidMount(): void {
    let modStatus: ModStatus = ModStatus.UNUSED;

    // if (!this.props.hadAssignment) { modStatus = ModStatus.UNUSED; }
    // if (!this.props.registrationIsOpen) { modStatus = ModStatus.DISABLED; }
    if (this.props.hadAssignment) { modStatus = ModStatus.FILLED; }

    this.setState({ initialModStatus: modStatus, modStatus });
  }

  private _generateKey(): string {
    const key: string = `${this.props.start_time} ${this.props.end_time}`;
    return key;
  }

  private _generateTimeString(): string {
    const startTimeShort = msToTimeString(Date.parse(this.props.start_time), 'CST');
    const endTimeShort = msToTimeString(Date.parse(this.props.end_time), 'CST');

    return `${startTimeShort}—${endTimeShort}`;
  }

  private _generateButtonColor(): string {
    switch(this.state.modStatus) {
      case ModStatus.ADDING:
      case ModStatus.SWAPPING:
        return 'yellow';
      case ModStatus.DELETING:
        return 'red';
      case ModStatus.FILLED:
        return 'green';
      // case ModStatus.DISABLED:
      //   return 'disabled';
      case ModStatus.UNUSED:
        return 'empty';
      // case ModStatus.PENDING:
      //   return 'pending'
      default:
        return '';
    }
  }

  private _onSelectionChange = (inviteeId: number): void => {
    const { keyVal: key } = this.props;
    let reaction: any = null;
    const {initialInvitee} = this.props;

    if (initialInvitee) {
      if (inviteeId === -1){
        reaction = () => this.props.updateMeeting(this.props.meeting.id, -1);
        this.setState({ modStatus: ModStatus.DELETING });
      }
      else if (initialInvitee.id === inviteeId) {
        reaction = () => Promise.resolve();
        this.setState({ modStatus: this.state.initialModStatus });
      }
      else {
        reaction = () => this.props.updateMeeting(this.props.meeting.id, inviteeId);
        this.setState({ modStatus: ModStatus.SWAPPING });
      }
    }
    else {
      if (inviteeId === -1) {
        reaction = () => Promise.resolve();
        this.setState({ modStatus: this.state.initialModStatus });
      }
      else {
        reaction = () => this.props.updateMeeting(this.props.meeting.id, inviteeId);
        this.setState({ modStatus: ModStatus.ADDING });
      }
    }

    this.context.setReaction(key, reaction);
  }

  public render(): React.ReactElement<Props> {
    const {
      start_time,
      end_time,
      hadAssignment,
      keyVal: key,
      initialInvitee,
    } = this.props;
    
    const startTimeShort = msToTimeString(Date.parse(start_time), 'CST');
    const endTimeShort = msToTimeString(Date.parse(end_time), 'CST');

    return (
      <div className="assignment-timetable-row table__row table__row--assignment">
        <div className="table__cell table__cell--time">
          <TimetableRowButton
            modifier={this._generateButtonColor()}
            disabled={true}
          >
            {this._generateTimeString()}
          </TimetableRowButton>
        </div>
        <div className="table__cell table__cell--assignee">
          <StudentSelectForm
            keyVal={key}
            initialInvitee={initialInvitee}
            onSelectionChange={this._onSelectionChange}
          />
        </div>
      </div>
    )
  }
}

export default connector(AssignmentRow);
