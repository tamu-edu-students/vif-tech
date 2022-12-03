import Event from "./Event";
import User from "./User";

export interface IEventSignup {
  id: number;
  user_id: number;
  event_id: number;
}

export default class EventSignup implements IEventSignup {
  public readonly id: number;
  public readonly user_id: number;
  public readonly event_id: number;

  public constructor({ id, user_id, event_id }: IEventSignup) {
    this.id = id;
    this.user_id = user_id;
    this.event_id = event_id;
  }

  public findEvent(events: Event[]): Event | null {
    return events.find((event: Event) => event.id === this.event_id)
    ?? null;
  }

  public findUser(users: User[]): User | null {
    return users.find((user: User) => user.id === this.user_id)
    ?? null;
  }

  public static createEventSignup(eventSignupDatum: IEventSignup): EventSignup {
    return new EventSignup(eventSignupDatum);
  }

  public static createEventSignups(eventSignupData: IEventSignup[]): EventSignup[] {
    return eventSignupData.map((eventSignupDatum: IEventSignup) => EventSignup.createEventSignup(eventSignupDatum));
  }

  public static findById(id: number, eventSignups: EventSignup[]): EventSignup | null {
    return eventSignups.find((eventSignup: EventSignup) => eventSignup.id === id) ?? null;
  }

  public static findAllByEventId(event_id: number, eventSignups: EventSignup[]): EventSignup[] {
    return eventSignups.filter((eventSignup: EventSignup) => eventSignup.event_id === event_id);
  }

  public static findAllByUserId(user_id: number, eventSignups: EventSignup[]): EventSignup[] {
    return eventSignups.filter((eventSignup: EventSignup) => eventSignup.user_id === user_id);
  }

  public static findAllByEventIdAndUserId(event_id: number, user_id: number, eventSignups: EventSignup[]): EventSignup[] {
    return this.findAllByUserId(
      user_id,
      this.findAllByEventId(event_id, eventSignups)
    );
  }
}
