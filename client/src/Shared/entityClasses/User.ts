import { Usertype } from "Shared/enums";
import AllowlistEmail from "./AllowlistEmail";
import Company from "./Company";

export interface IUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  usertype: Usertype;
  company_id?: number;
  interests?: string[];
}

export default class User implements IUser {
  public readonly id: number;
  public readonly email: string;
  public readonly firstname: string;
  public readonly lastname: string;
  public readonly usertype: Usertype;
  public readonly company_id?: number;
  public readonly interests?: string[];

  public constructor({ id, email, firstname, lastname, usertype, company_id, interests }: IUser) {
    this.id = id;
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.usertype = usertype;
    this.company_id = company_id;
    this.interests = interests;
  }

  public isPrimaryContact(allowlist_emails: AllowlistEmail[]): boolean {
    const user_allowlist_email: AllowlistEmail | null = this.findAllowlistEmail(allowlist_emails);
    return user_allowlist_email?.isPrimaryContact ?? false;
  }

  public findCompany(companies: Company[]): Company | null {
    return companies.find((company: Company) => company.id === this.company_id) ?? null;
  }

  public findAllowlistEmail(allowlist_emails: AllowlistEmail[]): AllowlistEmail | null {
    return allowlist_emails.find((allowlist_email: AllowlistEmail) => 
      allowlist_email.company_id === this.company_id
      && allowlist_email.email.toLowerCase() === this.email.toLowerCase()
      && allowlist_email.usertype === this.usertype
    )
    ?? null;
  }

  public static createNewUsers(userData: IUser[]): User[] {
    return userData.map((userDatum: IUser) => new User(userDatum));
  }

  public static findById(id: number, users: User[]): User | null {
    return users.find((user: User) => user.id === id) ?? null;
  }
}
