import User from "./User";
import Event from "./Event";

export interface IAvailability {
  id: number;
  user_id: number;
  event_id: number;
  start_time: string;
  end_time: string;
}

export default class Availability implements IAvailability {
  public readonly id: number;
  public readonly user_id: number;
  public readonly event_id: number;
  public readonly start_time: string;
  public readonly end_time: string;

  public constructor({ id, user_id, event_id, start_time, end_time }: IAvailability) {
    this.id = id;
    this.user_id = user_id;
    this.event_id = event_id;
    this.start_time = start_time;
    this.end_time = end_time;
  }

  public findUser(users: User[]): User | null {
    return users.find((user: User) => user.id === this.user_id)
    ?? null;
  }

  public findEvent(events: Event[]): Event | null {
    return events.find((event: Event) => event.id === this.event_id)
    ?? null;
  }

  public static createAvailabilities(availabilityData: IAvailability[]): Availability[] {
    return availabilityData.map((availabilityDatum: IAvailability) => new Availability(availabilityDatum));
  }

  public static findById(id: number, availabilities: Availability[]): Availability | null {
    return availabilities.find((event: Availability) => event.id === id) ?? null;
  }
}
