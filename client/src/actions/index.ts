import {
  FETCH_USERS,
} from "./types";
import vifTech from "../apis/vifTech";

export const fetchUsers = () => async (dispatch: any) => {
  const response = await vifTech.get("/users");
  console.log(`fetchUsers response: `, response);
  const users = response.data.users;

  dispatch({ type: FETCH_USERS, payload: users });
}
