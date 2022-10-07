import {
  FETCH_USERS,
  CREATE_USER,
  CHECK_LOGIN_STATUS,
  LOG_IN,
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

export const logIn = (formValues: any) => async (dispatch: any) => {
  const response: any = await vifTech.post('/login', {
    user: {
      username: formValues.username,
      password: formValues.password,
    }
  },
  {
    headers: {'Content-Type': 'application/json; charset=utf-8'}
  });

  console.log('logIn response:', response);

  dispatch({ type: LOG_IN, payload: null })
}

export const checkLoginStatus = () => async (dispatch: any) => {
  const response: any = await vifTech.get('/logged_in');
  // .then(response => {
  //     if (response.data.logged_in) {
  //       this.handleLogin(response)
  //     } else {
  //       this.handleLogout()
  //     }
  //   })
  console.log('checkLoginStatus response:', response);

  // .catch(error => console.log('api errors:', error));

  dispatch({ type: CHECK_LOGIN_STATUS, payload: { isLoggedIn: null, user: null } })
}
