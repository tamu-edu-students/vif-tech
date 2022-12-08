// import User from "./User";
// import Event from "./Event";

export interface IFocus {
  id: number;
  name: string
}

export default class Focus implements IFocus {
  public readonly id: number;
  public readonly name: string

  public constructor({ id, name }: IFocus) {
    this.id = id;
    this.name = name;
  }

  public static createFocuses(focusData: IFocus[]): Focus[] {
    return focusData.map((focusDatum: IFocus) => new Focus(focusDatum));
  }

  public static findById(id: number, focuses: Focus[]): Focus | null {
    return focuses.find((focus: Focus) => focus.id === id) ?? null;
  }
}
