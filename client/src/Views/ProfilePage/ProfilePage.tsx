import React from 'react';
import { Switch, Route, Redirect, Link } from "react-router-dom";
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { allowlistActionTypes } from 'Store/actions/types';
import { fetchAllowlist } from 'Store/actions';

import { Usertype } from 'Shared/enums';

import RedirectPrompt from 'Components/RedirectPrompt';

import CompanyProfile from './CompanyProfile/CompanyProfile';
import MyProfileStudent from './MyProfile/MyProfileStudent/MyProfileStudent';
import MyProfileVolunteer from './MyProfile/MyProfileVolunteer/MyProfileVolunteer';
import MyProfileRepresentative from './MyProfile/MyProfileRepresentative/MyProfileRepresentative';
import MyProfileAdmin from './MyProfile/MyProfileAdmin/MyProfileAdmin';

import CompanyAllowlists from './CompanyAllowlists/CompanyAllowlists';
import StudentAllowlist from './StudentAllowlist/StudentAllowlist';
import AdminAllowlist from './AdminAllowlist/AdminAllowlist';
import VolunteerAllowlist from './VolunteerAllowlist/VolunteerAllowlist';

import MeetingAssignmentSheet from './MeetingAssignmentSheet/MeetingAssignmentSheet';

import FocusList from './FocusList/FocusList';


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

      <Route exact path={`${parentPath}/admin-assignment-sheet/portfolio-review-1`} key={`${parentPath}/admin-assignment-sheet/portfolio-review-1`}>
        <MeetingAssignmentSheet eventTitle="Portfolio Review 1"  />
      </Route>,

      <Route exact path={`${parentPath}/admin-assignment-sheet/mock-interview-1`} key={`${parentPath}/admin-assignment-sheet/mock-interview-1`}>
        <MeetingAssignmentSheet eventTitle="Mock Interview 1"  />
      </Route>,

      <Route exact path={`${parentPath}/admin-assignment-sheet/mock-interview-2`} key={`${parentPath}/admin-assignment-sheet/mock-interview-2`}>
        <MeetingAssignmentSheet eventTitle="Mock Interview 2"  />
      </Route>,

      <Route exact path={`${parentPath}/admin-assignment-sheet/portfolio-review-2`} key={`${parentPath}/admin-assignment-sheet/portfolio-review-2`}>
        <MeetingAssignmentSheet eventTitle="Portfolio Review 2"  />
      </Route>,

      <Route exact path={`${parentPath}/focus-list`} key={`${parentPath}/focus-list`}>
        <FocusList />
      </Route>
    ]);
  }

  private _renderAdminLinks(): JSX.Element {
    const { parentPath } = this.props;
    return (
      <>
        <br />
        <li><Link to={`${parentPath}/company-allowlists`}>Company Allowlist</Link></li>
        <li><Link to={`${parentPath}/student-allowlist`}>Student Allowlist</Link></li>
        <li><Link to={`${parentPath}/admin-allowlist`}>Admin Allowlist</Link></li>
        <li><Link to={`${parentPath}/volunteer-allowlist`}>Volunteer Allowlist</Link></li>
        <br />
        <li><Link to={`${parentPath}/admin-assignment-sheet/portfolio-review-1`}>Portfolio Review 1</Link></li>
        <li><Link to={`${parentPath}/admin-assignment-sheet/mock-interview-1`}>Mock Interview 1</Link></li>
        <li><Link to={`${parentPath}/admin-assignment-sheet/mock-interview-2`}>Mock Interview 2</Link></li>
        <li><Link to={`${parentPath}/admin-assignment-sheet/portfolio-review-2`}>Portfolio Review 2</Link></li>
        <br />
        <li><Link to={`${parentPath}/focus-list`}>Manage Focus List</Link></li>
      </>
    );
  }

  private _renderRepresentativeRoutes(): JSX.Element[] {
    const { parentPath } = this.props;
    return ([
      <Route exact path={`${parentPath}/company-profile`} key={`${parentPath}/company-profile`}>
        <CompanyProfile />
      </Route>,

      ...(
        this.props.amPrimaryContact ?
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
    const { parentPath } = this.props;
    return (
      <>
        <li><Link to={`${parentPath}/company-profile`}>Company Profile</Link></li>
        <br />
        {
          this.props.amPrimaryContact &&
          <>
            <li><Link to={`${parentPath}/company-allowlist`}>Company Allowlist</Link></li>
          </>
        }
      </>
    );
  }

  private _renderVolunteerRoutes(): JSX.Element[] {
    return ([
    ]);
  }

  private _renderVolunteerLinks(): JSX.Element {
    return (
      <>
      </>
    );
  }

  private _renderStudentRoutes(): JSX.Element[] {
    return ([
    ]);
  }

  private _renderStudentLinks(): JSX.Element {
    return (
      <>
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
      case Usertype.STUDENT:
        return this._renderStudentLinks();
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
      case Usertype.STUDENT:
        return this._renderStudentRoutes();
      default:
        return [];
    }
  }

  public render(): React.ReactElement<Props> {
    const { parentPath, user } = this.props;

    if (this.props.isLoading_fetchAllowlist || this.props.allowlistIsStale) {
      return (
        <div>Loading ProfilePage...</div>
      );
    }

    return (
      <div className="profile-page">
        <h1 className="heading-primary">Profile</h1>

        <div className="profile-page__split">
          <ul className='profile-page__nav'>
            <li><Link to={`${parentPath}/my-profile`}>My Profile</Link></li>
            {this._renderLinks()}
          </ul>

          <div className='profile-page__subpage'>
            <Switch>
              <Route exact path={`${parentPath}`}>
                <Redirect to={`${parentPath}/my-profile`} />
              </Route>

              <Route exact path={`${parentPath}/my-profile`}>
                { user?.isAdmin && <MyProfileAdmin />}
                { user?.isRepresentative && <MyProfileRepresentative />}
                { user?.isVolunteer && <MyProfileVolunteer />}
                { user?.isStudent && <MyProfileStudent />}
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
      </div>
    );
  }
}

export default connector(ProfilePage);
