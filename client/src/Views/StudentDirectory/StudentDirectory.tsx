import React from 'react';
import { connect, ConnectedProps } from "react-redux";
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { userActionTypes, focusActionTypes, userFocusActionTypes } from 'Store/actions/types';
import { fetchUsers, fetchFocuses, fetchUserFocuses } from "Store/actions";

import User from 'Shared/entityClasses/User';
import Focus from 'Shared/entityClasses/Focus';


interface OwnProps {
}

interface OwnState {
}

const mapStateToProps = (state: IRootState) => {
  const usersAreStale: boolean = state.userData.isStale;
  const isLoading_fetchUsers: boolean = createLoadingSelector([userActionTypes.FETCH_USERS])(state);
  
  const focusesAreStale: boolean = state.focusData.isStale;
  const isLoading_fetchFocuses: boolean = createLoadingSelector([focusActionTypes.FETCH_FOCUSES])(state);

  const userFocusesAreStale: boolean = state.userFocusData.isStale;
  const isLoading_fetchUserFocuses: boolean = createLoadingSelector([userFocusActionTypes.FETCH_USER_FOCUSES])(state);

  return {
    students: state.userData.users.filter((user: User) => user.isStudent),
    focuses: state.focusData.focuses,
    userFocuses: state.userFocusData.userFocuses,

    usersAreStale,
    isLoading_fetchUsers,

    focusesAreStale,
    isLoading_fetchFocuses,

    userFocusesAreStale,
    isLoading_fetchUserFocuses,

    isLoading:
      usersAreStale || isLoading_fetchUsers
      || focusesAreStale || isLoading_fetchFocuses
      || userFocusesAreStale || isLoading_fetchUserFocuses,
    errors: createErrorMessageSelector([
      userActionTypes.FETCH_USERS,
      focusActionTypes.FETCH_FOCUSES,
      userFocusActionTypes.FETCH_USER_FOCUSES,
    ])(state)
  }
};
const mapDispatchToProps = { fetchUsers, fetchFocuses, fetchUserFocuses };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class UsersPage extends React.Component<Props, OwnState> {
  public componentDidMount(): void {
    const promises: Promise<void>[] = [];
    if (this.props.usersAreStale && !this.props.isLoading_fetchUsers) {
      const promise: Promise<void> = this.props.fetchUsers();
      promises.push(promise);
    }
    if (this.props.focusesAreStale && !this.props.isLoading_fetchFocuses) {
      const promise: Promise<void> = this.props.fetchFocuses();
      promises.push(promise);
    }
    if (this.props.userFocusesAreStale && !this.props.isLoading_fetchUserFocuses) {
      const promise: Promise<void> = this.props.fetchUserFocuses();
      promises.push(promise);
    }
  }

  public render(): React.ReactElement<Props> {
    if (this.props.students.length === 0) { return <div>No students to show yet!</div>; }

    return (
      <div>
        <h1 className="heading-primary">Users</h1>

        <ul className="user-directory__list">
          {this.props.students
          .sort((a: User, b: User) => a.firstname.toLowerCase().localeCompare(b.lastname.toLowerCase()))
          .map((user: User) => {
            return (
              <div className="user-directory__user" key={user.id}>
                <h2 className="heading-secondary">{`${user.firstname} ${user.lastname}`}</h2>
                <ul className="user-directory__user-info">
                  <li><span className="user-directory__user-info-title">First name:</span> {user.firstname}</li>
                  <li><span className="user-directory__user-info-title">Last name:</span> {user.lastname}</li>
                  <li><span className="user-directory__user-info-title">Resume URL:</span> <a href={`${user.resume_link}`} target="_blank" rel="noreferrer">{user.resume_link && `<link>`}</a></li>
                  <li><span className="user-directory__user-info-title">Portfolio URL:</span> <a href={`${user.portfolio_link}`} target="_blank" rel="noreferrer">{user.portfolio_link && `<link>`}</a></li>
                  <li>
                    <span className="user-directory__user-info-title">Interests: </span>
                    {
                      user.findFocuses(this.props.focuses, this.props.userFocuses)
                      .map((focus: Focus) => focus.name)
                      .join(' | ')
                    }
                  </li>
                  <li><span className="user-directory__user-info-title">Email:</span> <a href={`mailto:${user.email}`}>{user.email}</a></li>
                </ul>
                <br />
              </div>
            );
          })}
        </ul>
      </div>
    )
  }
}

export default connector(UsersPage);
