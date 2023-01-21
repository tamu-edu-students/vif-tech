import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { eventActionTypes, meetingActionTypes, eventSignupActionTypes, userActionTypes, focusActionTypes, userFocusActionTypes } from 'Store/actions/types';
import { fetchEvents, fetchMeetings, fetchEventSignups, fetchUsers, createEventSignup, deleteEventSignup, fetchFocuses, fetchUserFocuses } from 'Store/actions';

import Event from 'Shared/entityClasses/Event';
import User from 'Shared/entityClasses/User';

import AssignmentTimetable from './AssignmentTimetable/AssignmentTimetable';
import { OptionsContext } from './OptionsContext';


interface OwnProps {
  eventTitle: string;
}

interface OwnState {
  dispatchQueue: any;
  isLoading: boolean;
  unassignedStudents: User[];
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  const event: Event | null = Event.findByTitle(ownProps.eventTitle, state.eventData.events);
  const attendees = event?.findAttendees(state.userData.users, state.eventSignupData.eventSignups) ?? [];
  const volunteerAttendees: User[] = attendees.filter((user: User) => user.isVolunteer || user.isRepresentative);
  const studentAttendees: User[] = attendees.filter((user: User) => user.isStudent);

  const usersAreStale: boolean = state.userData.isStale;
  const isLoading_fetchUsers: boolean = createLoadingSelector([userActionTypes.FETCH_USERS])(state);

  const eventsAreStale: boolean = state.eventData.isStale;
  const isLoading_fetchEvents: boolean = createLoadingSelector([eventActionTypes.FETCH_EVENTS])(state);

  const meetingsAreStale: boolean = state.meetingData.isStale;
  const isLoading_fetchMeetings: boolean = createLoadingSelector([meetingActionTypes.FETCH_MEETINGS])(state);

  const eventSignupsAreStale: boolean = state.eventSignupData.isStale;
  const isLoading_fetchEventSignups: boolean = createLoadingSelector([eventSignupActionTypes.FETCH_EVENT_SIGNUPS])(state);

  const focusesAreStale: boolean = state.focusData.isStale;
  const isLoading_fetchFocuses: boolean = createLoadingSelector([focusActionTypes.FETCH_FOCUSES])(state);

  const userFocusesAreStale: boolean = state.userFocusData.isStale;
  const isLoading_fetchUserFocuses: boolean = createLoadingSelector([userFocusActionTypes.FETCH_USER_FOCUSES])(state);

