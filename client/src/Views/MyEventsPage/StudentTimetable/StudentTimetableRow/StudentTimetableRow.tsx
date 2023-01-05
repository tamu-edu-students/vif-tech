import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { } from 'Store/actions';

import { msToTimeString } from 'Shared/utils';
import Meeting from 'Shared/entityClasses/Meeting';
import User from 'Shared/entityClasses/User';

import TimetableRowButton from "Components/TimetableRowButton/TimetableRowButton";


interface OwnProps {
  start_time: string;
  end_time: string;
  event_id: number;
  meeting: Meeting | null;
  assignee?: User;
}

interface OwnState {
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  return {
    // owner_id: state.auth.user?.id ?? -1,
  };
};
const mapDispatchToProps = { };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class StudentTimetableRow extends React.Component<Props, OwnState> {
  public componentDidMount(): void {

  }

  private _generateButtonColor(): string {
    return this.props.meeting ? 'green' : '';
  }

  private _generateTimeString(): string {
    const startTimeShort = msToTimeString(Date.parse(this.props.start_time), 'CST');
    const endTimeShort = msToTimeString(Date.parse(this.props.end_time), 'CST');

    return `${startTimeShort}—${endTimeShort}`;
  }

  public render(): React.ReactElement<Props> {
    const {
      assignee,
    } = this.props;

    return (
      <div className="student-timetable-row table__row table__row--student">
        <div className="table__cell table__cell--time">
          <TimetableRowButton
            disabled={true}
            modifier={this._generateButtonColor()}
          >
            {this._generateTimeString()}
          </TimetableRowButton>
        </div>
        <div className="table__cell table__cell--name">{assignee && `${assignee.firstname} ${assignee.lastname}`}</div>
        <div className="table__cell table__cell--email">{assignee && <a href={`mailto:${assignee.email}`}>{assignee.email}</a>}</div>
      </div>
    )
  }
}

export default connector(StudentTimetableRow);
