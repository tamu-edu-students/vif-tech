import { Usertype } from "Shared/enums";
import { store } from "Store/store";
import Company from "./Company";
import User from "./User";

export interface IAllowlistDomain {
  id: number;
  company_id?: number;
  email_domain: string;
  usertype: Usertype;
}

export default class AllowlistDomain implements IAllowlistDomain {
  public readonly id: number;
  public readonly email_domain: string;
  public readonly company_id?: number;
  public readonly usertype: Usertype;

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
      return user.email.slice(atSignIdx).toLowerCase() === this.email_domain.toLowerCase();
    });
  }

  public static createAllowlistDomains(allowlistDomainData: IAllowlistDomain[]): AllowlistDomain[] {
    return allowlistDomainData.map((allowlistDomainDatum: IAllowlistDomain) => new AllowlistDomain(allowlistDomainDatum));
  }
}
