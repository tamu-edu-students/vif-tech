import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import {eventActionTypes, meetingActionTypes } from 'Store/actions/types';
import { fetchEvents, fetchMeetings } from 'Store/actions';

import { msToTimeString } from 'Shared/utils';
import Event from 'Shared/entityClasses/Event';
import Meeting from 'Shared/entityClasses/Meeting';

import VolunteerTimesheetRow from './VolunteerTimesheetRow/VolunteerTimesheetRow';


interface OwnProps {

}

interface OwnState {
}

type TimeOption = {
  start_time: string;
  end_time: string;
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  const event: Event | null = Event.findByTitle('Portfolio Review 2', state.eventData.events);
  const eventsAreStale: boolean = state.eventData.isStale;
  const isLoading_fetchEvents: boolean = createLoadingSelector([eventActionTypes.FETCH_EVENTS])(state);

  const meetingsAreStale: boolean = state.meetingData.isStale;
  const isLoading_fetchMeetings: boolean = createLoadingSelector([meetingActionTypes.FETCH_MEETINGS])(state);

  return {
    event,
    meetings: state.auth.user?.findMeetings(event?.findMeetings(state.meetingData.meetings) ?? []) ?? [],

    eventsAreStale,
    isLoading_fetchEvents,

    meetingsAreStale,
    isLoading_fetchMeetings,
    
    isLoading: eventsAreStale || isLoading_fetchEvents || meetingsAreStale || isLoading_fetchMeetings,
    errors: createErrorMessageSelector([eventActionTypes.FETCH_EVENTS, meetingActionTypes.FETCH_MEETINGS])(state),
  };
};
const mapDispatchToProps = { fetchEvents, fetchMeetings, };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class VolunteerTimesheet_PR2 extends React.Component<Props, OwnState> {
  public componentDidMount(): void {
    if (this.props.eventsAreStale && !this.props.isLoading_fetchEvents) {
      this.props.fetchEvents();
    }
    if (this.props.meetingsAreStale && !this.props.isLoading_fetchMeetings) {
      this.props.fetchMeetings();
    }
  }

  private _renderTimeOptions(timeSlots: any[]): JSX.Element[] {
    return timeSlots.map(({start_time, end_time}: TimeOption) => {
      const { meetings, event } = this.props;
      return (
        <React.Fragment key={start_time}>
          <VolunteerTimesheetRow
            start_time={start_time}
            end_time={end_time}
            meeting={meetings.find((meeting: Meeting) =>
              meeting.start_time === start_time && meeting.end_time === end_time
            )}
          />
        </React.Fragment>
      );
    });
  }

  public render(): React.ReactElement<Props> {
    const {
      event,
    } = this.props;

    if (this.props.eventsAreStale || this.props.isLoading_fetchEvents) {
      return (
        <div>Loading Volunteer Timesheet for Portfolio Review 2...</div>
      )
    }

    if (this.props.errors.length > 0) {
      this.props.errors.forEach((error: string) => console.error(error));
      return (
        <div>Failed to load timesheet</div>
      );
    }

    return (
      <div className="Volunteer-Timesheet">
        <h2>Volunteer Timesheet</h2>
        <div className="table">
          <div className="table__rows">

            <div className="table__row table__row--header">
              <div className="table__cell table__cell--header">Time</div>
              <div className="table__cell table__cell--header">Name</div>
              <div className="table__cell table__cell--header">Portfolio</div>
              <div className="table__cell table__cell--header">Resume</div>
            </div>

            {event && this._renderTimeOptions(event?.createTimeSlots(20, 5))}

          </div>
        </div>
      </div>
    )
  }
}

export default connector(VolunteerTimesheet_PR2);
