import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { } from 'Store/actions/types';
import { } from 'Store/actions';

import { Usertype } from 'Shared/enums';
import { msToTimeString } from 'Shared/utils';


interface OwnProps {
}

interface OwnState {
}

type TimeOption = {
  start: string;
  end: string;
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  return {
    timeSlots: [
      {start: '2023-02-16 10:00:00', end: '2023-02-16 10:20:00'},
      {start: '2023-02-16 10:25:00', end: '2023-02-16 10:45:00'},
      {start: '2023-02-16 10:50:00', end: '2023-02-16 11:10:00'},
    ],
  };
};
const mapDispatchToProps = { };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class VolunteerTimesheet extends React.Component<Props, OwnState> {
  private _renderTimeOptions(): JSX.Element[] {
    return this.props.timeSlots.map(({start, end}: TimeOption) => {
      const startTimeShort = msToTimeString(Date.parse(start));
      const endTimeShort = msToTimeString(Date.parse(end));
      return (
        <div key={startTimeShort} className="table__row">
          <div className="table__cell table__cell--time">
            {`${startTimeShort}—${endTimeShort}`}
          </div>
          <div className="table__cell table__cell--name">Mark Child</div>
          <div className="table__cell table__cell--portfolio">meganhecklinger.myportfolio.com</div>
          <div className="table__cell table__cell--resume">meganhecklinger.myportfolio.com</div>
        </div>
      )
    });
  }

  public render(): React.ReactElement<Props> {
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

            {this._renderTimeOptions()}

          </div>
        </div>
      </div>
    )
  }
}

export default connector(VolunteerTimesheet);
