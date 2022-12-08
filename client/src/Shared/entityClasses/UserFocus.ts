import User from "./User";
import Focus from "./Focus";

export interface IUserFocus {
  id: number
  user_id: number;
  focus_id: number;
}

export default class UserFocus implements IUserFocus {
  public readonly id: number;
  public readonly user_id: number;
  public readonly focus_id: number;

  public constructor({ id, user_id, focus_id }: IUserFocus) {
    this.id = id;
    this.user_id = user_id;
    this.focus_id = focus_id;
  }

  public findFocus(events: Focus[]): Focus | null {
    return events.find((focus: Focus) => focus.id === this.focus_id)
    ?? null;
  }

  public findUser(users: User[]): User | null {
    return users.find((user: User) => user.id === this.user_id)
    ?? null;
  }

  public static createUserFocuses(focusData: IUserFocus[]): UserFocus[] {
    return focusData.map((focusDatum: IUserFocus) => new UserFocus(focusDatum));
  }

  public static findById(id: number, focuses: UserFocus[]): UserFocus | null {
    return focuses.find((userFocus: UserFocus) => userFocus.id === id) ?? null;
  }

  public static findAllByFocusId(focus_id: number, userFocuses: UserFocus[]): UserFocus[] {
    return userFocuses.filter((userFocus: UserFocus) => userFocus.focus_id === focus_id);
  }

  public static findAllByUserId(user_id: number, userFocuses: UserFocus[]): UserFocus[] {
    return userFocuses.filter((userFocus: UserFocus) => userFocus.user_id === user_id);
  }

  public static findAllByFocusIdAndUserId(focus_id: number, user_id: number, userFocuses: UserFocus[]): UserFocus[] {
    return this.findAllByUserId(
      user_id,
      this.findAllByFocusId(focus_id, userFocuses)
    );
  }
}
