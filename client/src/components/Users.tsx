import React from 'react';
import { connect } from "react-redux";

import { fetchUsers } from "../store/actions";

interface IUsersProps {
  users: any[];
  fetchUsers?: any;
}

class Users extends React.Component<IUsersProps, {}> {
  public componentDidMount(): void {
    this.props.fetchUsers();
  }

  public render(): React.ReactElement<IUsersProps> {
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
            </div>
          );
        })}
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    users: state.users,
  };
};

export default connect(mapStateToProps, { fetchUsers })(Users);