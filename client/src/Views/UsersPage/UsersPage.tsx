import React from 'react';
import { connect, ConnectedProps } from "react-redux";
import { IRootState } from 'Store/reducers';
// import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
// import { companyActionTypes, allowlistActionTypes, userActionTypes } from 'Store/actions/types';

import { fetchUsers } from "Store/actions";

interface OwnProps {
}

interface OwnState {
}

const mapStateToProps = (state: IRootState) => {
  return {
    users: state.userData.users,
  };
};
const mapDispatchToProps = { fetchUsers };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class UsersPage extends React.Component<Props, OwnState> {
  public componentDidMount(): void {
    this.props.fetchUsers();
  }

  public render(): React.ReactElement<Props> {
    if (this.props.users.length === 0) { return <div>No users!</div>; }

    return (
      <div>
        <h1 className="heading-primary">Users</h1>

        <ul className="user-directory__list">
          {this.props.users.map((user: any) => {
            return (
              <div className="user-directory__user" key={user.id}>
                <h2 className="heading-secondary">{user.email}</h2>
                <ul className="user-directory__user-info">
                  <li><span className="user-directory__user-info-title">id:</span> {user.id}</li>
                  <li><span className="user-directory__user-info-title">Email:</span> <a href={`mailto:${user.email}`}>{user.email}</a></li>
                  <li><span className="user-directory__user-info-title">First name:</span> {user.firstname}</li>
                  <li><span className="user-directory__user-info-title">Last name:</span> {user.lastname}</li>
                  <li><span className="user-directory__user-info-title">User type:</span> {user.usertype}</li>
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