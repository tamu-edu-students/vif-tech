import React from 'react';
import { Switch, Route, Redirect, Link } from "react-router-dom";
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { allowlistActionTypes } from 'Store/actions/types';
import { fetchAllowlist } from 'Store/actions';

import { Usertype } from 'Shared/enums';

import RedirectPrompt from 'Components/RedirectPrompt';

import MyProfile from './MyProfile/MyProfile';
import CompanyAllowlists from './CompanyAllowlists/CompanyAllowlists';
import StudentAllowlist from './StudentAllowlist/StudentAllowlist';
import AdminAllowlist from './AdminAllowlist/AdminAllowlist';
import VolunteerAllowlist from './VolunteerAllowlist/VolunteerAllowlist';
import VolunteerTimesheetPR2 from './VolunteerTimesheet/VolunteerTimesheetPR2';


interface OwnProps {
  match: Match;
}

interface OwnState {
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  return {
    parentPath: ownProps.match.path,

    user: state.auth.user,
    amRepresentative: state.auth.user?.usertype === Usertype.REPRESENTATIVE,
    amAdmin: state.auth.user?.usertype === Usertype.ADMIN,
    amPrimaryContact: state.auth.user?.isPrimaryContact(state.allowlist.allowlist_emails),

    allowlistIsStale: state.auth.user?.usertype === Usertype.REPRESENTATIVE ? state.allowlist.isStale : false,
    isLoading_fetchAllowlist: createLoadingSelector([allowlistActionTypes.FETCH_ALLOWLIST])(state),
    errors_fetchAllowlist: createErrorMessageSelector([allowlistActionTypes.FETCH_ALLOWLIST])(state),
  }
}
const mapDispatchToProps = { fetchAllowlist };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class ProfilePage extends React.Component<Props, OwnState> {
  public componentDidMount(): void {
    if (this.props.allowlistIsStale && !this.props.isLoading_fetchAllowlist) {
      this.props.fetchAllowlist();
    }
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<OwnState>, snapshot?: any): void {
    if (this.props.allowlistIsStale && !this.props.isLoading_fetchAllowlist) {
      this.props.fetchAllowlist();
    }
  }

  private _renderAdminRoutes(): JSX.Element[] {
    const { parentPath } = this.props;
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
    const { parentPath } = this.props;
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
    const { parentPath } = this.props;
    return ([
      ...(
        this.props.amPrimaryContact ?
        [
        <Route exact path={`${parentPath}/company-allowlist`} key={`${parentPath}/company-allowlist`}>
          <CompanyAllowlists company_id={this.props.user?.company_id} />
        </Route>
        ] :
        []
      ),
      <Route exact path={`${parentPath}/time-sheet`} key={`${parentPath}/time-sheet`}>
        <VolunteerTimesheetPR2 />
      </Route>
    ]);
  }

  private _renderRepresentativeLinks(): JSX.Element {
    const { parentPath } = this.props;
    return (
      <>
        {
          this.props.amPrimaryContact &&
          <li><Link to={`${parentPath}/company-allowlist`}>Company Allowlist</Link></li>
        }
        <li><Link to={`${parentPath}/time-sheet`}>Time Sheet</Link></li>
      </>
    );
  }

  private _renderVolunteerRoutes(): JSX.Element[] {
    const { parentPath } = this.props;
    return ([
      <Route exact path={`${parentPath}/time-sheet`} key={`${parentPath}/time-sheet`}>
        <VolunteerTimesheetPR2 />
      </Route>
    ]);
  }

  private _renderVolunteerLinks(): JSX.Element {
    const { parentPath } = this.props;
    return (
      <>
        <li><Link to={`${parentPath}/time-sheet`}>Time Sheet</Link></li>
      </>
    );
  }

  private _renderLinks(): JSX.Element | null {
    switch(this.props.user?.usertype) {
      case Usertype.ADMIN:
        return this._renderAdminLinks();
      case Usertype.REPRESENTATIVE:
        return this._renderRepresentativeLinks();
      case Usertype.VOLUNTEER:
        return this._renderVolunteerLinks();
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
      case Usertype.VOLUNTEER:
        return this._renderVolunteerRoutes();
      default:
        return [];
    }
  }

  public render(): React.ReactElement<Props> {
    const { parentPath } = this.props;

    if (this.props.isLoading_fetchAllowlist || this.props.allowlistIsStale) {
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
