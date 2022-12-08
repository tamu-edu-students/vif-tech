import User from "./User";
import UserFocus from "./UserFocus";
import Company from "./Company";
import CompanyFocus from "./CompanyFocus";
// import Event from "./Event";

export interface IFocus {
  id: number;
  name: string
}

export default class Focus implements IFocus {
  public readonly id: number;
  public readonly name: string

  public constructor({ id, name }: IFocus) {
    this.id = id;
    this.name = name;
  }

  public findUsers(users: User[], userFocuses: UserFocus[]): User[] {
    return users.filter((user: User) =>
      userFocuses.some((userFocus: UserFocus) =>
        userFocus.focus_id === this.id
        && userFocus.user_id === user.id
      )
    );
  }

  public findCompanies(companies: Company[], companyFocuses: CompanyFocus[]): Company[] {
    return companies.filter((company: Company) =>
      companyFocuses.some((companyFocus: CompanyFocus) =>
        companyFocus.focus_id === this.id
        && companyFocus.company_id === company.id
      )
    );
  }

  public static createFocuses(focusData: IFocus[]): Focus[] {
    return focusData.map((focusDatum: IFocus) => new Focus(focusDatum));
  }

  public static findById(id: number, focuses: Focus[]): Focus | null {
    return focuses.find((focus: Focus) => focus.id === id) ?? null;
  }
}
