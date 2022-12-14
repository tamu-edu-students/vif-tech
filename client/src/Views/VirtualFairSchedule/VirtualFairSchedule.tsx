import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { eventActionTypes, companyActionTypes, virtualFairAttendanceActionTypes } from 'Store/actions/types';
import { fetchEvents, fetchCompanies, fetchVirtualFairAttendance } from 'Store/actions';

import Event from 'Shared/entityClasses/Event';
import Company from 'Shared/entityClasses/Company';

import VirtualFairScheduleRow from './VirtualFairScheduleRow/VirtualFairScheduleRow';


interface OwnProps {

}

interface OwnState {
}

type TimeOption = {
  start_time: string;
  end_time: string;
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  const event: Event | null = Event.findByTitle('Virtual Fair', state.eventData.events);

  const eventsAreStale: boolean = state.eventData.isStale;
  const isLoading_fetchEvents: boolean = createLoadingSelector([eventActionTypes.FETCH_EVENTS])(state);

  const virtualFairAttendanceIsStale: boolean = state.virtualFairAttendanceData.isStale;
  const isLoading_fetchVirtualFairAttendance: boolean = createLoadingSelector([virtualFairAttendanceActionTypes.FETCH_VIRTUAL_FAIR_ATTENDANCE])(state);

  const companiesAreStale: boolean = state.companyData.isStale;
  const isLoading_fetchCompanies: boolean = createLoadingSelector([companyActionTypes.FETCH_COMPANIES])(state);

  return {
    event,
    virtualFairMeetings: state.virtualFairAttendanceData.virtualFairMeetings,
    attendingCompanies: Company.findByIds(state.virtualFairAttendanceData.attendingCompanyIds, state.companyData.companies),

    eventsAreStale,
    isLoading_fetchEvents,

    virtualFairAttendanceIsStale,
    isLoading_fetchVirtualFairAttendance,

    companiesAreStale,
    isLoading_fetchCompanies,
    
    isLoading:
      eventsAreStale || isLoading_fetchEvents
      || virtualFairAttendanceIsStale || isLoading_fetchVirtualFairAttendance
      || companiesAreStale || isLoading_fetchCompanies,
    errors: createErrorMessageSelector([
      eventActionTypes.FETCH_EVENTS,
      virtualFairAttendanceActionTypes.FETCH_VIRTUAL_FAIR_ATTENDANCE,
      companyActionTypes.FETCH_COMPANIES,
    ])(state),
  };
};
const mapDispatchToProps = { fetchEvents, fetchCompanies, fetchVirtualFairAttendance: fetchVirtualFairAttendance };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class VirtualFairSchedule extends React.Component<Props, OwnState> {
  public componentDidMount(): void {
    if (this.props.eventsAreStale && !this.props.isLoading_fetchEvents) {
      this.props.fetchEvents();
    }
    if (this.props.virtualFairAttendanceIsStale && !this.props.isLoading_fetchVirtualFairAttendance) {
      this.props.fetchVirtualFairAttendance();
    }
    if (this.props.companiesAreStale && !this.props.isLoading_fetchCompanies) {
      this.props.fetchCompanies();
    }
  }

  public componentDidUpdate(): void {
    if (this.props.eventsAreStale && !this.props.isLoading_fetchEvents) {
      this.props.fetchEvents();
    }
    if (this.props.virtualFairAttendanceIsStale && !this.props.isLoading_fetchVirtualFairAttendance) {
      this.props.fetchVirtualFairAttendance();
    }
    if (this.props.companiesAreStale && !this.props.isLoading_fetchCompanies) {
      this.props.fetchCompanies();
    }
  }

  private _renderTimeSlots(timeSlots: any[]): JSX.Element[] {
    return timeSlots.map(({start_time, end_time}: TimeOption) => {
      return (
        <React.Fragment key={start_time}>
          <VirtualFairScheduleRow
            start_time={start_time}
            end_time={end_time}
            virtualFairMeetings={this.props.virtualFairMeetings}
            attendingCompanies={this.props.attendingCompanies}
          />
        </React.Fragment>
      );
    });
  }

  private _renderCompanyNameCells(): JSX.Element[] {
    return this.props.attendingCompanies.map((company: Company) => {
      return (
        <div key={company.name} className="table__cell table__cell--header">{company.name}</div>
      )
    })
  }

  public render(): React.ReactElement<Props> {
    const {
      event,
    } = this.props;

    if (this.props.isLoading) {
      return (
        <div>Loading Virtual Fair Schedule...</div>
      );
    }

    if (this.props.errors.length > 0) {
      this.props.errors.forEach((error: string) => console.error(error));
      return (
        <div className="error">Failed to load schedule</div>
      );
    }

    return (
      <div className="Virtual-Fair-Schedule">
        <h2>Virtual Fair Schedule</h2>
          <div className="table">
            <div className="table__rows">

              <div className="table__row table__row--header">
                <div className="table__cell table__cell--header">Time</div>
                <div className="table__cell table__cell--header">Company Availability</div>
                {/* {this._renderCompanyNameCells()} */}
              </div>

              {event && this._renderTimeSlots(event.createTimeSlots(30, 0))}

            </div>
          </div>
      </div>
    )
  }
}

export default connector(VirtualFairSchedule);
