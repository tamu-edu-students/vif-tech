import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import {eventActionTypes } from 'Store/actions/types';
import { fetchEvents, fetchAvailabilities } from 'Store/actions';

import { msToTimeString } from 'Shared/utils';
import Event from 'Shared/entityClasses/Event';


interface OwnProps {
  start_time: string;
  end_time: string;
}

interface OwnState {
}

type TimeOption = {
  start_time: string;
  end_time: string;
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  return {
  };
};
const mapDispatchToProps = { fetchEvents, fetchAvailabilities, };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class VolunteerTimesheetRow extends React.Component<Props, OwnState> {
  public componentDidMount(): void {
  }

  public render(): React.ReactElement<Props> {
    const {
      start_time,
      end_time,
    } = this.props;
    
    const startTimeShort = msToTimeString(Date.parse(start_time), 'CST');
    const endTimeShort = msToTimeString(Date.parse(end_time), 'CST');

    return (
      <div className="VolunteerTimesheetRow table__row">
        <div className="table__cell table__cell--time">
          <button className="table__time-button">
              {`${startTimeShort}—${endTimeShort}`}
          </button>
        </div>
        <div className="table__cell table__cell--name"></div>
        <div className="table__cell table__cell--portfolio"></div>
        <div className="table__cell table__cell--resume"></div>
      </div>
    )
  }
}

export default connector(VolunteerTimesheetRow);