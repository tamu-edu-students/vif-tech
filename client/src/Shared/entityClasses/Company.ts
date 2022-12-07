import AllowlistDomain from "./AllowlistDomain";
import AllowlistEmail from "./AllowlistEmail";
import Event from "./Event";
import EventSignup from "./EventSignup";
import Meeting from "./Meeting";
import User from "./User";

export interface ICompany {
  id: number;
  name: string;
  description: string;
}

type TimeOption = {
  start_time: string;
  end_time: string;
}

export default class Company implements ICompany {
  public readonly id: number;
  public readonly name: string;
  public readonly description: string;

  public constructor({ id, name, description }: ICompany) {
    this.id = id;
    this.name = name;
    this.description = description;
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
