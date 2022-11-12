import React from 'react';
import { connect, ConnectedProps } from "react-redux";

import { fetchUsers } from "Store/actions";

interface OwnProps {
  users: any[];
  fetchUsers?: any;
}


const mapStateToProps = (state: any) => {
  return {
    users: state.users,
  };
};
const mapDispatchToProps = { fetchUsers };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class UsersPage extends React.Component<Props, {}> {
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
            </div>
          );
        })}
      </div>
    )
  }
}

export default connector(UsersPage);