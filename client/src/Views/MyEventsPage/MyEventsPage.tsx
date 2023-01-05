import React from 'react';
import { Switch, Route } from "react-router-dom";
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
// import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { fetchAllowlist } from 'Store/actions';

import { Usertype } from 'Shared/enums';

import RedirectPrompt from 'Components/RedirectPrompt';

import SubNavLink from 'Components/SubNavLink/SubNavLink';
import SubNav from 'Components/SubNav/SubNav';

import VolunteerTimesheet from './VolunteerTimesheet/VolunteerTimesheet';
import StudentTimesheet from './StudentTimesheet/StudentTimesheet';
// import RepresentativeFairTimesheetVF from './RepresentativeFairTimesheet/RepresentativeFairTimesheetVF';


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


class MyEventsPage extends React.Component<Props, OwnState> {
  private _renderVolunteerRoute(subPath: string, eventTitle: string): JSX.Element {
    const path: string = this.props.parentPath+subPath;
    return (
      <Route exact path={path} key={path}>
        <VolunteerTimesheet eventTitle={eventTitle} />
      </Route>
    );
  }

  private _renderStudentRoute(subPath: string, eventTitle: string): JSX.Element {
    const path: string = this.props.parentPath+subPath;
    return (
      <Route exact path={path} key={path}>
        <StudentTimesheet eventTitle={eventTitle} />
      </Route>
    );
  }

  private _renderLink(subPath: string, text: string): JSX.Element {
    const path: string = this.props.parentPath+subPath;
    return (
      <SubNavLink to={path}>{text}</SubNavLink>
    );
  }

  private _renderVolunteerRoutes(): JSX.Element[] {
    return ([
      this._renderVolunteerRoute(`/timesheet/portfolio-review-1`, 'Portfolio Review 1'),
      this._renderVolunteerRoute(`/timesheet/mock-interview-1`, 'Mock Interview 1'),
      this._renderVolunteerRoute(`/timesheet/mock-interview-2`, 'Mock Interview 2'),
      this._renderVolunteerRoute(`/timesheet/portfolio-review-2`, 'Portfolio Review 2'),

      // <Route exact path={`${parentPath}/virtual-fair`} key={`${parentPath}/virtual-fair`}>
      //   <RepresentativeFairTimesheetVF />
      // </Route>
    ]);
  }

  private _renderVolunteerLinks(): JSX.Element {
    return (
      <>
        {this._renderLink(`/timesheet/portfolio-review-1`, 'Portfolio Review 1')}
        {this._renderLink(`/timesheet/mock-interview-1`, 'Mock Interview 1')}
        {this._renderLink(`/timesheet/mock-interview-2`, 'Mock Interview 2')}
        {this._renderLink(`/timesheet/portfolio-review-2`, 'Portfolio Review 2')}
        {/* <li><Link to={`${parentPath}/timesheet/virtual-fair`}>Virtual Fair</Link></li> */}
      </>
    );
  }

  private _renderStudentRoutes(): JSX.Element[] {
    return ([
      this._renderStudentRoute(`/timesheet/portfolio-review-1`, 'Portfolio Review 1'),
      this._renderStudentRoute(`/timesheet/mock-interview-1`, 'Mock Interview 1'),
      this._renderStudentRoute(`/timesheet/mock-interview-2`, 'Mock Interview 2'),
      this._renderStudentRoute(`/timesheet/portfolio-review-2`, 'Portfolio Review 2'),
    ]);
  }

  private _renderStudentLinks(): JSX.Element {
    return (
      <>
      {this._renderLink(`/timesheet/portfolio-review-1`, 'Portfolio Review 1')}
      {this._renderLink(`/timesheet/mock-interview-1`, 'Mock Interview 1')}
      {this._renderLink(`/timesheet/mock-interview-2`, 'Mock Interview 2')}
      {this._renderLink(`/timesheet/portfolio-review-2`, 'Portfolio Review 2')}
      </>
    );
  }

  private _renderLinks(): JSX.Element | null {
    switch(this.props.user?.usertype) {
      case Usertype.REPRESENTATIVE:
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
      case Usertype.REPRESENTATIVE:
      case Usertype.VOLUNTEER:
        return this._renderVolunteerRoutes();
      case Usertype.STUDENT:
        return this._renderStudentRoutes();
      default:
        return [];
    }
  }

  public render(): React.ReactElement<Props> {
    const { parentPath } = this.props;

    return (
      <div className="my-events-page">
        <h1 className="heading-primary">My Events</h1>

        <div className='my-events-page__subpage'>
          <Switch>
            <Route path={parentPath} render={(routeProps: any) => (
                <SubNav className='my-events-page__nav' {...routeProps}>
                  {this._renderLinks()}
                </SubNav>
              )}
            >
            </Route>
          </Switch>

          <Switch>
            {/* <Route exact path={`${parentPath}`}>
              <Redirect to={`${parentPath}`} />
            </Route> */}

            <Route exact path={`${parentPath}`}>
              {/* //TODO: Handle parent path for My Events page */}
              <div>TODO: fill with something</div>
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

export default connector(MyEventsPage);
