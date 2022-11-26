import { Usertype } from "Shared/enums";
import { store } from "Store/store";
import Company from "./Company";
import User from "./User";

export interface IAllowlistEmail {
  id: number;
  company_id?: number;
  email: string;
  usertype: Usertype;
  isPrimaryContact?: boolean;
}

export default class AllowlistEmail implements IAllowlistEmail {
  public readonly id: number;
  public readonly email: string;
  public readonly company_id?: number;
  public readonly usertype: Usertype;
  public readonly isPrimaryContact?: boolean;

  public constructor({ id, email, company_id, usertype, isPrimaryContact}: IAllowlistEmail) {
    this.id = id;
    this.email = email;
    this.company_id = company_id;
    this.usertype = usertype;
    this.isPrimaryContact = isPrimaryContact;
  }

  public findCompany(): Company | null {
    return store.getState().companies.find((company: Company) => company.id === this.company_id) ?? null;
  }

  public findUser(): User | null {
    return store.getState().users.find((user: User) => user.email.toLowerCase() === this.email.toLowerCase()) ?? null;
  }

  public static createAllowlistEmails(allowlistEmailData: IAllowlistEmail[]): AllowlistEmail[] {
    return allowlistEmailData.map((allowlistEmailDatum: IAllowlistEmail) => new AllowlistEmail(allowlistEmailDatum));
  }
}
