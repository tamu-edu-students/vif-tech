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

import CompanyAllowlistGroup from './CompanyAllowlistGroup/CompanyAllowlistGroup';
import AllowlistGroup from 'Components/AllowlistGroup/AllowlistGroup';


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
      {
        this.props.amRepresentative &&
        this._renderLink(`/company`, `Company Allowlist`)
      }
      {
        this.props.amAdmin &&
        <>
        {this._renderLink(`/companies`, `Company Allowlists`)}
        {this._renderLink(`/student`, 'Student Allowlist')}
        {this._renderLink(`/volunteer`, 'Volunteer Allowlist')}
        {this._renderLink(`/admin`, 'Admin Allowlist')}
        </>
      }
      </>
    )
  }

  private _renderRoutes(): JSX.Element[] {
    return [
      ...(
        this.props.amRepresentative
        ? [
          this._renderRoute( `/company`, (<CompanyAllowlistGroup />) ),
        ]
        : []
      ),
      ...(
        this.props.amAdmin
        ? [
          this._renderRoute( `/companies`, (<CompanyAllowlistGroup />) ),
          this._renderRoute( `/student`, (<AllowlistGroup entryUsertype={Usertype.STUDENT} showsDomains />) ),
          this._renderRoute( `/volunteer`, (<AllowlistGroup entryUsertype={Usertype.VOLUNTEER} showsEmails />) ),
          this._renderRoute( `/admin`, (<AllowlistGroup entryUsertype={Usertype.ADMIN} showsEmails />) ),
        ]
        : []
      )
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
              <Redirect to={`${parentPath}/${this.props.amAdmin ? 'companies' : 'company'}`} />
            </Route>

            {this._renderRoutes()}

            <Route path="*"> 
              <section className="section section--redirector">
                <RedirectPrompt
                  message={"404 Page Not Found"}
                  //TODO: Change text here
                  buttonText={"Return To Manage Allowlists Page"}
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
