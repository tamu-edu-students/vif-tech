import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { eventActionTypes, meetingActionTypes, eventSignupActionTypes, userActionTypes } from 'Store/actions/types';
import { fetchEvents, fetchMeetings, fetchEventSignups, fetchUsers, createEventSignup, deleteEventSignup } from 'Store/actions';

import Event from 'Shared/entityClasses/Event';
import User from 'Shared/entityClasses/User';

import VolunteerTimetable from './VolunteerTimetable/VolunteerTimetable';
import { OptionsContext } from './OptionsContext';
// import VolunteerTimesheetRow from './VolunteerTimesheetRow/VolunteerTimesheetRow';


interface OwnProps {

}

interface OwnState {
  dispatchQueue: any;
  isLoading: boolean;
  unassignedStudents: User[];
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  const event: Event | null = Event.findByTitle('Portfolio Review 1', state.eventData.events);
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
    Promise.all(promises).then(() => {
      this.setState({ unassignedStudents: this.props.studentAttendees.filter((student: User) =>
        this.props.event && !student.hasInvitedMeetingsAtEvent(this.props.meetings, this.props.event)
      )});
    })
    // if (!this.props.isLoading) {
    //   this.setState({ unassignedStudents: this.props.studentAttendees.filter((student: User) =>
    //     this.props.event && !student.hasInvitationAtEvent(this.props.meetings, this.props.event)
    //   )});
    // }
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
    // if (!this.props.isLoading && !this.state.isLoading) {
    //   this.setState({ unassignedStudents: this.props.studentAttendees.filter((student: User) =>
    //     this.props.event && !student.hasInvitationAtEvent(this.props.meetings, this.props.event)
    //   )});
    // }
  }

  // private _reinstateOption = (option: string): void => {
  //   console.log([...this.state.unassignedStudents, option])
  //   this.setState({ unassignedStudents: [...this.state.unassignedStudents, option] })
  // }

  // private _stealOption = (option: string): void => {
  //   this.setState({ unassignedStudents: this.state.unassignedStudents.filter((unassignedStudent: string) => unassignedStudent !== option) })
  // }

  private _swapOption = (toReinstate: number, toSteal: number): void => {
    // console.log(toReinstate, toSteal)
    const newArray: User[] = this.state.unassignedStudents.filter((student: User) => student.id !== toSteal);
    if (toReinstate > -1) {
      const studentToReinstate: User | null = User.findById(toReinstate, this.props.studentAttendees);
      if (studentToReinstate) { newArray.push(studentToReinstate); }
    }
    this.setState({ unassignedStudents: newArray });
  }

  private _onSaveChanges = (): void => {
    this.setState({ isLoading: true });
    // console.log(this.state.dispatchQueue);

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
        <React.Fragment key={volunteer.id}>
            <VolunteerTimetable volunteer={volunteer} event={this.props.event} />
        </React.Fragment>
      )
    });
  }

  public render(): React.ReactElement<Props> {
    const {
      volunteerAttendees,
    } = this.props;

    if (this.props.isLoading) {
      return (
        <div>Loading Volunteer Timesheet for Portfolio Review 1...</div>
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
      <OptionsContext.Provider value={{
        // reinstateOption: this._reinstateOption,
        // stealOption: this._stealOption,
        swapOption: this._swapOption,
        unassignedStudents: this.state.unassignedStudents,
        setReaction: this._setReaction,
      }}>
        <div className="Meeting-Assignment-Sheet">
          <h2>Meeting Assignment Sheet</h2>

          {this._renderVolunteerTables(volunteerAttendees ?? [])}

          <button onClick={() => this._onSaveChanges()}>Save Changes</button>
        </div>
      </OptionsContext.Provider>
    )
  }
}

export default connector(MeetingAssignmentSheetPR2);
