import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { } from 'Store/actions';

import { msToTimeString } from 'Shared/utils';
import Company from 'Shared/entityClasses/Company';
import VirtualFairMeeting from 'Shared/entityClasses/VirtualFairMeeting';

type TimeOption = {
  start_time: string;
  end_time: string;
}

interface OwnProps {
  start_time: string;
  end_time: string;
  virtualFairMeetings: VirtualFairMeeting[];
  attendingCompanies: Company[];
}

interface OwnState {
}

const mapStateToProps = null
const mapDispatchToProps = { };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class VirtualFairScheduleRow extends React.Component<Props, OwnState> {
  public componentDidMount(): void {

  }

  private _renderCompanyCells(): JSX.Element[] {
    const { virtualFairMeetings, start_time, end_time } = this.props;
    return this.props.attendingCompanies.map((company: Company) => {
      const matchesTimeBlock: boolean = company.getAvailabilitiesForVirtualFair(virtualFairMeetings)
        .some((timeOption: TimeOption) => {
          return timeOption.start_time === start_time && timeOption.end_time === end_time;
        });
      
      if (matchesTimeBlock) {
        return (
          <div key={company.name} className="table__cell table__cell--company-block table__cell--filled">{company.name}</div>
        )
      }
      else {
        return (
          <div key={company.name} className="table__cell table__cell--company-block"></div>
        )
      }
    });
  }

  public render(): React.ReactElement<Props> {
    const {
      start_time,
      end_time,
    } = this.props;
    
    const startTimeShort = msToTimeString(Date.parse(start_time), 'CST');
    const endTimeShort = msToTimeString(Date.parse(end_time), 'CST');

    return (
      <div className="VirtualFairScheduleRow table__row">
        <div className="table__cell table__cell--time">
          <div className="table__time-block">{`${startTimeShort}—${endTimeShort}`}</div>
        </div>
        {this._renderCompanyCells()}
      </div>
    )
  }
}

export default connector(VirtualFairScheduleRow);
