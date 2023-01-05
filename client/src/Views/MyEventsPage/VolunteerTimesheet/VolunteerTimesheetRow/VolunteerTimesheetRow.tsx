import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createMeeting, deleteMeeting } from 'Store/actions';

import { msToTimeString } from 'Shared/utils';
import Meeting from 'Shared/entityClasses/Meeting';
import User from 'Shared/entityClasses/User';
// import TimesheetRow from 'Components/TimesheetRow/TimesheetRow';
import TimesheetRowButton from "Components/TimesheetRowButton/TimesheetRowButton";


enum ModStatus {
  PENDING,
  EMPTY,
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
  meeting: Meeting | null;
  setReaction: (key: string, reaction: any) => void;
  assignee?: User;
  registrationIsOpen: boolean;
}

interface OwnState {
  isChanging: boolean;
  modStatus: ModStatus;
  initialModStatus: ModStatus;
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  return {
    owner_id: state.auth.user?.id ?? -1,
  };
};
const mapDispatchToProps = { createMeeting, deleteMeeting };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class VolunteerTimesheetRow extends React.Component<Props, OwnState> {
  state = {
    isChanging: false,
    initialModStatus: ModStatus.PENDING,
    modStatus: ModStatus.PENDING
  };

  public componentDidMount(): void {
    let modStatus: ModStatus = ModStatus.PENDING;

    if (!this.props.assignee) { modStatus = ModStatus.EMPTY; }
    if (!this.props.registrationIsOpen) { modStatus = ModStatus.DISABLED; }
    if (this.props.assignee || this.props.meeting) { modStatus = ModStatus.FILLED; }

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
      case ModStatus.EMPTY:
        return 'empty';
      // case ModStatus.PENDING:
      //   return 'pending'
      default:
        return '';
    }
  }

  private _queueCreateMeeting = (): void => {
    const {start_time, end_time, owner_id, event_id} = this.props;
    const reaction: any = () => this.props.createMeeting({start_time, end_time, owner_id, event_id});
    this.props.setReaction(this._generateKey(), reaction);
  }

  private _queueDeleteMeeting = (): void => {
    const reaction: any = () => this.props.deleteMeeting(this.props.meeting?.id ?? -1);
    this.props.setReaction(this._generateKey(), reaction);
  }

  private _queueNoOp = (): void => {
    const reaction: any = () => Promise.resolve();
    this.props.setReaction(this._generateKey(), reaction);
  }

  private _handleClick = (): void => {
    if (!this.props.registrationIsOpen) { return; }

    let newIsChanging: boolean = !this.state.isChanging;
    let newModStatus: ModStatus = this.state.modStatus;

    if (newIsChanging) {
      if (this.props.meeting) {
        this._queueDeleteMeeting();
        newModStatus = ModStatus.DELETING;
      }
      else {
        this._queueCreateMeeting();
        newModStatus = ModStatus.ADDING;
      }
    }
    else {
      this._queueNoOp();
      newModStatus = this.state.initialModStatus;
    }

    this.setState({ modStatus: newModStatus, isChanging: newIsChanging });
  }

  public render(): React.ReactElement<Props> {
    const {
      assignee,
      registrationIsOpen
    } = this.props;

    if (this.state.modStatus === ModStatus.PENDING) {
      return <div></div>
    }

    return (
      <div className="volunteer-timesheet-row table__row table__row--volunteer">
        <div className="table__cell table__cell--time">
          <TimesheetRowButton
            onClick={this._handleClick}
            disabled={!registrationIsOpen}
            modifier={this._generateButtonColor()}
          >
            {this._generateTimeString()}
          </TimesheetRowButton>
        </div>
        <div className="table__cell table__cell--name">{assignee && `${assignee.firstname} ${assignee.lastname}`}</div>
        {/* TODO: Truncate */}
        <div className="table__cell table__cell--portfolio">{assignee?.portfolio_link && <a href={assignee.portfolio_link} target="_blank" rel="noreferrer">{assignee.portfolio_link}</a>}</div>
        <div className="table__cell table__cell--resume">{assignee?.resume_link && <a href={assignee.resume_link} target="_blank" rel="noreferrer">{assignee.resume_link}</a>}</div>
      </div>
    )
  }
}

export default connector(VolunteerTimesheetRow);
