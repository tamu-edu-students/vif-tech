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
        {this.props.users.map((user: any) => {
          return (
            <div key={user.id}>
              <h1>{user.username}</h1>
              <ul>
                <li>id: {user.id}</li>
                <li>Username: {user.username}</li>
                <li>email: {user.email}</li>
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