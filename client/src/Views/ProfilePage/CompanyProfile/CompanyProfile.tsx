import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { createLoadingSelector, createErrorMessageSelector } from 'Shared/selectors';
import { companyActionTypes, focusActionTypes, companyFocusActionTypes, } from 'Store/actions/types';
import { updateCompany, fetchFocuses, fetchCompanyFocuses, updateCompanyFocuses, fetchCompanies } from 'Store/actions';
// TODO: Potentially add check for allowlist_emails for primary contact

import User from 'Shared/entityClasses/User';
import Focus from 'Shared/entityClasses/Focus';
import Company from 'Shared/entityClasses/Company';

import CompanyProfileFormBasic from './CompanyProfileFormBasic/CompanyProfileFormBasic';
import CompanyProfileFormFocuses from './CompanyProfileFormFocuses/CompanyProfileFormFocuses';


interface OwnProps {
}

interface OwnState {
  basicFields: any;
  focusFields: any;
  isLoading: boolean;
}

const mapStateToProps = (state: IRootState) => {
  const user: User = state.auth.user as User;
  const isPrimaryContact = user.isPrimaryContact(state.allowlist.allowlist_emails);
  const company: Company | null = user.findCompany(state.companyData.companies);

  const isLoading_updateCompany: boolean = createLoadingSelector([companyActionTypes.UPDATE_COMPANY])(state);
  const errors_updateCompany: string[] = createErrorMessageSelector([companyActionTypes.UPDATE_COMPANY])(state);

  const companiesAreStale = state.companyData.isStale;
  const isLoading_fetchCompanies: boolean = createLoadingSelector([companyActionTypes.FETCH_COMPANIES])(state);
  const errors_fetchCompanies: string[] = createErrorMessageSelector([companyActionTypes.FETCH_COMPANIES])(state);

  const focusesAreStale = state.focusData.isStale;
  const isLoading_fetchFocuses: boolean = createLoadingSelector([focusActionTypes.FETCH_FOCUSES])(state);
  const errors_fetchFocuses: string[] = createErrorMessageSelector([focusActionTypes.FETCH_FOCUSES])(state);

  const companyFocusesAreStale = state.companyFocusData.isStale;
  const isLoading_fetchCompanyFocuses: boolean = createLoadingSelector([companyFocusActionTypes.FETCH_COMPANY_FOCUSES])(state);
  const errors_fetchCompanyFocuses: string[] = createErrorMessageSelector([companyFocusActionTypes.FETCH_COMPANY_FOCUSES])(state);

  const isLoading: boolean =
    isLoading_fetchFocuses || focusesAreStale ||
    isLoading_fetchCompanyFocuses || companyFocusesAreStale ||
    isLoading_fetchCompanies || companiesAreStale;
  const errors_breaking: string[] = [...errors_fetchFocuses, ...errors_fetchCompanyFocuses, ...errors_fetchCompanies];

  return {
    user,
    isPrimaryContact,
    company,
    focuses: state.focusData.focuses,
    focusesOfCompany: company?.findFocuses(state.focusData.focuses, state.companyFocusData.companyFocuses) ?? [],

    isLoading_updateCompany,
    errors_updateCompany,

    companiesAreStale,
    isLoading_fetchCompanies,
    errors_fetchCompanies,

    focusesAreStale,
    isLoading_fetchFocuses,
    errors_fetchFocuses,

    companyFocusesAreStale,
    isLoading_fetchCompanyFocuses,
    errors_fetchCompanyFocuses,

    isLoading,
    errors_breaking,
  };
};
const mapDispatchToProps = { updateCompany, fetchFocuses, fetchCompanyFocuses, fetchCompanies, updateCompanyFocuses };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class CompanyProfile extends React.Component<Props, OwnState> {
  state = { basicFields: {}, focusFields: {}, isLoading: false };

  public componentDidMount(): void {
    const promises: Promise<void>[] = []

    if (this.props.focusesAreStale && !this.props.isLoading_fetchFocuses) {
      promises.push(this.props.fetchFocuses());
    }
    if (this.props.companyFocusesAreStale && !this.props.isLoading_fetchCompanyFocuses) {
      promises.push(this.props.fetchCompanyFocuses());
    }
    if (this.props.companiesAreStale && !this.props.isLoading_fetchCompanies) {
      promises.push(this.props.fetchCompanies());
    }

    Promise.all(promises).then(() => this._reloadFieldsState());
  }

  public componentDidUpdate(): void {
    if (this.props.focusesAreStale && !this.props.isLoading_fetchFocuses) {
      this.props.fetchFocuses();
    }
    if (this.props.companyFocusesAreStale && !this.props.isLoading_fetchCompanyFocuses) {
      this.props.fetchCompanyFocuses();
    }
    if (this.props.companiesAreStale && !this.props.isLoading_fetchCompanies) {
      this.props.fetchCompanies();
    }
  }

  private _reloadFieldsState = (): void => {
    this.setState({
      isLoading: false,
      basicFields: this._getInitialBasicFields(),
      focusFields: this._computeInitialFocusChecks()
    });
  }

  private _getInitialBasicFields(): any {
    if (this.props.company) {
      const {
        location,
        logo_img_src,
        website_link,
        hiring_for_fulltime,
        hiring_for_parttime,
        hiring_for_intern,
      } = this.props.company;
      
      return {
        location,
        logo_img_src,
        website_link,
        hiring_for_fulltime,
        hiring_for_parttime,
        hiring_for_intern,
      }
    }
    else {
      throw new Error('ERROR: No company data found');
    }
  }

  // private _getInitialDisabledFields(): any {
  //   const {
  //     email,
  //   } = this.props.user;

  //   return {
  //     email,
  //   }
  // }

  private _computeInitialFocusChecks(): any {
    const { focuses, focusesOfCompany } = this.props;
    let initialFocusChecks = {};
    focuses.forEach((focus: Focus) => {
      if (focusesOfCompany.some((focusOfCompany: Focus) => focus.id === focusOfCompany.id)) {
        initialFocusChecks = { ...initialFocusChecks, [`focus-${focus.id.toString()}`]: true };
      }
    });

    return initialFocusChecks;
  }

  private _updateBasicFieldsState = (newBasicFields: any): void => {
    const modifiedObj: any = {};
    Object.entries(this.state.basicFields).forEach(([key, _]) => {
      modifiedObj[key] = newBasicFields[key] ?? ''
    });
    this.setState({basicFields: {...modifiedObj}});
  }

  private _updateFocusFieldsState = (newFocusFields: any): void => {
    this.setState({focusFields: {...newFocusFields}});
  }

  private _onSaveChanges = (): void => {
    this.setState({ isLoading: true });

    const promises: Promise<void>[] = [];
    promises.push(this.props.updateCompany(this.props.company?.id ?? -1, this.state.basicFields));

    const newFocusIds = Object.entries(this.state.focusFields)
      .filter(([_, isChecked]) => isChecked)
      .map(([id, _]): number => Number.parseInt(id.replace(/focus-/, '')));
    promises.push(this.props.updateCompanyFocuses(this.props.company?.id ?? -1, newFocusIds));
    
    Promise.all(promises).then(() => {
      this._reloadFieldsState();
    });
  }
  
  private _renderImg(logoImgSrc: string): JSX.Element {
    return (
      <div className="my-profile__img-container">
        <img className='my-profile__img' src={logoImgSrc} alt={`${this.props.company?.name} logo`} />
      </div>
    );
  }

  public render(): React.ReactElement<Props> {
    if (this.props.errors_updateCompany.length > 0) {
      this.props.errors_updateCompany.forEach((error: string) => console.error(error));
    }

    if (this.props.errors_breaking.length > 0) {
      this.props.errors_breaking.forEach((error: string) => console.error(error));
      return <div className="error">{this.props.errors_breaking}</div>
    }

    if (this.state.isLoading) {
      return (
        <div>Saving changes...</div>
      );
    }

    if (this.props.isLoading) {
      return (
        <div>Loading Company Profile...</div>
      );
    }

    
    if (!this.props.company) {
      return <div className='error'>No company data found</div>
    }

    const {
      company,
      isPrimaryContact,
      focuses,
    } = this.props;
    const {
      name,
      logo_img_src,
    } = company;

    return (
      <div className="My-Profile my-profile">
        <h2 className="heading-secondary">{`Company Profile (${name})`}</h2>
        {/* <h3 className="heading-tertiary">{firstname} {lastname}</h3> */}
        {
          logo_img_src && 
          <>
            <br />
            {this._renderImg(logo_img_src)}
          </>
        }
        <br />
        <div>
          <CompanyProfileFormBasic
            form="updateBasicCompanyFields"
            initialValues={ {...this._getInitialBasicFields(), /*...this._getInitialDisabledFields()*/} }
            updateBasicFields={this._updateBasicFieldsState}
            isPrimaryContact={isPrimaryContact}
          />
        </div>

        <div>
          <CompanyProfileFormFocuses
            form="updateFocusCompanyFields"
            initialValues={this._computeInitialFocusChecks()}
            focuses={focuses}
            updateFocusFields={this._updateFocusFieldsState}
            isPrimaryContact={isPrimaryContact}
          />
        </div>

          {
            isPrimaryContact &&
            <button onClick={() => this._onSaveChanges()}>Save Changes</button>
          }
      </div>
    );
  }
}

export default connector(CompanyProfile);