  return {
    event,
    volunteerAttendees,
    studentAttendees,
    meetings: event?.findMeetings(state.meetingData.meetings) ?? [],

    usersAreStale,
    isLoading_fetchUsers,

    eventsAreStale,
    isLoading_fetchEvents,

    meetingsAreStale,
    isLoading_fetchMeetings,

    eventSignupsAreStale,
    isLoading_fetchEventSignups,

    focusesAreStale,
    isLoading_fetchFocuses,

    userFocusesAreStale,
    isLoading_fetchUserFocuses,
    
    isLoading:
      eventsAreStale || isLoading_fetchEvents
      || meetingsAreStale || isLoading_fetchMeetings
      || eventSignupsAreStale || isLoading_fetchEventSignups
      || usersAreStale || isLoading_fetchUsers
      || focusesAreStale || isLoading_fetchFocuses
      || userFocusesAreStale || isLoading_fetchUserFocuses,

    errors: createErrorMessageSelector([
      eventActionTypes.FETCH_EVENTS,
      meetingActionTypes.FETCH_MEETINGS,
      meetingActionTypes.UPDATE_MEETING, //TODO: Handle special case of update failures
      eventSignupActionTypes.FETCH_EVENT_SIGNUPS,
      userActionTypes.FETCH_USERS,
      focusActionTypes.FETCH_FOCUSES,
      userFocusActionTypes.FETCH_USER_FOCUSES,
    ])(state),
  };
};
const mapDispatchToProps = { fetchEvents, fetchMeetings, fetchEventSignups, fetchUsers, createEventSignup, deleteEventSignup, fetchFocuses, fetchUserFocuses };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class MeetingAssignmentSheet extends React.Component<Props, OwnState> {
  state = {dispatchQueue: {}, isLoading: false, unassignedStudents: []};

  public componentDidMount(): void {
    const promises: Promise<void>[] = [];
    if (this.props.eventsAreStale && !this.props.isLoading_fetchEvents) {
      const promise: Promise<void> = this.props.fetchEvents();
      promises.push(promise);
    }
    if (this.props.meetingsAreStale && !this.props.isLoading_fetchMeetings) {
      const promise: Promise<void> = this.props.fetchMeetings();
      promises.push(promise);
    }
    if (this.props.eventSignupsAreStale && !this.props.isLoading_fetchEventSignups) {
      const promise: Promise<void> = this.props.fetchEventSignups();
      promises.push(promise);
    }
    if (this.props.usersAreStale && !this.props.isLoading_fetchUsers) {
      const promise: Promise<void> = this.props.fetchUsers();
      promises.push(promise);
    }
    if (this.props.focusesAreStale && !this.props.isLoading_fetchFocuses) {
      const promise: Promise<void> = this.props.fetchFocuses();
      promises.push(promise);
    }
    
    if (this.props.userFocusesAreStale && !this.props.isLoading_fetchUserFocuses) {
      const promise: Promise<void> = this.props.fetchUserFocuses();
      promises.push(promise);
    }
    Promise.all(promises).then(() => {
      this.setState({ unassignedStudents: this.props.studentAttendees.filter((student: User) =>
        this.props.event && !student.hasInvitedMeetingsAtEvent(this.props.meetings, this.props.event)
      )});
    });
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
    if (this.props.focusesAreStale && !this.props.isLoading_fetchFocuses) {
      this.props.fetchFocuses();
    }
    if (this.props.userFocusesAreStale && !this.props.isLoading_fetchUserFocuses) {
      this.props.fetchUserFocuses();
    }
  }

  private _swapOption = (toReinstate: number, toSteal: number): void => {
    const newArray: User[] = this.state.unassignedStudents.filter((student: User) => student.id !== toSteal);
    if (toReinstate > -1) {
      const studentToReinstate: User | null = User.findById(toReinstate, this.props.studentAttendees);
      if (studentToReinstate) { newArray.push(studentToReinstate); }
    }
    this.setState({ unassignedStudents: newArray });
  }

  private _onSaveChanges = (): void => {
    this.setState({ isLoading: true });

    Promise.allSettled(Object.values(this.state.dispatchQueue).map((func: any) => func()))
    .then(() => {
      this.setState({dispatchQueue: {}, isLoading: false});
    })
  }

  private _setReaction = (key: string, reaction: any) => {
    this.setState({ dispatchQueue: {...this.state.dispatchQueue, [key]: reaction} });
  }

  private _renderTimetables(volunteers: User[]): JSX.Element[] {
    return volunteers.map((volunteer: User) => {
      return (
        <React.Fragment key={volunteer.id}>
            <AssignmentTimetable
              volunteer={volunteer} event={this.props.event}
            />
        </React.Fragment>
      )
    });
  }

  public render(): React.ReactElement<Props> {
    const {
      volunteerAttendees,
      event
    } = this.props;

    if (this.props.errors.length > 0) {
      this.props.errors.forEach((error: string) => console.error(error));
      return (
        <div className="meeting-assignment-sheet">
          <div className="error">{`Failed to load${event?.title ? ` ${event.title}` : ''} assignment sheet`}</div>
        </div>
      );
    }

    if (this.props.isLoading) {
      return (
        <div className="meeting-assignment-sheet">{`Loading Meeting Assignment Sheet${event?.title ? ` for ${event.title}` : ''}...`}</div>
      );
    }

    if (this.state.isLoading) {
      return (
        <div className="meeting-assignment-sheet">Saving changes...</div>
      );
    }

    return (
      <OptionsContext.Provider value={{
        swapOption: this._swapOption,
        unassignedStudents: this.state.unassignedStudents,
        setReaction: this._setReaction,
      }}>
        <div className="meeting-assignment-sheet">
          {/* //TODO: Improve header 2 names  */}
          {/* <h2 className="heading-secondary">{`${event?.title} Meeting Assignment Sheet`}</h2> */}

          <div className="timetables">
            {this._renderTimetables(volunteerAttendees ?? [])}
          </div>

          <button className="btn-wire btn-wire--small" onClick={() => this._onSaveChanges()}>Save Changes</button>
        </div>
      </OptionsContext.Provider>
    )
  }
}

export default connector(MeetingAssignmentSheet);
