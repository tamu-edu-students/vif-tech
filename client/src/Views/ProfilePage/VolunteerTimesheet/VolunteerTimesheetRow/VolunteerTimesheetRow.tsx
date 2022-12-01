import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import {eventActionTypes } from 'Store/actions/types';
import { createMeeting } from 'Store/actions';

import { msToTimeString } from 'Shared/utils';
import Event from 'Shared/entityClasses/Event';
import Meeting from 'Shared/entityClasses/Meeting';


interface OwnProps {
  start_time: string;
  end_time: string;
  event_id: number;
  meeting: Meeting | null;
}

interface OwnState {
}

type TimeOption = {
  start_time: string;
  end_time: string;
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  return {
    hadMeeting: ownProps.meeting !== null,
    owner_id: state.auth.user?.id ?? -1,
  };
};
const mapDispatchToProps = { createMeeting, };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class VolunteerTimesheetRow extends React.Component<Props, OwnState> {
  public componentDidMount(): void {
  }

  private _createMeeting = () => {
    const {start_time, end_time, owner_id, event_id} = this.props;
    this.props.createMeeting({
      meeting: {
        start_time, end_time, owner_id, event_id
      }
    });
  }

  private _deleteMeeting = () => {

  }

  public render(): React.ReactElement<Props> {
    const {
      start_time,
      end_time,
      hadMeeting,
      meeting,
    } = this.props;
    
    const startTimeShort = msToTimeString(Date.parse(start_time), 'CST');
    const endTimeShort = msToTimeString(Date.parse(end_time), 'CST');

    return (
      <div className="VolunteerTimesheetRow table__row">
        <div className="table__cell table__cell--time">
          <button
            onClick={ () => {hadMeeting ? this._deleteMeeting() : this._createMeeting() } }
            className={`table__time-button ${hadMeeting ? 'table__time-button--available' : ''}`}
          >
              {`${startTimeShort}—${endTimeShort}`}
          </button>
        </div>
        <div className="table__cell table__cell--name"></div>
        <div className="table__cell table__cell--portfolio"></div>
        <div className="table__cell table__cell--resume"></div>
      </div>
    )
  }
}

export default connector(VolunteerTimesheetRow);