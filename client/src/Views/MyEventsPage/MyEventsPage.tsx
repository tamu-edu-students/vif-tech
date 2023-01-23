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
import PageHeading from 'Components/PageHeading/PageHeading';

//TODO: Add modal for confirming registration/withdrawal


interface OwnProps {
  match: Match;
}

interface OwnState {
  subTitle: string;
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  return {
    parentPath: ownProps.match.path,

    user: state.auth.user,
    amRepresentative: state.auth.user?.usertype === Usertype.REPRESENTATIVE,
    amStudent: state.auth.user?.usertype === Usertype.STUDENT,
    amPrimaryContact: state.auth.user?.isPrimaryContact(state.allowlist.allowlist_emails),
  }
}
const mapDispatchToProps = { fetchAllowlist };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;


class MyEventsPage extends React.Component<Props, OwnState> {
  state = {subTitle: ''};

  private _renderRoute(subPath: string, eventTitle: string, isFairRoute: boolean = false): JSX.Element {
    const path: string = this.props.parentPath+subPath;
    const setEventTitleState = () => this.setState({ subTitle: eventTitle });

    return (
      <Route exact path={path} key={path} render={(routeProps: any) => {
        if (this.state.subTitle !== eventTitle) { setEventTitleState() };
        return (
          <>
            {
              this.props.amRepresentative &&
              (
                isFairRoute
                ? <RepresentativeFairTimetableVF eventTitle={eventTitle} />
                : <VolunteerTimetable eventTitle={eventTitle} />
              )
            }
            {
              this.props.amStudent &&
              <StudentTimetable eventTitle={eventTitle} />
            }
          </>
        )
      }} />
    );
  }

  private _renderLink(subPath: string, text: string): JSX.Element {
    const path: string = this.props.parentPath+subPath;
    return (
      <SubNavLink to={path}>{text}</SubNavLink>
    );
  }

  private _renderLinks(): JSX.Element {
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

  private _renderRoutes(): JSX.Element[] {
    return ([
      this._renderRoute(`/timetable/portfolio-review-1`, 'Portfolio Review 1'),
      this._renderRoute(`/timetable/mock-interview-1`, 'Mock Interview 1'),
      this._renderRoute(`/timetable/mock-interview-2`, 'Mock Interview 2'),
      this._renderRoute(`/timetable/portfolio-review-2`, 'Portfolio Review 2'),
      ...(
        this.props.user?.isRepresentative
        ? [this._renderRoute(`/timetable/virtual-fair`, 'Virtual Fair', true)]
        : []
      )
    ]);
  }

  public render(): React.ReactElement<Props> {
    const { parentPath } = this.props;
    const setEventTitleState = () => this.setState({ subTitle: '' });

    return (
      <div className="my-events-page">
        <PageHeading
          heading="My Events"
          subheading={this.state.subTitle}
        />

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

            <Route exact path={`${parentPath}`} render={(routeProps: any) => {
              if (this.state.subTitle !== '') { setEventTitleState(); }
              //TODO: Handle parent path for My Events page
              return (
                <div>TODO: fill with something</div>
              )
            }} />

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
