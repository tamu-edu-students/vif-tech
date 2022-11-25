import { store } from "Store/store";
import AllowlistDomain from "./AllowlistDomain";
import AllowlistEmail from "./AllowlistEmail";
import User from "./User";

export default class Company implements ICompany {
  public readonly id: number = -1;
  public readonly name: string = '';
  public readonly description: string = '';

  public constructor({ id, name, description }: ICompany) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  public findAllowlistEmails(): AllowlistEmail[] {
    return store.getState().allowlist.allowlist_emails.filter((allowlist_email: AllowlistEmail) => allowlist_email.company_id === this.id);
  }
  
  public findPrimaryContact(): AllowlistEmail | null {
    return this.findAllowlistEmails().find((allowlist_email: AllowlistEmail) => allowlist_email.isPrimaryContact === true) ?? null;
  }

  public findAllowlistDomains(): AllowlistDomain[] {
    return store.getState().allowlist.allowlist_domains.filter((allowlist_domain: AllowlistDomain) => allowlist_domain.company_id === this.id);
  }

  public findRepresentatives(): User[] {
    return store.getState().users.filter((user: User) => user.company_id === this.id);
  }

  public findPrimaryUser(): User | null {
    const primaryAllowlistEmail = this.findAllowlistEmails().find((allowlist_email: AllowlistEmail) => allowlist_email.isPrimaryContact === true);
    if (primaryAllowlistEmail) {
      return this.findRepresentatives().find((user: User) => user.email === primaryAllowlistEmail.email) ?? null;
    }
    return null;
  }

  public static createCompanies(companyData: ICompany[]): Company[] {
    return companyData.map((companyDatum: ICompany) => new Company(companyDatum));
  }
}
