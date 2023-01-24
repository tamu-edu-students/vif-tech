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
import PageHeading from 'Components/PageHeading/PageHeading';

import MeetingAssignmentSheet from './MeetingAssignmentSheet/MeetingAssignmentSheet';


interface OwnProps {
  match: Match;
}

interface OwnState {
  subheading: string;
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


class SchedulingPage extends React.Component<Props, OwnState> {
  state = { subheading: '' };

  private _renderLink(subPath: string, text: string): JSX.Element {
    const path: string = this.props.parentPath+subPath;
    return (
      <SubNavLink to={path}>{text}</SubNavLink>
    );
  }

  private _renderLinks(): JSX.Element | null {
    return (
      <>
        {this._renderLink(`/timetable/portfolio-review-1`, 'Portfolio Review 1')}
        {this._renderLink(`/timetable/mock-interview-1`, 'Mock Interview 1')}
        {this._renderLink(`/timetable/mock-interview-2`, 'Mock Interview 2')}
        {this._renderLink(`/timetable/portfolio-review-2`, 'Portfolio Review 2')}
      </>
    );
  }

  private _renderRoute(subPath: string, eventTitle: string): JSX.Element {
    const path: string = this.props.parentPath+subPath;
    return (
      <Route exact path={path} key={path} render={(routeProps: any) => {
        if (this.state.subheading !== eventTitle) { this.setState({ subheading: eventTitle }); }
        return <MeetingAssignmentSheet eventTitle={eventTitle} />
      }} />
    );
  }

  private _renderRoutes(): JSX.Element[] {
    return ([
      this._renderRoute(`/timetable/portfolio-review-1`, 'Portfolio Review 1'),
      this._renderRoute(`/timetable/mock-interview-1`, 'Mock Interview 1'),
      this._renderRoute(`/timetable/mock-interview-2`, 'Mock Interview 2'),
      this._renderRoute(`/timetable/portfolio-review-2`, 'Portfolio Review 2'),
    ]);
  }

  public render(): React.ReactElement<Props> {
    const { parentPath } = this.props;

    return (
      <div className="scheduling-page">
        <PageHeading
          heading="Scheduling"
          subheading={this.state.subheading}
        />

        <div className='scheduling-page__subpage'>
          <Switch>
            <Route path={parentPath} render={(routeProps: any) => (
                <SubNav className='scheduling-page__nav' {...routeProps}>
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
              if (this.state.subheading !== '') { this.setState({ subheading: '' }) }
              //TODO: Handle parent path for Scheduling Page
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

export default connector(SchedulingPage);
