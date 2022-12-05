import { minToMs } from "Shared/utils";
import EventSignup from "./EventSignup";
import Meeting from "./Meeting";
import User from "./User";

export interface IEvent {
  id: number;
  title: string;
  description: string;
  start_time: string
  end_time: string;
}

export default class Event implements IEvent {
  public readonly id: number;
  public readonly title: string;
  public readonly description: string;
  public readonly start_time: string;
  public readonly end_time: string;

  public constructor({ id, title, description, start_time, end_time }: IEvent) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.start_time = start_time;
    this.end_time = end_time;
  }

  public createTimeSlots(sessionLengthMins: number, breakLengthMins: number): any[] {
    const sessionLength_ms: number = minToMs(sessionLengthMins);
    const breakLength_ms: number = minToMs(breakLengthMins);
    const start_ms: number = Date.parse(this.start_time);
    const end_ms: number = Date.parse(this.end_time);

    const timeSlots = [];

    let mult = 0;
    while (true) {
      const timeSlot = {
        start_time: new Date(start_ms + mult*(sessionLength_ms + breakLength_ms)).toISOString(),
        end_time: new Date(start_ms + mult*(sessionLength_ms + breakLength_ms) + sessionLength_ms).toISOString(),
      };

      if (Date.parse(timeSlot.end_time) > end_ms) { break; }
      else { timeSlots.push(timeSlot); }

      mult += 1;
    }

    return timeSlots;
  }

  public findMeetings(meetings: Meeting[]): Meeting[] {
    return meetings.filter((meeting: Meeting) => meeting.event_id === this.id);
  }

  public findSignups(eventSignups: EventSignup[]): EventSignup[] {
    return eventSignups.filter((eventSignup: EventSignup) => eventSignup.event_id === this.id);
  }

  public findAttendees(users: User[], eventSignups: EventSignup[]): User[] {
    return users.filter((user: User) => user.isAttendingEvent(this, eventSignups));
  }

  public static createEvents(eventData: IEvent[]): Event[] {
    return eventData.map((eventDatum: IEvent) => new Event(eventDatum));
  }

  public static findById(id: number, events: Event[]): Event | null {
    return events.find((event: Event) => event.id === id) ?? null;
  }

  public static findByTitle(title: string, events: Event[]): Event | null {
    return events.find((event: Event) => event.title === title) ?? null;
  }
}
