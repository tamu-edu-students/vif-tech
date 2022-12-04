import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import {eventActionTypes, meetingActionTypes, eventSignupActionTypes, userActionTypes } from 'Store/actions/types';
import { fetchEvents, fetchMeetings, fetchEventSignups, fetchUsers, createEventSignup, deleteEventSignup } from 'Store/actions';

import Event from 'Shared/entityClasses/Event';
import User from 'Shared/entityClasses/User';
import Meeting from 'Shared/entityClasses/Meeting';
import EventSignup from 'Shared/entityClasses/EventSignup';

// import VolunteerTimesheetRow from './VolunteerTimesheetRow/VolunteerTimesheetRow';


interface OwnProps {

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
  const event: Event | null = Event.findByTitle('Portfolio Review 2', state.eventData.events);
  const attendees = event?.findAttendees(state.userData.users, state.eventSignupData.eventSignups) ?? [];
  const volunteers: User[] = attendees.filter((user: User) => user.isVolunteer || user.isRepresentative);
  const students: User[] = attendees.filter((user: User) => user.isStudent);

  const usersAreStale: boolean = state.userData.isStale;
  const isLoading_fetchUsers: boolean = createLoadingSelector([userActionTypes.FETCH_USERS])(state);

  const eventsAreStale: boolean = state.eventData.isStale;
  const isLoading_fetchEvents: boolean = createLoadingSelector([eventActionTypes.FETCH_EVENTS])(state);

  const meetingsAreStale: boolean = state.meetingData.isStale;
  const isLoading_fetchMeetings: boolean = createLoadingSelector([meetingActionTypes.FETCH_MEETINGS])(state);

  const eventSignupsAreStale: boolean = state.eventSignupData.isStale;
  const isLoading_fetchEventSignups: boolean = createLoadingSelector([eventSignupActionTypes.FETCH_EVENT_SIGNUPS])(state);

  return {
    event,
    volunteers,
    students,
    meetings: event?.findMeetings(state.meetingData.meetings) ?? [],

    usersAreStale,
    isLoading_fetchUsers,

    eventsAreStale,
    isLoading_fetchEvents,

    meetingsAreStale,
    isLoading_fetchMeetings,

    eventSignupsAreStale,
    isLoading_fetchEventSignups,
    
    isLoading:
      eventsAreStale || isLoading_fetchEvents
      || meetingsAreStale || isLoading_fetchMeetings
      || eventSignupsAreStale || isLoading_fetchEventSignups
      || usersAreStale || isLoading_fetchUsers,

    errors: createErrorMessageSelector([
      eventActionTypes.FETCH_EVENTS,
      meetingActionTypes.FETCH_MEETINGS,
      eventSignupActionTypes.FETCH_EVENT_SIGNUPS,
      userActionTypes.FETCH_USERS
    ])(state),
  };
};
const mapDispatchToProps = { fetchEvents, fetchMeetings, fetchEventSignups, fetchUsers, createEventSignup, deleteEventSignup };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class MeetingAssignmentSheetPR2 extends React.Component<Props, OwnState> {
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
    if (this.props.usersAreStale && !this.props.isLoading_fetchUsers) {
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
    if (this.props.usersAreStale && !this.props.isLoading_fetchUsers) {
      this.props.fetchUsers();
    }
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

  private _renderVolunteerTables(volunteers: User[]): JSX.Element[] {
    return volunteers.map((volunteer: User) => {
      return (
        <div key={volunteer.id}>
          <p>{volunteer.firstname}</p>
          <p>{volunteer.lastname}</p>
          <p>{volunteer.email}</p>
          <br />
        </div>
      )
    });
  }

  private _renderTimeOptions(timeSlots: any[]): JSX.Element[] {
    return timeSlots.map(({start_time, end_time}: TimeOption) => {
      const { meetings, event } = this.props;
      return (
        <React.Fragment key={start_time}>
          {/* <VolunteerTimesheetRow
            start_time={start_time}
            end_time={end_time}
            event_id={event?.id}
            meeting={
              meetings.find((meeting: Meeting) => meeting.start_time >= start_time && meeting.end_time <= end_time)
              ?? null
            }
            setReaction={this._setReaction}
          /> */}
        </React.Fragment>
      );
    });
  }

  public render(): React.ReactElement<Props> {
    const {
      event,
      volunteers,
      students,
    } = this.props;

    if (this.props.isLoading) {
      return (
        <div>Loading Volunteer Timesheet for Portfolio Review 2...</div>
      );
    }

    if (this.state.isLoading) {
      return (
        <div>Saving changes...</div>
      );
    }

    if (this.props.errors.length > 0) {
      this.props.errors.forEach((error: string) => console.error(error));
      return (
        <div>Failed to load timesheet</div>
      );
    }

    return (
      <div className="Meeting-Assignment-Sheet">
        <h2>Meeting Assignment Sheet</h2>

        {this._renderVolunteerTables(volunteers ?? [])}

        {
          <>
            <div className="table">
              <div className="table__rows">

                <div className="table__row table__row--header">
                  <div className="table__cell table__cell--header">Time</div>
                  <div className="table__cell table__cell--header">Name</div>
                  <div className="table__cell table__cell--header">Portfolio</div>
                  <div className="table__cell table__cell--header">Resume</div>
                </div>

                {event && this._renderTimeOptions(event.createTimeSlots(20, 5))}

              </div>
            </div>
            <button onClick={() => this._onSaveChanges()}>Save Changes</button>
          </>
        }
      </div>
    )
  }
}

export default connector(MeetingAssignmentSheetPR2);
