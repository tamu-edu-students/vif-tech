import React from 'react';
import { Switch, Route, Redirect, Link } from "react-router-dom";
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { allowlistActionTypes } from 'Store/actions/types';
import { fetchAllowlist } from 'Store/actions';

import { Usertype } from 'Shared/enums';

import RedirectPrompt from 'Components/RedirectPrompt';

import SubNavLink from 'Components/SubNavLink/SubNavLink';
import SubNav from 'Components/SubNav/SubNav';
import CompanyProfile from './CompanyProfile/CompanyProfile';
import MyProfileStudent from './MyProfile/MyProfileStudent/MyProfileStudent';
import MyProfileVolunteer from './MyProfile/MyProfileVolunteer/MyProfileVolunteer';
import MyProfileRepresentative from './MyProfile/MyProfileRepresentative/MyProfileRepresentative';
import MyProfileAdmin from './MyProfile/MyProfileAdmin/MyProfileAdmin';

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
    amStudent: state.auth.user?.usertype === Usertype.STUDENT,
    amVolunteer: state.auth.user?.usertype === Usertype.VOLUNTEER,
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
        <li><Link to={`${parentPath}/focus-list`}>Manage Focus List</Link></li>
      </>
    );
  }

  private _renderRepresentativeRoutes(): JSX.Element[] {
    const { parentPath } = this.props;
    return ([
      <Route exact path={`${parentPath}/company-profile`} key={`${parentPath}/company-profile`}>
        <CompanyProfile />
      </Route>
    ]);
  }

  private _renderRepresentativeLinks(): JSX.Element {
    const { parentPath } = this.props;
    return (
      <>
        <li><Link to={`${parentPath}/company-profile`}>Company Profile</Link></li>
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

  private _renderRoute(subPath: string, allowlistElement: JSX.Element): JSX.Element {
    const path: string = this.props.parentPath+subPath;
    return (
      <Route exact path={path} key={path} render={(routeProps: any) => (
        React.createElement(allowlistElement.type, routeProps)
      )} />
    );
  }

  private _renderLink(subPath: string, text: string): JSX.Element {
    const path: string = this.props.parentPath+subPath;
    return (
      <SubNavLink to={path}>{text}</SubNavLink>
    );
  }

  private _renderLinks(): JSX.Element | null {
    // switch(this.props.user?.usertype) {
    //   case Usertype.ADMIN:
    //     return this._renderAdminLinks();
    //   case Usertype.REPRESENTATIVE:
    //     return this._renderRepresentativeLinks();
    //   case Usertype.VOLUNTEER:
    //     return this._renderVolunteerLinks();
    //   case Usertype.STUDENT:
    //     return this._renderStudentLinks();
    //   default:
    //     return null;
    // }
    return (
      <>
      {this.props.amStudent && this._renderLink(`/my-profile`, `My Profile`)}
      </>
    )
  }

  private _renderRoutes(): JSX.Element[] {
    // switch(this.props.user?.usertype) {
    //   case Usertype.ADMIN:
    //     return this._renderAdminRoutes();
    //   case Usertype.REPRESENTATIVE:
    //     return this._renderRepresentativeRoutes();
    //   case Usertype.VOLUNTEER:
    //     return this._renderVolunteerRoutes();
    //   case Usertype.STUDENT:
    //     return this._renderStudentRoutes();
    //   default:
    //     return [];
    // }
    if (!this.props.amStudent) {
      return [];
    }
    return [
      this._renderRoute(`/my-profile`, <MyProfileStudent />),
    ];
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

        <div className='profile-page__subpage'>
          <Switch>
            <Route path={parentPath} render={(routeProps: any) => (
                <SubNav className='profile-page__nav' {...routeProps}>
                  {this._renderLinks()}
                </SubNav>
              )}
            >
            </Route>
          </Switch>

          <Switch>
            <Route exact path={`${parentPath}`}>
              <Redirect to={`${parentPath}/my-profile`} />
            </Route>

            {/* <Route exact path={`${parentPath}/my-profile`}>
              <MyProfileStudent />
            </Route> */}

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
