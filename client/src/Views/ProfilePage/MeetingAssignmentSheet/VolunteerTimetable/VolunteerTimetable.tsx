import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { } from 'Store/actions/types';
import { } from 'Store/actions';

import Event from 'Shared/entityClasses/Event';
import User from 'Shared/entityClasses/User';
import Meeting from 'Shared/entityClasses/Meeting';
import EventSignup from 'Shared/entityClasses/EventSignup';

import AssigmentRow from './AssignmentRow/AssigmentRow';
// import VolunteerTimesheetRow from './VolunteerTimesheetRow/VolunteerTimesheetRow';


interface OwnProps {
  volunteer: User;
  event: Event;
}

interface OwnState {
}

type TimeOption = {
  start_time: string;
  end_time: string;
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  const volunteer: User = ownProps.volunteer;
  const meetings: Meeting[] = volunteer.findOwnedMeetings(state.meetingData.meetings);

  return {
    meetings,
  };
};
const mapDispatchToProps = { };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class VolunteerTimetable extends React.Component<Props, OwnState> {
  public componentDidMount(): void {
  }

  public componentDidUpdate(): void {
  }

  private _renderTimeOptions(timeSlots: any[]): JSX.Element[] {
    const { meetings, event } = this.props;
    return meetings
    .sort((a: Meeting, b: Meeting) => a.start_time.toLowerCase().localeCompare(b.start_time.toLowerCase()))
    .map((meeting: Meeting) => {
      // const meeting: Meeting | null = 
      return (
        <React.Fragment key={meeting.start_time}>
          <AssigmentRow
            start_time={meeting.start_time}
            end_time={meeting.end_time}
            event_id={event?.id}
            meeting={meeting}
          />
        </React.Fragment>
      );
    });
  }

  public render(): React.ReactElement<Props> {
    const {
      volunteer,
      event,
    } = this.props;

    return (
      <div className="Volunteer-Timetable">
        <h2>{volunteer.firstname} {volunteer.lastname}</h2>

        {
          <>
            <div className="table">
              <div className="table__rows">

                <div className="table__row table__row--header">
                  <div className="table__cell table__cell--header">Time</div>
                  <div className="table__cell table__cell--header">Name</div>
                </div>

                {event && this._renderTimeOptions(event.createTimeSlots(20, 5))}

              </div>
            </div>
          </>
        }
      </div>
    )
  }
}

export default connector(VolunteerTimetable);
