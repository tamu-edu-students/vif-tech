import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Switch, Route, Redirect, Link } from "react-router-dom";

import MyProfile from './MyProfile/MyProfile';
import CompanyAllowlists from './CompanyAllowlists/CompanyAllowlists';
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
            user?.usertype === "admin" &&
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

export default connector(ProfilePage);
