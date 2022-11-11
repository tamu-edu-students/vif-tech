import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Switch, Route, Redirect, Link } from "react-router-dom";

import MyProfile from './MyProfile/MyProfile';
import CompanyAllowlists from './CompanyAllowlists/CompanyAllowlists';
import StudentAllowlist from './StudentAllowlist/StudentAllowlist';
import AdminAllowlist from './AdminAllowlist/AdminAllowlist';
import VolunteerAllowlist from './VolunteerAllowlist/VolunteerAllowlist';
import RedirectPrompt from 'Components/RedirectPrompt';
import { IRootState } from 'Store/reducers';

interface OwnProps {
  match: Match;
}

const mapStateToProps = (state: IRootState) => {
  return {
    user: state.auth.user,
  }
}
const mapDispatchToProps = {};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class ProfilePage extends React.Component<Props, {}> {
  private _renderAdminLinks(parentPath: string): JSX.Element {
    return (
      <>
        <li><Link to={`${parentPath}/company-allowlists`}>Company Allowlist</Link></li>
        <li><Link to={`${parentPath}/student-allowlist`}>Student Allowlist</Link></li>
        <li><Link to={`${parentPath}/admin-allowlist`}>Admin Allowlist</Link></li>
        <li><Link to={`${parentPath}/volunteer-allowlist`}>Volunteer Allowlist</Link></li>
      </>
    );
  }

  private _renderAdminRoutes(parentPath: string): JSX.Element[] {
    return ([
      <Route exact path={`${parentPath}/company-allowlists`} key={`${parentPath}/company-allowlists`}>
        <CompanyAllowlists />
      </Route>,
      
      <Route exact path={`${parentPath}/student-allowlist`} key={`${parentPath}/student-allowlist`}>
        <StudentAllowlist />
      </Route>,

      <Route exact path={`${parentPath}/admin-allowlist`} key={`${parentPath}/admin-allowlist`}>
        <AdminAllowlist />
      </Route>,

      <Route exact path={`${parentPath}/volunteer-allowlist`} key={`${parentPath}/volunteer-allowlist`}>
        <VolunteerAllowlist />
      </Route>
    ]);
  }

  public render(): React.ReactElement<Props> {
    const { user } = this.props;
    const parentPath = this.props.match.path;
    return (
      <div className="profile-page">
        <h1 className="heading-primary">ProfilePage</h1>

        <div className="split">
          <ul>
            <li><Link to={`${parentPath}/my-profile`}>My Profile</Link></li>
            {
              user?.usertype === "admin" &&
              this._renderAdminLinks(parentPath)
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
            user?.usertype === "admin" && 
            this._renderAdminRoutes(parentPath)
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

export default connector(ProfilePage);
