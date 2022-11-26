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
import { Usertype } from 'Shared/enums';

import { fetchAllowlist } from 'Store/actions';

interface OwnProps {
  match: Match;
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  return {
    user: state.auth.user,
    parentPath: ownProps.match.path,
  }
}
const mapDispatchToProps = { fetchAllowlist };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

interface OwnState {
  isLoaded: boolean;
}

class ProfilePage extends React.Component<Props, OwnState> {
  state = { isLoaded: false };
  
  public componentDidMount(): void {
    (async() => {
      this.setState({ isLoaded: false });
      await this.props.fetchAllowlist()
        .catch(() => {  });//TODO: CLEAN
      this.setState({ isLoaded: true });
    })();
  }

  private _renderAdminRoutes(): JSX.Element[] {
    const { parentPath} = this.props;
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
      </Route>,
    ]);
  }

  private _renderAdminLinks(): JSX.Element {
    const { parentPath} = this.props;
    return (
      <>
        <li><Link to={`${parentPath}/company-allowlists`}>Company Allowlist</Link></li>
        <li><Link to={`${parentPath}/student-allowlist`}>Student Allowlist</Link></li>
        <li><Link to={`${parentPath}/admin-allowlist`}>Admin Allowlist</Link></li>
        <li><Link to={`${parentPath}/volunteer-allowlist`}>Volunteer Allowlist</Link></li>
      </>
    );
  }

  private _renderRepresentativeRoutes(): JSX.Element[] {
    const { parentPath} = this.props;
    return ([
      ...(
        this.props.user?.isPrimaryContact ?
        [
        <Route exact path={`${parentPath}/company-allowlist`} key={`${parentPath}/company-allowlist`}>
          <CompanyAllowlists company_id={this.props.user?.company_id} />
        </Route>
        ] :
        []
      ),
    ]);
  }

  private _renderRepresentativeLinks(): JSX.Element {
    const { parentPath} = this.props;
    return (
      <>
        {
          this.props.user?.isPrimaryContact &&
          <li><Link to={`${parentPath}/company-allowlist`}>Company Allowlist</Link></li>
        }
      </>
    );
  }

  private _renderLinks(): JSX.Element | null {
    switch(this.props.user?.usertype) {
      case Usertype.ADMIN:
        return this._renderAdminLinks();
      case Usertype.REPRESENTATIVE:
        return this._renderRepresentativeLinks();
      default:
        return null;
    }
  }

  private _renderRoutes(): JSX.Element[] {
    switch(this.props.user?.usertype) {
      case Usertype.ADMIN:
        return this._renderAdminRoutes();
      case Usertype.REPRESENTATIVE:
        return this._renderRepresentativeRoutes();
      default:
        return [];
    }
  }

  public render(): React.ReactElement<Props> {
    const { parentPath } = this.props;

    if (!this.state.isLoaded) {
      return (
        <div>Loading ProfilePage...</div>
      );
    }

    return (
      <div className="profile-page">
        <h1 className="heading-primary">ProfilePage</h1>

        <div className="split">
          <ul>
            <li><Link to={`${parentPath}/my-profile`}>My Profile</Link></li>
            {this._renderLinks()}
          </ul>

          <Switch>
            <Route exact path={`${parentPath}`}>
              <Redirect to={`${parentPath}/my-profile`} />
            </Route>

            <Route exact path={`${parentPath}/my-profile`}>
              <MyProfile />
            </Route>

            {this._renderRoutes()}

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
