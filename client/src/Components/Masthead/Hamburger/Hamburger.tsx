import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { showModal } from 'Store/actions';

interface OwnProps {

}

interface OwnState {

}

const mapStateToProps = (state: IRootState) => {return {};}
const mapDispatchToProps = { showModal };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class Hamburger extends React.Component<Props, OwnState> {
  public render(): React.ReactElement<Props> {
    return (
      <div className="hamburger">
        <button className="hamburger__button" type="button">
          <div className="hamburger__bar"></div>
          <div className="hamburger__bar"></div>
          <div className="hamburger__bar"></div>
        </button>
      </div>
    );
  }
}

export default connector(Hamburger);
