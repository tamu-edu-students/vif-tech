import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { eventActionTypes, meetingActionTypes, eventSignupActionTypes, userActionTypes } from 'Store/actions/types';
import { fetchEvents, fetchMeetings, fetchEventSignups, fetchUsers, createEventSignup, deleteEventSignup } from 'Store/actions';

import Event from 'Shared/entityClasses/Event';
import Meeting from 'Shared/entityClasses/Meeting';
import User from 'Shared/entityClasses/User';

import VolunteerTimetableRow from './VolunteerTimetableRow/VolunteerTimetableRow';
import RegistrationControls from '../RegistrationControls/RegistrationControls';


interface OwnProps {
  eventTitle: string;
}

interface OwnState {
  dispatchQueue: any;
  isLoading: boolean;
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
    meetings: state.auth.user?.findOwnedMeetings(event?.findMeetings(state.meetingData.meetings) ?? []) ?? [],

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

class VolunteerTimetable extends React.Component<Props, OwnState> {
  state = {dispatchQueue: {}, isLoading: false};

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
  
  private _moveTimeColumn = (e: React.UIEvent<HTMLDivElement, UIEvent>): void => {
    e.currentTarget.style.setProperty('--scrollPos', `${e.currentTarget.scrollLeft}px`);
  }

  private _onSaveChanges = (): void => {
    this.setState({ isLoading: true });
    console.log(Object.values(this.state.dispatchQueue));

    Promise.allSettled(Object.values(this.state.dispatchQueue).map((func: any) => func()))
    .then(() => {
      this.setState({dispatchQueue: {}, isLoading: false});
    })
  }

  private _setReaction = (key: string, reaction: any) => {
    this.setState({ dispatchQueue: {...this.state.dispatchQueue, [key]: reaction} });
  }

  private _renderTimeOptions(timeSlots: any[]): JSX.Element[] {
    const { meetings, event } = this.props;
    return timeSlots.map(({start_time, end_time}: TimeOption) => {
      const meeting: Meeting | null = Meeting.findByTime(meetings, start_time, end_time);
      const assignee: User | undefined = meeting?.findInvitee(this.props.users) ?? undefined;
      return (
        <React.Fragment key={start_time}>
          <VolunteerTimetableRow
            start_time={start_time}
            end_time={end_time}
            event_id={event?.id}
            meeting={meeting}
            assignee={assignee}
            setReaction={this._setReaction}
            registrationIsOpen={this.props.event?.registrationIsOpen}
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
        <div>{`Loading Volunteer Timetable${event?.title ? ` for ${event.title}` : ''}...`}</div>
      );
    }

    if (this.state.isLoading) {
      return (
        <div>Saving changes...</div>
      );
    }

    return (
      <div className="volunteer-timetable timetable timetable--volunteer">
        {/* <h2 className="heading-secondary">{`Volunteer ${event?.title} Timetable`}</h2> */}

        <RegistrationControls
          event={event as Event}
          isAttendingEvent={isAttendingEvent}
        />

        {
          isAttendingEvent &&
          <>
            <div className="table">
              <div className="table__rows" onScroll={this._moveTimeColumn}>

                <div className="table__row table__row--volunteer table__row--header">
                  <div className="table__cell table__cell--header table__cell--time">Time</div>
                  <div className="table__cell table__cell--header">Name</div>
                  <div className="table__cell table__cell--header">Portfolio</div>
                  <div className="table__cell table__cell--header">Resume</div>
                </div>

                {event && this._renderTimeOptions(event.createTimeSlots(20, 5))}

              </div>
            </div>
            {
              event?.registrationIsOpen && 
              <button className="btn-wire btn-wire--small" onClick={() => this._onSaveChanges()}>Save Changes</button>
            }
          </>
        }
      </div>
    )
  }
}

export default connector(VolunteerTimetable);
