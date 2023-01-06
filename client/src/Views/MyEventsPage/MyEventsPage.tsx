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

import VolunteerTimetable from './VolunteerTimetable/VolunteerTimetable';
import StudentTimetable from './StudentTimetable/StudentTimetable';
import RepresentativeFairTimetableVF from './RepresentativeFairTimetable/RepresentativeFairTimetableVF';


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
        <VolunteerTimetable eventTitle={eventTitle} />
      </Route>
    );
  }

  private _renderRepresentativeFairRoute(subPath: string, eventTitle: string): JSX.Element {
    const path: string = this.props.parentPath+subPath;
    return (
      <Route exact path={path} key={path}>
        <RepresentativeFairTimetableVF eventTitle={eventTitle} />
      </Route>
    );
  }

  private _renderStudentRoute(subPath: string, eventTitle: string): JSX.Element {
    const path: string = this.props.parentPath+subPath;
    return (
      <Route exact path={path} key={path}>
        <StudentTimetable eventTitle={eventTitle} />
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
      this._renderVolunteerRoute(`/timetable/portfolio-review-1`, 'Portfolio Review 1'),
      this._renderVolunteerRoute(`/timetable/mock-interview-1`, 'Mock Interview 1'),
      this._renderVolunteerRoute(`/timetable/mock-interview-2`, 'Mock Interview 2'),
      this._renderVolunteerRoute(`/timetable/portfolio-review-2`, 'Portfolio Review 2'),
      ...(
        this.props.user?.isRepresentative
        ? [this._renderRepresentativeFairRoute(`/timetable/virtual-fair`, 'Virtual Fair')]
        : []
      )
    ]);
  }

  private _renderVolunteerLinks(): JSX.Element {
    return (
      <>
        {this._renderLink(`/timetable/portfolio-review-1`, 'Portfolio Review 1')}
        {this._renderLink(`/timetable/mock-interview-1`, 'Mock Interview 1')}
        {this._renderLink(`/timetable/mock-interview-2`, 'Mock Interview 2')}
        {this._renderLink(`/timetable/portfolio-review-2`, 'Portfolio Review 2')}
        {
          this.props.user?.isRepresentative &&
          this._renderLink(`/timetable/virtual-fair`, 'Virtual Fair')
        }
      </>
    );
  }

  private _renderStudentRoutes(): JSX.Element[] {
    return ([
      this._renderStudentRoute(`/timetable/portfolio-review-1`, 'Portfolio Review 1'),
      this._renderStudentRoute(`/timetable/mock-interview-1`, 'Mock Interview 1'),
      this._renderStudentRoute(`/timetable/mock-interview-2`, 'Mock Interview 2'),
      this._renderStudentRoute(`/timetable/portfolio-review-2`, 'Portfolio Review 2'),
    ]);
  }

  private _renderStudentLinks(): JSX.Element {
    return (
      <>
      {this._renderLink(`/timetable/portfolio-review-1`, 'Portfolio Review 1')}
      {this._renderLink(`/timetable/mock-interview-1`, 'Mock Interview 1')}
      {this._renderLink(`/timetable/mock-interview-2`, 'Mock Interview 2')}
      {this._renderLink(`/timetable/portfolio-review-2`, 'Portfolio Review 2')}
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
