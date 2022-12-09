import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { } from 'Store/actions';

import { msToTimeString } from 'Shared/utils';
import Meeting from 'Shared/entityClasses/Meeting';
import User from 'Shared/entityClasses/User';


interface OwnProps {
  start_time: string;
  end_time: string;
  event_id: number;
  meeting: Meeting | null;
  assignedVolunteer?: User;
}

interface OwnState {
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  return {
    hadMeeting: ownProps.meeting !== null,
    owner_id: state.auth.user?.id ?? -1,
  };
};
const mapDispatchToProps = { };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class StudentTimesheetRow extends React.Component<Props, OwnState> {
  public componentDidMount(): void {

  }

  public render(): React.ReactElement<Props> {
    const {
      start_time,
      end_time,
      hadMeeting,
      assignedVolunteer,
    } = this.props;
    
    const startTimeShort = msToTimeString(Date.parse(start_time), 'CST');
    const endTimeShort = msToTimeString(Date.parse(end_time), 'CST');

    return (
      <div className="StudentTimesheetRow table__row">
        <div className="table__cell table__cell--time">
          <div
            className={`table__time-block ${hadMeeting ? 'table__time-block--available' : ''}`}
          >
              {`${startTimeShort}—${endTimeShort}`}
          </div>
        </div>
        <div className="table__cell table__cell--name">{assignedVolunteer && `${assignedVolunteer.firstname} ${assignedVolunteer.lastname}`}</div>
        <div className="table__cell table__cell--email">{assignedVolunteer && assignedVolunteer.email}</div>
      </div>
    )
  }
}

export default connector(StudentTimesheetRow);
