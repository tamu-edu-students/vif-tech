import React from 'react';
import { connect, ConnectedProps } from "react-redux";
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { eventActionTypes, companyActionTypes, virtualFairAttendanceActionTypes, focusActionTypes, companyFocusActionTypes } from 'Store/actions/types';
import { fetchEvents, fetchCompanies, fetchVirtualFairAttendance, fetchFocuses, fetchCompanyFocuses } from 'Store/actions';

import Event from 'Shared/entityClasses/Event';
import Company from 'Shared/entityClasses/Company';
import Focus from 'Shared/entityClasses/Focus';

import PageHeading from 'Components/PageHeading/PageHeading';
import Banner from 'Components/Banner/Banner';

interface OwnProps {
}

interface OwnState {
  companyFilterString: string;
  filteredCompanies: Company[];
}

const mapStateToProps = (state: IRootState) => {
  const event: Event | null = Event.findByTitle('Virtual Fair', state.eventData.events); //TODO: apply to physical fair as well

  const eventsAreStale: boolean = state.eventData.isStale;
  const isLoading_fetchEvents: boolean = createLoadingSelector([eventActionTypes.FETCH_EVENTS])(state);

  const virtualFairAttendanceIsStale: boolean = state.virtualFairAttendanceData.isStale;
  const isLoading_fetchVirtualFairAttendance: boolean = createLoadingSelector([virtualFairAttendanceActionTypes.FETCH_VIRTUAL_FAIR_ATTENDANCE])(state);

  const companiesAreStale: boolean = state.companyData.isStale;
  const isLoading_fetchCompanies: boolean = createLoadingSelector([companyActionTypes.FETCH_COMPANIES])(state);

  const focusesAreStale: boolean = state.focusData.isStale;
  const isLoading_fetchFocuses: boolean = createLoadingSelector([focusActionTypes.FETCH_FOCUSES])(state);

  const companyFocusesAreStale: boolean = state.companyFocusData.isStale;
  const isLoading_fetchCompanyFocuses: boolean = createLoadingSelector([companyFocusActionTypes.FETCH_COMPANY_FOCUSES])(state);

  return {
    event,
    virtualFairMeetings: state.virtualFairAttendanceData.virtualFairMeetings,
    attendingCompanies: Company.findByIds(state.virtualFairAttendanceData.attendingCompanyIds, state.companyData.companies),

    eventsAreStale,
    isLoading_fetchEvents,

    virtualFairAttendanceIsStale,
    isLoading_fetchVirtualFairAttendance,

    companiesAreStale,
    isLoading_fetchCompanies,

    focuses: state.focusData.focuses,
    focusesAreStale,
    isLoading_fetchFocuses,

    companyFocuses: state.companyFocusData.companyFocuses,
    companyFocusesAreStale,
    isLoading_fetchCompanyFocuses,
    
    isLoading:
      eventsAreStale || isLoading_fetchEvents
      || virtualFairAttendanceIsStale || isLoading_fetchVirtualFairAttendance
      || companiesAreStale || isLoading_fetchCompanies
      || focusesAreStale || isLoading_fetchFocuses
      || companyFocusesAreStale || isLoading_fetchCompanyFocuses,
    errors: createErrorMessageSelector([
      eventActionTypes.FETCH_EVENTS,
      virtualFairAttendanceActionTypes.FETCH_VIRTUAL_FAIR_ATTENDANCE,
      companyActionTypes.FETCH_COMPANIES,
    ])(state),
  };
};
const mapDispatchToProps = { fetchEvents, fetchCompanies, fetchVirtualFairAttendance, fetchFocuses, fetchCompanyFocuses };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class CompaniesPage extends React.Component<Props, OwnState> {
  state = { companyFilterString: '', filteredCompanies: [] };

  public componentDidMount(): void {
    const promises: Promise<void>[] = [];
    if (this.props.eventsAreStale && !this.props.isLoading_fetchEvents) {
      promises.push(this.props.fetchEvents());
    }
    if (this.props.virtualFairAttendanceIsStale && !this.props.isLoading_fetchVirtualFairAttendance) {
      promises.push(this.props.fetchVirtualFairAttendance());
    }
    if (this.props.companiesAreStale && !this.props.isLoading_fetchCompanies) {
      promises.push(this.props.fetchCompanies());
    }
    if (this.props.focusesAreStale && !this.props.isLoading_fetchFocuses) {
      promises.push(this.props.fetchFocuses());
    }
    if (this.props.companyFocusesAreStale && !this.props.isLoading_fetchCompanyFocuses) {
      promises.push(this.props.fetchCompanyFocuses());
    }

    Promise.all(promises).then(() => {
      this.setState({ filteredCompanies: this.props.attendingCompanies });
    });
  }

  private _renderCompanyCards(): JSX.Element[] {
    const { filteredCompanies } = this.state;
    return filteredCompanies.map((company: Company) => {
      const { name, logo_img_src, website_link } = company;
      const focusStrings: string[] = company.findFocuses(this.props.focuses, this.props.companyFocuses).map((focus: Focus) => focus.name);
      return (
        <div key={company.id} className="company-card-container">
          <div className="company-card">
            <div className="company-card__logo-container">
              <img className='company-card__logo' src={logo_img_src} alt={`${name} logo`} />
            </div>
            {
              website_link === ''
              ? <div className='company-card__name'>{name}</div>
              : <a className='company-card__name' href={website_link} target="_blank" rel="noreferrer">{name}</a>
            }
            <div className='company-card__focuses'>{`${focusStrings.join(' | ')}`}</div>
          </div>
        </div>
      );
    });
  }

  private _renderCompanySearch(): JSX.Element {
    return (
      <>
        <input
          className="company-search-bar"
          type="text"
          name="company-filter"
          id="company-filter"
          value={this.state.companyFilterString}
          onChange={this._onFilterChange}
        />
        <div className="attending-companies-grid">
          {this._renderCompanyCards()}
        </div>
      </>
    );
  }

  private _onFilterChange = (event: any) => {
    const newFilterString = event.target.value;

    this.setState({ companyFilterString: newFilterString });
    
    if (newFilterString) {
      this.setState({ filteredCompanies: this.props.attendingCompanies.filter((company: Company) => {
        return company.name.toLowerCase().includes(newFilterString.trim().toLowerCase())
        || company
          .findFocuses(this.props.focuses, this.props.companyFocuses)
          .some((focus: Focus) => focus.name.toLowerCase().includes(newFilterString.trim().toLowerCase()))
      })})
    }
    else {
      this.setState({ filteredCompanies: this.props.attendingCompanies });
    }
  }

  public render(): React.ReactElement<Props> {
    if (this.props.errors.length > 0) {
      this.props.errors.forEach((error: string) => console.error(error));
    }

    return (
      <div className="companies-page">
        <Banner isHeader modifier='companies-page'>
          <h1 className="heading-primary">Companies</h1>
        </Banner>
        
        <section className="section section--attending-companies">
          <h2 className="heading-secondary">Attending Companies</h2>
          {
            this.props.errors.length > 0
            ? <div className="error">Failed to load attending companies</div>
            : (
              this.props.isLoading
              ? <div>Loading Company Search...</div>
              : this._renderCompanySearch()
            )
          }
        </section>
      </div>
    );
  }
}

export default connector(CompaniesPage);
