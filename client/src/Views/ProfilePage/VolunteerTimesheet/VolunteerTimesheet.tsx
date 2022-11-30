import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { } from 'Store/actions/types';
import { } from 'Store/actions';

import { Usertype } from 'Shared/enums';


interface OwnProps {
}

interface OwnState {
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  return {

  }
}
const mapDispatchToProps = { };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class VolunteerTimesheet extends React.Component<Props, OwnState> {
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

            <div className="table__row">
              <div className="table__cell table__cell--time">Time</div>
              <div className="table__cell table__cell--name">Name</div>
              <div className="table__cell table__cell--portfolio">Portfolio</div>
              <div className="table__cell table__cell--resume">Resume</div>
            </div>
            <div className="table__row">
              <div className="table__cell table__cell--time">Time</div>
              <div className="table__cell table__cell--name">Name</div>
              <div className="table__cell table__cell--portfolio">Portfolio</div>
              <div className="table__cell table__cell--resume">Resume</div>
            </div>
            <div className="table__row">
              <div className="table__cell table__cell--time">Time</div>
              <div className="table__cell table__cell--name">Name</div>
              <div className="table__cell table__cell--portfolio">Portfolio</div>
              <div className="table__cell table__cell--resume">Resume</div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

export default connector(VolunteerTimesheet);
