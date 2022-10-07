import {
  FETCH_USERS,
  CREATE_USER,
} from "./types";
import history from "../history";
import vifTech from "../apis/vifTech";

export const fetchUsers = () => async (dispatch: any) => {
  const response: any = await vifTech.get("/users");
  console.log(`fetchUsers response: `, response);
  const users: any[] = response.data.users;

  dispatch({ type: FETCH_USERS, payload: users });
}

export const createUser = (formValues: any) => async (dispatch: any) => {
  const response: any = await vifTech.post(
    "/users",
    {
      user: { ...formValues }
    },
    {
      headers: {
      'Content-Type': 'application/json'
      }
    }
  );
  console.log(`createUser response: `, response);
  if (response.data.status === 500) {
    console.error(response.data.errors);
    return;
  }

  const user: any = response.data.user;

  dispatch({ type: CREATE_USER, payload: user });
  history.push('/users/new/success')
}
