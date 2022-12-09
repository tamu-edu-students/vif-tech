import Meeting, { IMeetingJSON } from "./Meeting";
import Company from "./Company";

export interface IVirtualFairMeetingJSON {
  id: number;
  company_id: number;
  meeting: IMeetingJSON;
}

export interface IVirtualFairMeeting {
  id: number;
  company_id: number;
  meeting: Meeting;
  start_time: string;
  end_time: string;
}

// type TimeOption = {
//   start_time: string;
//   end_time: string;
// }

export default class VirtualFairMeeting implements IVirtualFairMeeting {
  public readonly id: number;
  public readonly company_id: number;
  public readonly meeting: Meeting;
  public readonly start_time: string;
  public readonly end_time: string;

  public constructor({ id, company_id, meeting: meetingJSON }: IVirtualFairMeetingJSON) {
    this.id = id;
    this.company_id = company_id;
    this.meeting = new Meeting(meetingJSON);
    this.start_time = meetingJSON.start_time;
    this.end_time = meetingJSON.end_time;
  }
  
  public findCompany(companies: Company[]): Company | null {
    return companies.find((company: Company) => company.id === this.company_id) ?? null;
  }

  // getRepAvailabilitiesForEvent(users: User[], meetings: Meeting[], event: Event): TimeOption[] {
  //   const timeSet: Set<TimeOption> = new Set<TimeOption>();
  //   const representatives: User[] = this.findRepresentatives(users);

  //   representatives.forEach((rep: User) => {
  //     rep.findOwnedMeetingsByEvent(meetings, event).forEach((meeting: Meeting) => {
  //       timeSet.add({start_time: meeting.start_time, end_time: meeting.end_time});
  //     });
  //   });
    
  //   return Array.from(timeSet.values());
  // }

  public static createVirtualFairMeetings(virtualFairMeetingData: IVirtualFairMeetingJSON[]): VirtualFairMeeting[] {
    return virtualFairMeetingData.map((virtualFairMeetingDatum: IVirtualFairMeetingJSON) => new VirtualFairMeeting(virtualFairMeetingDatum));
  }

  public static findById(id: number, virtualFairMeetings: VirtualFairMeeting[]): VirtualFairMeeting | null {
    return virtualFairMeetings.find((virtualFairMeeting: VirtualFairMeeting) => virtualFairMeeting.id === id) ?? null;
  }
}
