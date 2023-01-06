import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
// import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { fetchAllowlist } from 'Store/actions';

import { Usertype } from 'Shared/enums';

import RedirectPrompt from 'Components/RedirectPrompt';

import SubNavLink from 'Components/SubNavLink/SubNavLink';
import SubNav from 'Components/SubNav/SubNav';

import CompanyAllowlists from './CompanyAllowlists/CompanyAllowlists';
import StudentAllowlist from './StudentAllowlist/StudentAllowlist';
import AdminAllowlist from './AdminAllowlist/AdminAllowlist';
import VolunteerAllowlist from './VolunteerAllowlist/VolunteerAllowlist';


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
  }
}
const mapDispatchToProps = { fetchAllowlist };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;


class ManageAllowlists extends React.Component<Props, OwnState> {
  private _renderRoute(subPath: string, allowlistElement: JSX.Element): JSX.Element {
    const path: string = this.props.parentPath+subPath;
    console.log(path)
    return (
      <Route exact path={path} key={path}>
        {allowlistElement}
      </Route>
    );
  }

  private _renderLink(subPath: string, text: string): JSX.Element {
    const path: string = this.props.parentPath+subPath;
    return (
      <SubNavLink to={path}>{text}</SubNavLink>
    );
  }

  private _renderLinks(): JSX.Element | null {
    return (
      <>
      {this._renderLink(`/companies`, 'Company Allowlist')}
      {this._renderLink(`/student`, 'Student Allowlist')}
      {this._renderLink(`/volunteer`, 'Volunteer Allowlist')}
      {this._renderLink(`/admin`, 'Admin Allowlist')}
      </>
    )
  }

  private _renderRoutes(): JSX.Element[] {
    console.log('HERE')
    return [
      this._renderRoute( `/companies`, (<CompanyAllowlists />) ),
      this._renderRoute( `/student`, (<StudentAllowlist />) ),
      this._renderRoute( `/volunteer`, (<VolunteerAllowlist />) ),
      this._renderRoute( `/admin`, (<AdminAllowlist />) ),
    ];
  }

  public render(): React.ReactElement<Props> {
    const { parentPath } = this.props;

    return (
      <div className="manage-allowlists">
        {/* <h1 className="heading-primary">My Events</h1> */}

        <div className='manage-allowlists__subpage'>
          <Switch>
            <Route path={parentPath} render={(routeProps: any) => (
                <SubNav className='manage-allowlists__nav' {...routeProps}>
                  {this._renderLinks()}
                </SubNav>
              )}
            >
            </Route>
          </Switch>

          <Switch>
            <Route exact path={`${parentPath}`}>
              <Redirect to={`${parentPath}/companies`} />
            </Route>

            {this._renderRoutes()}

            <Route path="*"> 
              <section className="section section--redirector">
                <RedirectPrompt
                  message={"404 Page Not Found"}
                  buttonText={"Return To My Events Page"}
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

export default connector(ManageAllowlists);
