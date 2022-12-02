import { Usertype } from "Shared/enums";
import Company from "./Company";
import User from "./User";

export interface IAllowlistDomain {
  id: number;
  company_id?: number;
  domain: string;
  usertype: Usertype;
}

export default class AllowlistDomain implements IAllowlistDomain {
  public readonly id: number;
  public readonly domain: string;
  public readonly company_id?: number;
  public readonly usertype: Usertype;

  public constructor({ id, domain, company_id, usertype}: IAllowlistDomain) {
    this.id = id;
    this.domain = domain;
    this.company_id = company_id;
    this.usertype = usertype;
  }

  public findCompany(companies: Company[]): Company | null {
    return companies.find((company: Company) => company.id === this.company_id) ?? null;
  }

  public findUsers(users: User[]): User[] {
    return users.filter((user: User) => {
      const atSignIdx: number = user.email.indexOf('@');
      return user.email.slice(atSignIdx).toLowerCase() === this.domain.toLowerCase();
    });
  }

  public static createAllowlistDomains(allowlistDomainData: IAllowlistDomain[]): AllowlistDomain[] {
    return allowlistDomainData.map((allowlistDomainDatum: IAllowlistDomain) => new AllowlistDomain(allowlistDomainDatum));
  }

  public static filterByUsertype(usertype: Usertype, allowlist_domains: AllowlistDomain[]): AllowlistDomain[] {
    return allowlist_domains.filter((allowlist_domain: AllowlistDomain) => allowlist_domain.usertype === usertype)
  }
}
