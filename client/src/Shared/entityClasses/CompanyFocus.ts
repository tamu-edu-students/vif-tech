import Company from "./Company";
import Focus from "./Focus";

export interface ICompanyFocus {
  id: number
  company_id: number;
  focus_id: number;
}

export default class CompanyFocus implements ICompanyFocus {
  public readonly id: number;
  public readonly company_id: number;
  public readonly focus_id: number;

  public constructor({ id, company_id, focus_id }: ICompanyFocus) {
    this.id = id;
    this.company_id = company_id;
    this.focus_id = focus_id;
  }

  public findFocus(events: Focus[]): Focus | null {
    return events.find((focus: Focus) => focus.id === this.focus_id)
    ?? null;
  }

  public findCompany(companies: Company[]): Company | null {
    return companies.find((company: Company) => company.id === this.company_id)
    ?? null;
  }

  public static createCompanyFocuses(focusData: ICompanyFocus[]): CompanyFocus[] {
    return focusData.map((focusDatum: ICompanyFocus) => new CompanyFocus(focusDatum));
  }

  public static findById(id: number, focuses: CompanyFocus[]): CompanyFocus | null {
    return focuses.find((companyFocus: CompanyFocus) => companyFocus.id === id) ?? null;
  }

  public static findAllByFocusId(focus_id: number, companyFocuses: CompanyFocus[]): CompanyFocus[] {
    return companyFocuses.filter((companyFocus: CompanyFocus) => companyFocus.focus_id === focus_id);
  }

  public static findAllByCompanyId(company_id: number, companyFocuses: CompanyFocus[]): CompanyFocus[] {
    return companyFocuses.filter((companyFocus: CompanyFocus) => companyFocus.company_id === company_id);
  }

  public static findAllByFocusIdAndCompanyId(focus_id: number, company_id: number, companyFocuses: CompanyFocus[]): CompanyFocus[] {
    return this.findAllByCompanyId(
      company_id,
      this.findAllByFocusId(focus_id, companyFocuses)
    );
  }
}
