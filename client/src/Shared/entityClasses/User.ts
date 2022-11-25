// import { Usertype } from "Shared/enums";
import { store } from "Store/store";
import Company from "./Company";

export default class User implements IUser {
  public readonly id: number = -1;
  public readonly email: string = '';
  public readonly firstname: string = '';
  public readonly lastname: string = '';
  public readonly usertype: string = '';
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

  public findCompany(): Company | null {
    return store.getState().companies.find((company: Company) => company.id === this.company_id) ?? null;
  }

  public static createNewUsers(userData: IUser[]): User[] {
    return userData.map((userDatum: IUser) => new User(userDatum));
  }
}
