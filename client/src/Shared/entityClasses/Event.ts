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
