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

        {this.props.users.map((user: any) => {
          return (
            <div key={user.id}>
              <h2 className="heading-secondary">{user.email}</h2>
              <ul>
                <li>id: {user.id}</li>
                <li>Email: {user.email}</li>
                <li>First name: {user.firstname}</li>
                <li>Last name: {user.lastname}</li>
                <li>User type: {user.usertype}</li>
              </ul>
              <br />
            </div>
          );
        })}
      </div>
    )
  }
}

export default connector(UsersPage);