import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
// import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
// import {eventActionTypes } from 'Store/actions/types';
import { createMeeting, deleteMeeting } from 'Store/actions';

import { msToTimeString } from 'Shared/utils';
// import Event from 'Shared/entityClasses/Event';
import Meeting from 'Shared/entityClasses/Meeting';
import User from 'Shared/entityClasses/User';


interface OwnProps {
  start_time: string;
  end_time: string;
  event_id: number;
  meeting: Meeting | null;
  setReaction: Function;
  registrationIsOpen: boolean;
}

interface OwnState {
  isChanged: boolean;
}

// type TimeOption = {
//   start_time: string;
//   end_time: string;
// }

const mapStateToProps = (state: IRootState, ownProps: any) => {
  return {
    hadMeeting: ownProps.meeting !== null,
    owner_id: state.auth.user?.id ?? -1,
  };
};
const mapDispatchToProps = { createMeeting, deleteMeeting };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class RepresentativeFairTimesheetRow extends React.Component<Props, OwnState> {
  state = { isChanged: false };

  public componentDidMount(): void {
  }

  private _createMeeting = () => {
    const {start_time, end_time, owner_id, event_id} = this.props;
    const key = `${start_time} ${end_time}`;
    const reaction: any = this.props.hadMeeting
      ? () => Promise.resolve()
      : () => this.props.createMeeting({start_time, end_time, owner_id, event_id});
    this.props.setReaction(key, reaction);
    // this.props.createMeeting({start_time, end_time, owner_id, event_id})
  }

  private _deleteMeeting = () => {
    const {start_time, end_time} = this.props;
    const key = `${start_time} ${end_time}`;
    const reaction: any = this.props.hadMeeting
      ? () => this.props.deleteMeeting(this.props.meeting?.id ?? -1)
      : () => Promise.resolve();
    this.props.setReaction(key, reaction);
    // this.props.deleteMeeting(this.props.meeting?.id ?? -1)
  }

  public render(): React.ReactElement<Props> {
    const {
      start_time,
      end_time,
      hadMeeting,
      registrationIsOpen
    } = this.props;
    
    const startTimeShort = msToTimeString(Date.parse(start_time), 'CST');
    const endTimeShort = msToTimeString(Date.parse(end_time), 'CST');

    return (
      <div className="RepresentativeFairTimesheetRow table__row">
        <div className="table__cell table__cell--time">
          <button
            onClick={registrationIsOpen
              ? () => {
                hadMeeting ? this._deleteMeeting() : this._createMeeting();
                this.setState({ isChanged: !this.state.isChanged })
              }
              : () => {}
              }
            className={`table__time-button ${
              hadMeeting
              ? (this.state.isChanged ? 'table__time-button--deleting' : 'table__time-button--available')
              : (this.state.isChanged ? 'table__time-button--adding' : '')
            }`}
          >
              {`${startTimeShort}—${endTimeShort}`}
          </button>
        </div>
      </div>
    )
  }
}

export default connector(RepresentativeFairTimesheetRow);
