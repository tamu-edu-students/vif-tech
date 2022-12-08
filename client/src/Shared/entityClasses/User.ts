import { Usertype } from "Shared/enums";
import AllowlistEmail from "./AllowlistEmail";
import Meeting from "./Meeting";
import Company from "./Company";
import Event from "./Event";
import EventSignup from "./EventSignup";
import Focus from "./Focus";
import UserFocus from "./UserFocus";

export interface IUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  usertype: Usertype;
  profile_img_src?: string;

  // REPRESENTATIVE
  company_id?: number;
  title?: string;
  
  // STUDENT
  class_year?: number;
  resume_link?: string;
  portfolio_link?: string;
  class_semester?: string;
  
  // STUDENT/VOLUNTEER
  // focuses?: string[]; ???
}

export default class User implements IUser {
  public readonly id: number;
  public readonly email: string;
  public readonly firstname: string;
  public readonly lastname: string;
  public readonly usertype: Usertype;
  public readonly profile_img_src?: string;
  // REPRESENTATIVE
  public readonly company_id?: number;
  public readonly title?: string;
  // STUDENT
  public readonly class_year?: number;
  public readonly class_semester?: string;
  public readonly resume_link?: string;
  public readonly portfolio_link?: string;
  // STUDENT/VOLUNTEER

  public constructor({
    id, email, firstname, lastname, usertype, profile_img_src,
    company_id, title,
    class_year, class_semester, resume_link, portfolio_link
  }: IUser) {
    this.id = id;
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.usertype = usertype;
    this.profile_img_src = profile_img_src ?? '';

    this.company_id = company_id;
    this.title = title;

    this.class_year = class_year;
    this.class_semester = class_semester;
    this.resume_link = resume_link ?? '';
    this.portfolio_link = portfolio_link ?? '';
  }

  public get isStudent(): boolean { return this.usertype === Usertype.STUDENT; }
  public get isVolunteer(): boolean { return this.usertype === Usertype.VOLUNTEER; }
  public get isRepresentative(): boolean { return this.usertype === Usertype.REPRESENTATIVE; }
  public get isAdmin(): boolean { return this.usertype === Usertype.ADMIN; }

  public isPrimaryContact(allowlist_emails: AllowlistEmail[]): boolean {
    const user_allowlist_email: AllowlistEmail | null = this.findAllowlistEmail(allowlist_emails);
    return user_allowlist_email?.is_primary_contact ?? false;
  }

  public isAttendingEvent(event: Event, eventSignups: EventSignup[]): boolean {
    return EventSignup.findAllByEventIdAndUserId(event.id, this.id, eventSignups).length > 0;
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

  public findOwnedMeetings(meetings: Meeting[]): Meeting[] {
    return meetings.filter((meeting: Meeting) => meeting.owner_id === this.id);
  }

  public findInvitedMeetings(meetings: Meeting[]): Meeting[] {
    return meetings.filter((meeting: Meeting) => meeting.invitee_id === this.id);
  }

  public findOwnedMeetingsByEvent(meetings: Meeting[], event: Event): Meeting[] {
    return this.findOwnedMeetings(meetings).filter((meeting: Meeting) => meeting.event_id === event.id);
  }

  public findInvitedMeetingsByEvent(meetings: Meeting[], event: Event): Meeting[] {
    return this.findInvitedMeetings(meetings).filter((meeting: Meeting) => meeting.event_id === event.id);
  }

  public hasOwnedMeetingsAtEvent(meetings: Meeting[], event: Event): boolean {
    return this.findOwnedMeetingsByEvent(meetings, event).length > 0;
  }

  public hasInvitedMeetingsAtEvent(meetings: Meeting[], event: Event): boolean {
    return this.findInvitedMeetingsByEvent(meetings, event).length > 0;
  }

  public findFocuses(focuses: Focus[], userFocuses: UserFocus[]): Focus[] {
    return focuses.filter((focus: Focus) => this.hasFocus(focus, userFocuses));
  }

  public hasFocus(focus: Focus, userFocuses: UserFocus[]): boolean {
    return userFocuses.some((userFocus: UserFocus) =>
      userFocus.user_id === this.id
      && userFocus.focus_id === focus.id);
  }

  public static createNewUsers(userData: IUser[]): User[] {
    return userData.map((userDatum: IUser) => new User(userDatum));
  }

  public static findById(id: number, users: User[]): User | null {
    return users.find((user: User) => user.id === id) ?? null;
  }

  public static filterByUsertype(usertype: Usertype, users: User[]): User[] {
    return users.filter((user: User) => user.usertype === usertype)
  }
}
