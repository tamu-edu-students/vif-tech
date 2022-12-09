import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { updateMeeting } from 'Store/actions';

import { msToTimeString } from 'Shared/utils';
import Meeting from 'Shared/entityClasses/Meeting';
import StudentSelectForm from './StudentSelectForm/StudentSelectForm';
import User from 'Shared/entityClasses/User';

import { OptionsContext } from '../../OptionsContext';

enum Status {
  NO_CHANGE,
  DELETING,
  ADDING,
  SWAPPING,
}


interface OwnProps {
  start_time: string;
  end_time: string;
  event_id: number;
  meeting: Meeting;
}

interface OwnState {
  status: Status;
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  const meeting: Meeting = ownProps.meeting;
  const initialInvitee: User | null = meeting?.findInvitee(state.userData.users) ?? null;
  const hadAssignment: boolean = initialInvitee ? true : false;
  return {
    owner_id: meeting.owner_id,
    initialInvitee,
    hadAssignment,
    keyVal: `${ownProps.event_id} ${meeting.id} ${ownProps.owner_id} ${ownProps.start_time} ${ownProps.end_time}`,
  };
};
const mapDispatchToProps = { updateMeeting };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class AssignmentRow extends React.Component<Props, OwnState> {
  state = { status: Status.NO_CHANGE };
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
        this.setState({ status: Status.DELETING });
      }
      else if (initialInvitee.id === inviteeId) {
        reaction = () => Promise.resolve();
        this.setState({ status: Status.NO_CHANGE });
      }
      else {
        reaction = () => this.props.updateMeeting(this.props.meeting.id, inviteeId);
        this.setState({ status: Status.SWAPPING });
      }
    }
    else {
      if (inviteeId === -1) {
        reaction = () => Promise.resolve();
        this.setState({ status: Status.NO_CHANGE });
      }
      else {
        reaction = () => this.props.updateMeeting(this.props.meeting.id, inviteeId);
        this.setState({ status: Status.ADDING });
      }
    }

    this.context.setReaction(key, reaction);
  }

  public render(): React.ReactElement<Props> {
    const {
      start_time,
      end_time,
      hadAssignment,
      keyVal: key,
      initialInvitee,
    } = this.props;

    const { status } = this.state;
    
    const startTimeShort = msToTimeString(Date.parse(start_time), 'CST');
    const endTimeShort = msToTimeString(Date.parse(end_time), 'CST');

    return (
      <div className="AssignmentRow table__row">
        <div className="table__cell table__cell--time">
          <div
            className={`table__time-block ${
              hadAssignment
              ? (
                  (status === Status.DELETING ? 'table__time-block--deleting' : '')
                  || (status === Status.SWAPPING ? 'table__time-block--swapping' : '')
                  || (status === Status.NO_CHANGE ? 'table__time-block--filled' : '')
                )
              : (
                (status === Status.ADDING ? 'table__time-block--adding' : '')
              )
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
