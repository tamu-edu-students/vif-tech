import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { } from 'Store/actions/types';
import { } from 'Store/actions';

import Event from 'Shared/entityClasses/Event';
import User from 'Shared/entityClasses/User';
import Meeting from 'Shared/entityClasses/Meeting';

import AssigmentRow from './AssignmentRow/AssigmentRow';
import Focus from 'Shared/entityClasses/Focus';


interface OwnProps {
  volunteer: User;
  event: Event;
}

interface OwnState {
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  const volunteer: User = ownProps.volunteer;
  const meetings: Meeting[] = volunteer.findOwnedMeetings(state.meetingData.meetings);
  const focusString: string = volunteer
    .findFocuses(state.focusData.focuses, state.userFocusData.userFocuses)
    .map((focus: Focus) => focus.name)
    .join(',   ');

  return {
    meetings,
    focusString,
  };
};
const mapDispatchToProps = { };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class AssignmentTimetable extends React.Component<Props, OwnState> {
  public componentDidMount(): void {
  }

  public componentDidUpdate(): void {
  }

  private _renderTimeOptions(): JSX.Element[] {
    const { meetings, event } = this.props;
    return meetings
    .sort((a: Meeting, b: Meeting) => a.start_time.toLowerCase().localeCompare(b.start_time.toLowerCase()))
    .map((meeting: Meeting) => {
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
      volunteer: {title},
      event,
      focusString
    } = this.props;

    return (
      <div className="assignment-timetable timetable timetable--assignment">
        <div className="assignment-timetable__heading">
          <h2 className='assignment-timetable__name'>{volunteer.firstname} {volunteer.lastname}</h2>
          {
            focusString &&
            <div className="assignment-timetable__focuses">
              <div className="assignment-timetable__focuses-heading">Specialties</div>
              <p>{focusString}</p>
            </div>
          }
          {
            title && <div className="assignment-timetable__job-title">{title}</div>
          }
        </div>

        {
          //TODO: handle case where volunteer/rep has 0 availabile slots
          <>
            <div className="table">
              <div className="table__rows">

                <div className="table__row table__row--assignment table__row--header">
                  <div className="table__cell table__cell--header table__cell--time">Time</div>
                  <div className="table__cell table__cell--header">Name</div>
                </div>

                {event && this._renderTimeOptions()}

              </div>
            </div>
          </>
        }
      </div>
    )
  }
}

export default connector(AssignmentTimetable);
