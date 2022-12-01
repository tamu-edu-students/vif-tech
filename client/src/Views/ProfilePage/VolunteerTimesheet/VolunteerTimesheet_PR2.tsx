import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import {eventActionTypes, availabilityActionTypes } from 'Store/actions/types';
import { fetchEvents, fetchAvailabilities } from 'Store/actions';

import { msToTimeString } from 'Shared/utils';
import Event from 'Shared/entityClasses/Event';
import Availability from 'Shared/entityClasses/Availability';

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

  const availabilitiesAreStale: boolean = state.availabilityData.isStale;
  const isLoading_fetchAvailabilities: boolean = createLoadingSelector([availabilityActionTypes.FETCH_AVAILABILITIES])(state);

  return {
    event,
    availabilities: state.auth.user?.findAvailabilities(event?.findAvailabilities(state.availabilityData.availabilities) ?? []) ?? [],

    eventsAreStale,
    isLoading_fetchEvents,

    availabilitiesAreStale,
    isLoading_fetchAvailabilities,
    
    isLoading: eventsAreStale || isLoading_fetchEvents || availabilitiesAreStale || isLoading_fetchAvailabilities,
    errors: createErrorMessageSelector([eventActionTypes.FETCH_EVENTS, availabilityActionTypes.FETCH_AVAILABILITIES])(state),
  };
};
const mapDispatchToProps = { fetchEvents, fetchAvailabilities, };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class VolunteerTimesheet_PR2 extends React.Component<Props, OwnState> {
  public componentDidMount(): void {
    if (this.props.eventsAreStale && !this.props.isLoading_fetchEvents) {
      this.props.fetchEvents();
    }
    if (this.props.availabilitiesAreStale && !this.props.isLoading_fetchAvailabilities) {
      this.props.fetchAvailabilities();
    }
  }

  private _renderTimeOptions(timeSlots: any[]): JSX.Element[] {
    return timeSlots.map(({start_time, end_time}: TimeOption) => {
      const { availabilities, event } = this.props;
      return (
        <React.Fragment key={start_time}>
          <VolunteerTimesheetRow
            start_time={start_time}
            end_time={end_time}
            availability={availabilities.find((availability: Availability) =>
              availability.start_time === start_time && availability.end_time === end_time
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
