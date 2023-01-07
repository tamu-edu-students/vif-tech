import React from 'react';
import { Switch, Route, Link } from "react-router-dom";
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { fetchAllowlist } from 'Store/actions';
import { allowlistActionTypes } from 'Store/actions/types';

import { Usertype } from 'Shared/enums';

import RedirectPrompt from 'Components/RedirectPrompt';

import SubNavLink from 'Components/SubNavLink/SubNavLink';
import SubNav from 'Components/SubNav/SubNav';
import ManageAllowlists from './ManageAllowlists/ManageAllowlists';

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

    allowlistIsStale: state.allowlist.isStale,
    isLoading_fetchAllowlist: createLoadingSelector([allowlistActionTypes.FETCH_ALLOWLIST])(state),
    errors_fetchAllowlist: createErrorMessageSelector([allowlistActionTypes.FETCH_ALLOWLIST])(state),
  }
}
const mapDispatchToProps = { fetchAllowlist };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;


class MyEventsPage extends React.Component<Props, OwnState> {
  private _renderSettingsLink(subPath: string, text: string): JSX.Element {
    const path: string = this.props.parentPath+subPath;
    return (
      <Link className="btn-wire" to={path}>{text}</Link>
    );
  }

  private _renderSettingsRoute(subPath: string, allowlistElement: JSX.Element): JSX.Element {
    const path: string = this.props.parentPath+subPath;
    return (
      <Route path={path} key={path} render={(routeProps: any) => (
        React.createElement(allowlistElement.type, routeProps)
      )} />
    );
  }

  private _renderSettingsLinks(): JSX.Element | null {
    const { amAdmin, amRepresentative } = this.props;
    return (
      <>
        {
          (amAdmin || amRepresentative)
          && this._renderSettingsLink(`/manage-allowlist`, `Manage Allowlist`)
        }
      </>
    );
  }

  private _renderSettingsRoutes(): JSX.Element[] {
    const { amAdmin, amRepresentative } = this.props;
    return [
      ...(
        (amAdmin || amRepresentative)
        ? [this._renderSettingsRoute(`/manage-allowlist`, (<ManageAllowlists />))]
        : []
      ),
    ];
  }

  public render(): React.ReactElement<Props> {
    const { parentPath } = this.props;

    return (
      <div className="settings-page page page--settings">
        <h1 className="heading-primary">Settings</h1>
        <Switch>
          <Route exact path={parentPath} render={(routeProps: any) => (
            <div className="settings-page__links">
              {this._renderSettingsLinks()}
            </div>
            )}
          />
          
          {this._renderSettingsRoutes()}

          <Route path="*"> 
            <section className="section section--redirector">
              <RedirectPrompt
                message={"404 Page Not Found"}
                buttonText={"Return To Settings Page"}
                pathName={parentPath}
              />
            </section>
          </Route>
        </Switch>
      </div>
    );
  }
}

export default connector(MyEventsPage);
