import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import {eventActionTypes } from 'Store/actions/types';
import { fetchEvents, fetchAvailabilities } from 'Store/actions';

import { msToTimeString } from 'Shared/utils';
import Event from 'Shared/entityClasses/Event';


interface OwnProps {

}

interface OwnState {
}

type TimeOption = {
  start_time: string;
  end_time: string;
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  return {
    event: Event.findByTitle('Portfolio Review 2', state.eventData.events),
    availabilities: null,

    eventsAreStale: state.eventData.isStale,
    isLoading_fetchEvents: createLoadingSelector([eventActionTypes.FETCH_EVENTS])(state),
    errors_fetchEvents: createErrorMessageSelector([eventActionTypes.FETCH_EVENTS])(state)
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
  }

  private _renderTimeOptions(timeSlots: any[]): JSX.Element[] {
    return timeSlots.map(({start_time, end_time}: TimeOption) => {
      const startTimeShort = msToTimeString(Date.parse(start_time), 'CST');
      const endTimeShort = msToTimeString(Date.parse(end_time), 'CST');
      return (
        <div key={startTimeShort} className="table__row">
          <div className="table__cell table__cell--time">
            {`${startTimeShort}—${endTimeShort}`}
          </div>
          <div className="table__cell table__cell--name">Firstname Lastname</div>
          <div className="table__cell table__cell--portfolio">someportfolio.myportfolio.com</div>
          <div className="table__cell table__cell--resume">someresume.somewebsite.com</div>
        </div>
      )
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

    if (this.props.errors_fetchEvents.length > 0) {
      this.props.errors_fetchEvents.forEach((error: string) => console.error(error));
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
