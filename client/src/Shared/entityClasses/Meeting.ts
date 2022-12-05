import User from "./User";
import Event from "./Event";

export interface IMeeting {
  id: number;
  owner_id: number;
  event_id: number;
  start_time: string;
  end_time: string;
  invitee_id: number;
}

export interface IMeetingJSON {
  id: number;
  owner_id: number;
  event_id: number;
  start_time: string;
  end_time: string;
  invitees: any;
}

export default class Meeting implements IMeeting {
  public readonly id: number;
  public readonly owner_id: number;
  public readonly event_id: number;
  public readonly start_time: string;
  public readonly end_time: string;
  public readonly invitee_id: number;

  public constructor({ id, owner_id: user_id, event_id, start_time, end_time, invitees }: IMeetingJSON) {
    this.id = id;
    this.owner_id = user_id;
    this.event_id = event_id;
    this.start_time = start_time;
    this.end_time = end_time;
    this.invitee_id = invitees.accepted[0]?.id ?? -1;
  }

  public findOwner(users: User[]): User | null {
    return users.find((user: User) => user.id === this.owner_id)
    ?? null;
  }

  public findInvitee(users: User[]): User | null {
    if (this.invitee_id === -1) { return null; }
    return users.find((user: User) => user.id === this.invitee_id)
    ?? null;
  }

  public findEvent(events: Event[]): Event | null {
    return events.find((event: Event) => event.id === this.event_id)
    ?? null;
  }

  public static createMeetings(meetingData: IMeetingJSON[]): Meeting[] {
    return meetingData.map((meetingDatum: IMeetingJSON) => new Meeting(meetingDatum));
  }

  public static findById(id: number, meetings: Meeting[]): Meeting | null {
    return meetings.find((event: Meeting) => event.id === id) ?? null;
  }
}
