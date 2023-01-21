import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createEventSignup, deleteEventSignup } from 'Store/actions';

import Event from 'Shared/entityClasses/Event';

interface OwnProps {
  event: Event;
  isAttendingEvent: boolean;
}

interface OwnState {

}

const mapStateToProps = (state: IRootState) => {
  return {

  };
}
const mapDispatchToProps = {createEventSignup, deleteEventSignup};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class RegistrationControls extends React.Component<Props, OwnState> {
  public render(): React.ReactElement<Props> {
    const {
      event,
      isAttendingEvent,
    } = this.props;

    return (
      <div className="timetable__registration-controls">
        {
          event.registrationIsOpen &&
            <button
              className="btn-wire btn-wire--small"
              onClick={() => isAttendingEvent
                ? this.props.deleteEventSignup(event?.id ?? -1)
                : this.props.createEventSignup(event?.id ?? -1)}
            >
              {`${isAttendingEvent ? 'Withdraw from' : 'Register for'} ${event?.title}`}
            </button>
        }
        {
          !event.registrationIsOpen &&
          <p className="timetable__message">
            Registration for this event is {`${event.isPreRegistration ? 'not yet open' : 'closed'}`}. No changes can be made at this time.
          </p>
        }

        {
          !isAttendingEvent &&
          <p
            className="timetable__message timetable__message--dark"
          >
            Timetable not available
            {
               (event.isPostRegistration && '')
            || (event.isPreRegistration && '. You did not register for this event!')
            || (event.registrationIsOpen && '. Please register for this event!')
            }
          </p>
        }
      </div>
    )
  }
}

export default connector(RegistrationControls);
