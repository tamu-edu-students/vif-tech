import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, Link } from "react-router-dom";

import MyProfile from './MyProfile/MyProfile';
import Allowlist from './Allowlist/Allowlist';
import CompanyAllowlists from './CompanyAllowlists/CompanyAllowlists';
import RedirectPrompt from '../../components/RedirectPrompt';

interface IProfilePageProps {
  user: User;
  match: Match;
}

class ProfilePage extends React.Component<IProfilePageProps, {}> {
  public render(): React.ReactElement<IProfilePageProps> {
    const { user } = this.props;
    const parentPath = this.props.match.path;
    return (
      <div className="profile-page">
        <h1 className="heading-primary">ProfilePage</h1>

        <div className="split">
          <ul>
            <li><Link to={`${parentPath}/my-profile`}>My Profile</Link></li>
            {
              user.usertype === "admin" &&
              <li><Link to={`${parentPath}/company-allow-lists`}>Company Allow List</Link></li>
            }
          </ul>

          <Switch>
            <Route exact path={`${parentPath}`}>
              <Redirect to={`${parentPath}/my-profile`} />
            </Route>

            <Route exact path={`${parentPath}/my-profile`}>
              <MyProfile />
            </Route>

            {
            user.usertype === "admin" &&
              <Route exact path={`${parentPath}/company-allow-lists`}>
                  <CompanyAllowlists />
              </Route>
            }

            <Route path="*"> 
              <section className="section section--redirector">
                <RedirectPrompt
                  message={"404 Page Not Found"}
                  buttonText={"Return To Profile Page"}
                  pathName={parentPath}
                />
              </section>
            </Route>
          </Switch>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    user: state.auth.user,
  }
}

export default connect(mapStateToProps)(ProfilePage);
