import AllowlistDomain from "./AllowlistDomain";
import AllowlistEmail from "./AllowlistEmail";
import CompanyFocus from "./CompanyFocus";
import Event from "./Event";
import EventSignup from "./EventSignup";
import Focus from "./Focus";
import Meeting from "./Meeting";
import User from "./User";

export interface ICompany {
  id: number;
  name: string;
  description: string;
  location: string;
  logo_img_src: string;
  website_link: string;
  hiring_for_fulltime: boolean;
  hiring_for_parttime: boolean;
  hiring_for_intern: boolean;
}

type TimeOption = {
  start_time: string;
  end_time: string;
}

export default class Company implements ICompany {
  public readonly id: number;
  public readonly name: string;
  public readonly description: string;
  public readonly location: string;
  public readonly logo_img_src: string;
  public readonly website_link: string;
  public readonly hiring_for_fulltime: boolean;
  public readonly hiring_for_parttime: boolean;
  public readonly hiring_for_intern: boolean;

  public constructor({ id, name, description, location, logo_img_src, website_link, hiring_for_fulltime, hiring_for_parttime, hiring_for_intern }: ICompany) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.location = location ?? '';
    this.logo_img_src = logo_img_src ?? '';
    this.website_link = website_link ?? '';
    this.hiring_for_fulltime = hiring_for_fulltime ?? false;
    this.hiring_for_parttime = hiring_for_parttime ?? false;
    this.hiring_for_intern = hiring_for_intern ?? false;
  }

  getRepAvailabilitiesForEvent(users: User[], meetings: Meeting[], event: Event): TimeOption[] {
    const timeSet: Set<TimeOption> = new Set<TimeOption>();
    const representatives: User[] = this.findRepresentatives(users);

    representatives.forEach((rep: User) => {
      rep.findOwnedMeetingsByEvent(meetings, event).forEach((meeting: Meeting) => {
        timeSet.add({start_time: meeting.start_time, end_time: meeting.end_time});
      });
    });
    
    return Array.from(timeSet.values());
  }

  public isAttendingEvent(users: User[], event: Event, eventSignups: EventSignup[]): boolean {
    const representatives = this.findRepresentatives(users);
    return representatives.some((rep: User) => rep.isAttendingEvent(event, eventSignups));
  }

  public findFocuses(focuses: Focus[], companyFocuses: CompanyFocus[]): Focus[] {
    return focuses.filter((focus: Focus) => this.hasFocus(focus, companyFocuses));
  }

  public hasFocus(focus: Focus, companyFocuses: CompanyFocus[]): boolean {
    return companyFocuses.some((companyFocus: CompanyFocus) =>
      companyFocus.company_id === this.id
      && companyFocus.focus_id === focus.id);
  }

  public findAllowlistEmails(allowlist_emails: AllowlistEmail[]): AllowlistEmail[] {
    return allowlist_emails.filter((allowlist_email: AllowlistEmail) => allowlist_email.company_id === this.id);
  }
  
  public findPrimaryContact(allowlist_emails: AllowlistEmail[]): AllowlistEmail | null {
    return this.findAllowlistEmails(allowlist_emails).find((allowlist_email: AllowlistEmail) => allowlist_email.is_primary_contact === true) ?? null;
  }

  public findAllowlistDomains(allowlist_domains: AllowlistDomain[]): AllowlistDomain[] {
    return allowlist_domains.filter((allowlist_domain: AllowlistDomain) => allowlist_domain.company_id === this.id);
  }

  public findRepresentatives(users: User[]): User[] {
    return users.filter((user: User) => user.company_id === this.id);
  }

  public findPrimaryUser(users: User[], allowlist_emails: AllowlistEmail[]): User | null {
    const primaryAllowlistEmail: AllowlistEmail | null = this.findPrimaryContact(allowlist_emails);
    if (primaryAllowlistEmail) {
      return this.findRepresentatives(users).find((user: User) => user.email.toLowerCase() === primaryAllowlistEmail.email.toLowerCase()) ?? null;
    }
    return null;
  }

  public static createCompanies(companyData: ICompany[]): Company[] {
    return companyData.map((companyDatum: ICompany) => new Company(companyDatum));
  }

  public static findById(id: number, companies: Company[]): Company | null {
    return companies.find((company: Company) => company.id === id) ?? null;
  }
}
