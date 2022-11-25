// import { Usertype } from "Shared/enums";
import { store } from "Store/store";
import Company from "./Company";
import User from "./User";

export default class AllowlistDomain implements IAllowlistDomain {
  public readonly id: number = -1;
  public readonly email_domain: string = '';
  public readonly company_id?: number;
  public readonly usertype: string;

  public constructor({ id, email_domain, company_id, usertype}: IAllowlistDomain) {
    this.id = id;
    this.email_domain = email_domain;
    this.company_id = company_id;
    this.usertype = usertype;
  }

  public findCompany(): Company | null {
    return store.getState().companies.find((company: Company) => company.id === this.company_id) ?? null;
  }

  public findUsers(): User[] {
    return store.getState().users.filter((user: User) => {
      const atSignIdx: number = user.email.indexOf('@');
      return user.email.slice(atSignIdx) === this.email_domain;
    });
  }

  public static createAllowlistDomains(allowlistDomainData: IAllowlistDomain[]): AllowlistDomain[] {
    return allowlistDomainData.map((allowlistDomainDatum: IAllowlistDomain) => new AllowlistDomain(allowlistDomainDatum));
  }
}
