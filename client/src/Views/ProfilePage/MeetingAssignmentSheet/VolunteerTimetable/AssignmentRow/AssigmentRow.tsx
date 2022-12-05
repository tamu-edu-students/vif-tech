import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
// import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
// import {eventActionTypes } from 'Store/actions/types';
import { updateMeeting } from 'Store/actions';

import { msToTimeString } from 'Shared/utils';
// import Event from 'Shared/entityClasses/Event';
import Meeting from 'Shared/entityClasses/Meeting';
import StudentSelectForm from './StudentSelectForm/StudentSelectForm';

import { OptionsContext } from '../../OptionsContext';


interface OwnProps {
  start_time: string;
  end_time: string;
  event_id: number;
  meeting: Meeting;
}

interface OwnState {
  isChanged: boolean;
}

// type TimeOption = {
//   start_time: string;
//   end_time: string;
// }

const mapStateToProps = (state: IRootState, ownProps: any) => {
  const meeting: Meeting = ownProps.meeting;
  return {
    owner_id: meeting.owner_id,
    initialInvitee: meeting?.findInvitee(state.userData.users) ?? null,
    keyVal: `${ownProps.event_id} ${meeting.id} ${ownProps.owner_id} ${ownProps.start_time} ${ownProps.end_time}`,
  };
};
const mapDispatchToProps = { updateMeeting };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class AssignmentRow extends React.Component<Props, OwnState> {
  state = { isChanged: false };
  static contextType = OptionsContext;
  context!: React.ContextType<typeof OptionsContext>;

  public componentDidMount(): void {
  }

  private _onSelectionChange = (inviteeId: number): void => {
    const { keyVal: key } = this.props;
    let reaction: any = null;
    const {initialInvitee} = this.props;
    if (initialInvitee) {
      if (inviteeId === -1){
        reaction = () => this.props.updateMeeting(this.props.meeting.id, -1);
      }
      else if (initialInvitee.id === inviteeId) {
        reaction = () => Promise.resolve();
      }
      else {
        reaction = () => this.props.updateMeeting(this.props.meeting.id, inviteeId);
      }
    }
    else {
      if (inviteeId === -1) {
        reaction = () => Promise.resolve();
      }
      else {
        reaction = () => this.props.updateMeeting(this.props.meeting.id, inviteeId);
      }
    }

    this.context.setReaction(key, reaction);
  }

  public render(): React.ReactElement<Props> {
    const {
      start_time,
      end_time,
      keyVal: key,
      initialInvitee,
    } = this.props;
    
    const startTimeShort = msToTimeString(Date.parse(start_time), 'CST');
    const endTimeShort = msToTimeString(Date.parse(end_time), 'CST');

    return (
      <div className="AssignmentRow table__row">
        <div className="table__cell table__cell--time">
          <div
            className={`table__time-block ${
              ''
              // isAvailable
              // ? (this.state.isChanged ? 'table__time-block--deleting' : 'table__time-block--available')
              // : (this.state.isChanged ? 'table__time-block--adding' : '')
            }`}
          >
              {`${startTimeShort}—${endTimeShort}`}
          </div>
        </div>
        <div className="table__cell table__cell--name">
          <StudentSelectForm
            keyVal={key}
            initialInvitee={initialInvitee}
            onSelectionChange={this._onSelectionChange}
          />
        </div>
      </div>
    )
  }
}

export default connector(AssignmentRow);
