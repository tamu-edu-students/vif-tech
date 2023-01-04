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

  public constructor({ id, owner_id, event_id, start_time, end_time, invitees }: IMeetingJSON) {
    this.id = id;
    this.owner_id = owner_id;
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


  public duplicateWithNewInviteeId(newInviteeId: number): Meeting {
    return new Meeting({
      id: this.id,
      owner_id: this.owner_id,
      event_id: this.event_id,
      start_time: this.start_time,
      end_time: this.end_time,
      invitees: { accepted: [{id: newInviteeId}] }
    });
  }

  public static createMeetings(meetingData: IMeetingJSON[]): Meeting[] {
    return meetingData.map((meetingDatum: IMeetingJSON) => new Meeting(meetingDatum));
  }

  public static findById(id: number, meetings: Meeting[]): Meeting | null {
    return meetings.find((meeting: Meeting) => meeting.id === id) ?? null;
  }

  public static findByTime(meetings: Meeting[], start_time: string, end_time: string): Meeting | null {
    return meetings.find((meeting: Meeting) => meeting.start_time >= start_time && meeting.end_time <= end_time) ?? null;
  }
}
