import {
  FETCH_USERS,
  CREATE_USER,
  FETCH_LOGIN_STATUS,
  LOG_IN,
  LOG_OUT,
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
  const response: any = await vifTech.post("/users", { user: { ...formValues } });
  console.log(`createUser response: `, response);
  if (response.data.status === 500) {
    console.error(response.data.errors);
    return;
  }

  const user: any = response.data.user;
  dispatch({ type: CREATE_USER, payload: user });

  history.push('/users/new/success')
}

export const logIn = (formValues: any) => async (dispatch: any) => {
  const response: any = await vifTech.post('/login', {
    user: { ...formValues }
  });

  console.log('logIn response:', response);

  if (response.data.status === 500) {
    console.error(response.data.errors);
    return;
  }

  const { logged_in, user = null } = response.data;
  dispatch({ type: LOG_IN, payload: user });
}

export const logOut = () => async (dispatch: any) => {
  const response: any = await vifTech.post('/logout');
  console.log('logOut response:', response);

  if (response.data.status === 500) {
    console.error(response.data.errors);
    return;
  }

  dispatch({ type: LOG_OUT })
}

export const fetchLoginStatus = () => async (dispatch: any) => {
  const response: any = await vifTech.get('/logged_in');
  console.log('fetchLoginStatus response:', response);

  if (response.data.status === 500) {
    console.error(response.data.errors);
    return;
  }

  const { logged_in, user = null } = response.data;
  dispatch({ type: FETCH_LOGIN_STATUS, payload: { isLoggedIn: logged_in, user } });
}
