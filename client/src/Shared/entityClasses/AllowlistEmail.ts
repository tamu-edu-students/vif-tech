import { Usertype } from "Shared/enums";
import Company from "./Company";
import User from "./User";

export interface IAllowlistEmail {
  id: number;
  company_id?: number;
  email: string;
  usertype: Usertype;
  is_primary_contact?: boolean;
}

export default class AllowlistEmail implements IAllowlistEmail {
  public readonly id: number;
  public readonly email: string;
  public readonly company_id?: number;
  public readonly usertype: Usertype;
  public readonly is_primary_contact?: boolean;

  public constructor({ id, email, company_id, usertype, is_primary_contact}: IAllowlistEmail) {
    this.id = id;
    this.email = email;
    this.company_id = company_id;
    this.usertype = usertype;
    this.is_primary_contact = is_primary_contact;
  }

  public findCompany(companies: Company[]): Company | null {
    return companies.find((company: Company) => company.id === this.company_id) ?? null;
  }

  public findUser(users: User[]): User | null {
    return users.find((user: User) =>
      user.email.toLowerCase() === this.email.toLowerCase()
      && user.usertype === this.usertype
    )
    ?? null;
  }

  public static createAllowlistEmails(allowlistEmailData: IAllowlistEmail[]): AllowlistEmail[] {
    return allowlistEmailData.map((allowlistEmailDatum: IAllowlistEmail) => new AllowlistEmail(allowlistEmailDatum));
  }

  public static filterByUsertype(usertype: Usertype, allowlist_emails: AllowlistEmail[]): AllowlistEmail[] {
    return allowlist_emails.filter((allowlist_email: AllowlistEmail) => allowlist_email.usertype === usertype)
  }
}
