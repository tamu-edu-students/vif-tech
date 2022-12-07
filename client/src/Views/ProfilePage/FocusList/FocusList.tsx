import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { focusActionTypes } from 'Store/actions/types';
import { fetchFocuses, createFocus, showModal, hideModal } from 'Store/actions';

import Focus from 'Shared/entityClasses/Focus';

import FocusEntry from './FocusEntry/FocusEntry';
import FocusForm from './FocusForm/FocusForm';


interface OwnProps {
}
interface OwnState {
}

const mapStateToProps = (state: IRootState) => {
  const focusesAreStale: boolean = state.focusData.isStale;
  const isLoading_fetchFocuses: boolean = createLoadingSelector([focusActionTypes.FETCH_FOCUSES])(state);
  const isLoading: boolean = createLoadingSelector([
    focusActionTypes.FETCH_FOCUSES,
    focusActionTypes.CREATE_FOCUS,
    focusActionTypes.UPDATE_FOCUS,
    focusActionTypes.DELETE_FOCUS,
  ])(state);
  const errors: string[] = createErrorMessageSelector([
    focusActionTypes.FETCH_FOCUSES,
    focusActionTypes.CREATE_FOCUS,
    focusActionTypes.UPDATE_FOCUS,
    focusActionTypes.DELETE_FOCUS,
  ])(state);

  return {
    focuses: state.focusData.focuses,
    focusesAreStale,
    isLoading,
    isLoading_fetchFocuses,
    errors,
  };
}
const mapDispatchToProps = { fetchFocuses, createFocus, showModal, hideModal };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class FocusList extends React.Component<Props, OwnState> {
  componentDidMount(): void {
    if (this.props.focusesAreStale && !this.props.isLoading_fetchFocuses) {
      this.props.fetchFocuses();
    }
  }

  private _onFocusSubmit = (formValues: any) => {
    this.props.hideModal();
    this.props.createFocus(formValues);
  }

  private _renderForm = (): void => {
    this.props.showModal((
      <FocusForm
        form="createFocus"
        onSubmit={this._onFocusSubmit}
        onCancel={this.props.hideModal}
      />
    ));
  }

  private _renderFocuses = (): JSX.Element[] => {
    return this.props.focuses.map((focus: Focus) => (
      <React.Fragment key={focus.id}>
        <FocusEntry focus={focus} />
      </React.Fragment>
    ));
  }

  public render(): React.ReactElement<Props> {
    const {
      focuses,
    } = this.props;

    if (this.props.focusesAreStale || this.props.isLoading) {
      return (
        <div>Loading Focuses...</div>
      );
    }


    if (this.props.errors.length > 0) {
      this.props.errors.forEach((error: string) => console.error(error));
    }

    return (
      <div className="Focus-List">
        <h1 className="heading-primary">Focus List</h1>
        <div className="focus-list">
          {
            focuses.length > 0
            ? (<>{ this._renderFocuses() }</>)
            : (<p>No focuses yet!</p>)
          }
        </div>
        {
          <button className="focus-list__add-button" onClick={() => this._renderForm()}>Add Focus</button>
        }
      </div>
    );
  }
}

export default connector(FocusList);
