import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { eventActionTypes, meetingActionTypes, eventSignupActionTypes, userActionTypes } from 'Store/actions/types';
import { fetchEvents, fetchMeetings, fetchEventSignups, fetchUsers, createEventSignup, deleteEventSignup } from 'Store/actions';

import Event from 'Shared/entityClasses/Event';
import Meeting from 'Shared/entityClasses/Meeting';
import User from 'Shared/entityClasses/User';

import StudentTimetableRow from './StudentTimetableRow/StudentTimetableRow';
import RegistrationControls from '../RegistrationControls/RegistrationControls';


interface OwnProps {
  eventTitle: string;
}

interface OwnState {
}

type TimeOption = {
  start_time: string;
  end_time: string;
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  const event: Event | null = Event.findByTitle(ownProps.eventTitle, state.eventData.events);
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

class StudentTimetable extends React.Component<Props, OwnState> {
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
      const meeting: Meeting | null = Meeting.findByTime(meetings, start_time, end_time);
      const assignee: User | undefined = meeting?.findOwner(this.props.users) ?? undefined;
      return (
        <React.Fragment key={start_time}>
          <StudentTimetableRow
            start_time={start_time}
            end_time={end_time}
            event_id={event?.id}
            meeting={meeting}
            assignee={assignee}
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

    if (this.props.errors.length > 0) {
      this.props.errors.forEach((error: string) => console.error(error));
      return (
        <div className="error">{`Failed to load${event?.title ? ` ${event.title}` : ''} Timetable`}</div>
      );
    }

    if (this.props.isLoading) {
      return (
        <div>{`Loading Student Timetable${event?.title ? ` for ${event.title}` : ''}...`}</div>
      );
    }

    return (
      <div className="student-timetable timetable timetable--student">
        {/* <h2 className="heading-secondary">{`Student ${event?.title} Timetable`}</h2> */}
        <RegistrationControls
          event={event as Event}
          isAttendingEvent={isAttendingEvent}

        />

        {
          isAttendingEvent &&
          <>
            <div className="table">
              <div className="table__rows">

                <div className="table__row table__row--student table__row--header">
                  <div className="table__cell table__cell--header table__cell--time">Time</div>
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

export default connector(StudentTimetable);
