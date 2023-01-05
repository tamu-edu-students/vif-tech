import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
// import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
// import {eventActionTypes } from 'Store/actions/types';
import { createMeeting, deleteMeeting } from 'Store/actions';

import { msToTimeString } from 'Shared/utils';
// import Event from 'Shared/entityClasses/Event';
import Meeting from 'Shared/entityClasses/Meeting';

import TimetableRowButton from "Components/TimetableRowButton/TimetableRowButton";


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
  meeting: Meeting | null;
  setReaction: Function;
  registrationIsOpen: boolean;
}

interface OwnState {
  isChanging: boolean;
  modStatus: ModStatus;
  initialModStatus: ModStatus;
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  return {
    hadMeeting: ownProps.meeting !== null,
    owner_id: state.auth.user?.id ?? -1,
  };
};
const mapDispatchToProps = { createMeeting, deleteMeeting };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class RepresentativeFairTimetableRow extends React.Component<Props, OwnState> {
  state = {
    isChanging: false,
    initialModStatus: ModStatus.PENDING,
    modStatus: ModStatus.PENDING
  };

  public componentDidMount(): void {
    let modStatus: ModStatus = ModStatus.PENDING;

    if (!this.props.meeting) { modStatus = ModStatus.UNUSED; }
    if (!this.props.registrationIsOpen) { modStatus = ModStatus.DISABLED; }
    if (this.props.meeting) { modStatus = ModStatus.FILLED; }

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

  //TODO: Make sure updates cause companies schedule to update
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
      registrationIsOpen
    } = this.props;

    return (
      <div className="representative-fair-timetable-row table__row table__row--representative-fair">
        <div className="table__cell table__cell--time">
          <TimetableRowButton
            onClick={this._handleClick}
            disabled={!registrationIsOpen}
            modifier={this._generateButtonColor()}
          >
            {this._generateTimeString()}
          </TimetableRowButton>
        </div>
      </div>
    )
  }
}

export default connector(RepresentativeFairTimetableRow);
