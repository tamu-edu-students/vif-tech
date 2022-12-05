import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { eventActionTypes, meetingActionTypes, eventSignupActionTypes, userActionTypes } from 'Store/actions/types';
import { fetchEvents, fetchMeetings, fetchEventSignups, fetchUsers, createEventSignup, deleteEventSignup } from 'Store/actions';

import Event from 'Shared/entityClasses/Event';
import Meeting from 'Shared/entityClasses/Meeting';
import User from 'Shared/entityClasses/User';

import StudentTimesheetRow from './StudentTimesheetRow/StudentTimesheetRow';


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
  const isAttendingEvent: boolean = event ? (state.auth.user?.isAttendingEvent(event, state.eventSignupData.eventSignups) ?? false) : false;

  const eventsAreStale: boolean = state.eventData.isStale;
  const isLoading_fetchEvents: boolean = createLoadingSelector([eventActionTypes.FETCH_EVENTS])(state);

  const meetingsAreStale: boolean = state.meetingData.isStale;
  const isLoading_fetchMeetings: boolean = createLoadingSelector([meetingActionTypes.FETCH_MEETINGS])(state);

  const eventSignupsAreStale: boolean = state.eventSignupData.isStale;
  const isLoading_fetchEventSignups: boolean = createLoadingSelector([eventSignupActionTypes.FETCH_EVENT_SIGNUPS])(state);
  
  const usersAreStale: boolean = state.userData.isStale;
  const isLoading_fetchUsers: boolean = createLoadingSelector([userActionTypes.FETCH_USERS])(state);

  return {
    event,
    isAttendingEvent,
    users: state.userData.users,
    meetings: state.auth.user?.findInvitedMeetings(event?.findMeetings(state.meetingData.meetings) ?? []) ?? [],

    eventsAreStale,
    isLoading_fetchEvents,

    meetingsAreStale,
    isLoading_fetchMeetings,

    eventSignupsAreStale,
    isLoading_fetchEventSignups,

    usersAreStale,
    isLoading_fetchUsers,
    
    isLoading:
      eventsAreStale || isLoading_fetchEvents
      || meetingsAreStale || isLoading_fetchMeetings
      || eventSignupsAreStale || isLoading_fetchEventSignups
      || (isAttendingEvent ? (usersAreStale || isLoading_fetchUsers) : false),
    errors: createErrorMessageSelector([
      eventActionTypes.FETCH_EVENTS,
      meetingActionTypes.FETCH_MEETINGS,
      eventSignupActionTypes.FETCH_EVENT_SIGNUPS,
      ...(isAttendingEvent ? [userActionTypes.FETCH_USERS] : []),
    ])(state),
  };
};
const mapDispatchToProps = { fetchEvents, fetchMeetings, fetchEventSignups, fetchUsers, createEventSignup, deleteEventSignup };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class VolunteerTimesheetPR2 extends React.Component<Props, OwnState> {
  public componentDidMount(): void {
    if (this.props.eventsAreStale && !this.props.isLoading_fetchEvents) {
      this.props.fetchEvents();
    }
    if (this.props.meetingsAreStale && !this.props.isLoading_fetchMeetings) {
      this.props.fetchMeetings();
    }
    if (this.props.eventSignupsAreStale && !this.props.isLoading_fetchEventSignups) {
      this.props.fetchEventSignups();
    }
    if (this.props.isAttendingEvent && this.props.usersAreStale && !this.props.isLoading_fetchUsers) {
      this.props.fetchUsers();
    }
  }

  public componentDidUpdate(): void {
    if (this.props.eventsAreStale && !this.props.isLoading_fetchEvents) {
      this.props.fetchEvents();
    }
    if (this.props.meetingsAreStale && !this.props.isLoading_fetchMeetings) {
      this.props.fetchMeetings();
    }
    if (this.props.eventSignupsAreStale && !this.props.isLoading_fetchEventSignups) {
      this.props.fetchEventSignups();
    }
    if (this.props.isAttendingEvent && this.props.usersAreStale && !this.props.isLoading_fetchUsers) {
      this.props.fetchUsers();
    }
  }

  private _renderTimeSlots(timeSlots: any[]): JSX.Element[] {
    const { meetings, event } = this.props;
    return timeSlots.map(({start_time, end_time}: TimeOption) => {
      const meeting: Meeting | null = meetings.find((meeting: Meeting) => meeting.start_time >= start_time && meeting.end_time <= end_time) ?? null;
      const assignedVolunteer: User | undefined = meeting?.findOwner(this.props.users) ?? undefined;
      return (
        <React.Fragment key={start_time}>
          <StudentTimesheetRow
            start_time={start_time}
            end_time={end_time}
            event_id={event?.id}
            meeting={meeting}
            assignedVolunteer={assignedVolunteer}
          />
        </React.Fragment>
      );
    });
  }

  public render(): React.ReactElement<Props> {
    const {
      event,
      isAttendingEvent,
    } = this.props;

    if (this.props.isLoading) {
      return (
        <div>Loading Student Timesheet for Portfolio Review 2...</div>
      );
    }

    if (this.props.errors.length > 0) {
      this.props.errors.forEach((error: string) => console.error(error));
      return (
        <div>Failed to load timesheet</div>
      );
    }

    return (
      <div className="Student-Timesheet">
        <h2>Student Timesheet</h2>
        <button
          onClick={() => isAttendingEvent
            ? this.props.deleteEventSignup(event?.id ?? -1)
            : this.props.createEventSignup(event?.id ?? -1)
          }
        >
          {`${isAttendingEvent ? 'Unr' : 'R'}egister for ${event?.title}`}
        </button>
        {
          !isAttendingEvent &&
          <div>Timesheet not viewable. Please register for this event!</div>
        }

        {
          isAttendingEvent &&
          <>
            <div className="table">
              <div className="table__rows">

                <div className="table__row table__row--header">
                  <div className="table__cell table__cell--header">Time</div>
                  <div className="table__cell table__cell--header">Name</div>
                  <div className="table__cell table__cell--header">Email</div>
                </div>

                {event && this._renderTimeSlots(event.createTimeSlots(20, 5))}

              </div>
            </div>
          </>
        }
      </div>
    )
  }
}

export default connector(VolunteerTimesheetPR2);
