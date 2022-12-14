import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { eventActionTypes, meetingActionTypes, eventSignupActionTypes } from 'Store/actions/types';
import { fetchEvents, fetchMeetings, fetchEventSignups, createEventSignup, deleteEventSignup } from 'Store/actions';

import Event from 'Shared/entityClasses/Event';
import Meeting from 'Shared/entityClasses/Meeting';

import RepresentativeFairTimesheetRow from './RepresentativeFairTimesheetRow/RepresentativeFairTimesheetRow';


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
  const event: Event | null = Event.findByTitle('Virtual Fair', state.eventData.events);
  const isAttendingEvent: boolean = event ? (state.auth.user?.isAttendingEvent(event, state.eventSignupData.eventSignups) ?? false) : false;

  const eventsAreStale: boolean = state.eventData.isStale;
  const isLoading_fetchEvents: boolean = createLoadingSelector([eventActionTypes.FETCH_EVENTS])(state);

  const meetingsAreStale: boolean = state.meetingData.isStale;
  const isLoading_fetchMeetings: boolean = createLoadingSelector([meetingActionTypes.FETCH_MEETINGS])(state);

  const eventSignupsAreStale: boolean = state.eventSignupData.isStale;
  const isLoading_fetchEventSignups: boolean = createLoadingSelector([eventSignupActionTypes.FETCH_EVENT_SIGNUPS])(state);

  return {
    event,
    registrationIsOpen: event?.registrationIsOpen,
    isPreRegistration: event?.isPreRegistration,
    isPostRegistration: event?.isPostRegistration,
    isAttendingEvent,
    meetings: state.auth.user?.findOwnedMeetings(event?.findMeetings(state.meetingData.meetings) ?? []) ?? [],

    eventsAreStale,
    isLoading_fetchEvents,

    meetingsAreStale,
    isLoading_fetchMeetings,

    eventSignupsAreStale,
    isLoading_fetchEventSignups,
    
    isLoading:
      eventsAreStale || isLoading_fetchEvents
      || meetingsAreStale || isLoading_fetchMeetings
      || eventSignupsAreStale || isLoading_fetchEventSignups,
    errors: createErrorMessageSelector([
      eventActionTypes.FETCH_EVENTS,
      meetingActionTypes.FETCH_MEETINGS,
      eventSignupActionTypes.FETCH_EVENT_SIGNUPS,
    ])(state),
  };
};
const mapDispatchToProps = { fetchEvents, fetchMeetings, fetchEventSignups, createEventSignup, deleteEventSignup };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class VolunteerTimesheetPR2 extends React.Component<Props, OwnState> {
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
      const meeting: Meeting | null = meetings.find((meeting: Meeting) => meeting.start_time >= start_time && meeting.end_time <= end_time) ?? null;
      return (
        <React.Fragment key={start_time}>
          <RepresentativeFairTimesheetRow
            start_time={start_time}
            end_time={end_time}
            event_id={event?.id}
            meeting={meeting}
            setReaction={this._setReaction}
            registrationIsOpen={this.props.registrationIsOpen}
          />
        </React.Fragment>
      );
    });
  }

  public render(): React.ReactElement<Props> {
    const {
      event,
      isAttendingEvent,
      registrationIsOpen,
      isPreRegistration,
      isPostRegistration,
    } = this.props;

    if (this.props.isLoading) {
      return (
        <div>Loading Representative Timesheet for Virtual Fair...</div>
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
      <div className="Representative-Fair-Timesheet">
        <h2>Representative Fair Timesheet</h2>

        {
          registrationIsOpen &&
            <button
              onClick={() => isAttendingEvent
                ? this.props.deleteEventSignup(event?.id ?? -1)
                : this.props.createEventSignup(event?.id ?? -1)}
            >
              {`${isAttendingEvent ? 'Unr' : 'R'}egister for ${event?.title}`}
            </button>
        }
        {
          isPreRegistration &&
          <p>Registration is currently not yet open. No registration changes or timeslot modifications can be made at this time.</p>
        }
        {
          isPostRegistration &&
          <p>Registration is currently closed. No registration changes or timeslot modifications can be made at this time.</p>
        }

        {
          !isAttendingEvent && isPostRegistration &&
          <div>{`Timesheet not available. ${registrationIsOpen ? 'Please register for this event!' : 'You did not register for this event!'}`}</div>
        }

        {
          isAttendingEvent &&
          <>
            <div className="table">
              <div className="table__rows">

                <div className="table__row table__row--header">
                  <div className="table__cell table__cell--header">Time</div>
                </div>

                {event && this._renderTimeOptions(event.createTimeSlots(30, 0))}

              </div>
            </div>
            {
              registrationIsOpen && 
              <button onClick={() => this._onSaveChanges()}>Save Changes</button>
            }
          </>
        }
      </div>
    )
  }
}

export default connector(VolunteerTimesheetPR2);
