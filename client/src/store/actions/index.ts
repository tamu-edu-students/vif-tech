import {
  FETCH_USERS,
  CREATE_USER,
  FETCH_LOGIN_STATUS,
  LOG_IN,
  LOG_OUT,
  FETCH_COMPANIES,
  CREATE_COMPANY,
  FETCH_ALLOW_LIST
} from "./types";
import history from "../../history";
import vifTech from "../../apis/vifTech";

export const fetchUsers = () => async (dispatch: any) => {
  const response: any = await vifTech.get("/users");
  console.log(`fetchUsers response: `, response);
  const users: any[] = response.data.users;

  dispatch({ type: FETCH_USERS, payload: users });
}

export const createUser = (formValues: any) => async (dispatch: any) => {
  const response: any = await vifTech.post("/users", { user: { ...formValues } })
  .catch(({response: { data: { errors } }}) => {
    throw(new Error(errors.join('///')));
  });
  console.log(`createUser response: `, response);

  const user: any = response.data.user;
  dispatch({ type: CREATE_USER, payload: user });

  history.push('/users/new/success');
}

export const logIn = (formValues: any) => async (dispatch: any) => {
  const response: any = await vifTech.post('/login', {
    user: { ...formValues }
  });

  console.log('logIn response:', response);

  // TODO: Replace with catch()
  if (response.data.status === 401) {
    throw new Error(response.data.errors);
  }

  const { user = null } = response.data;
  dispatch({ type: LOG_IN, payload: user });

  history.push('/');
}

export const logOut = () => async (dispatch: any) => {
  const response: any = await vifTech.post('/logout');
  console.log('logOut response:', response);

  // TODO: Replace with catch
  if (response.data.status === 500) {
    console.error('logOut error: ', response.data.errors);
    return;
  }

  dispatch({ type: LOG_OUT })
}

export const fetchLoginStatus = () => async (dispatch: any) => {
  const response: any = await vifTech.get('/logged_in');
  // TODO: Add catch()
  console.log('fetchLoginStatus response:', response);

  const { logged_in, user = null } = response.data;
  dispatch({ type: FETCH_LOGIN_STATUS, payload: { isLoggedIn: logged_in, user } });
}

export const fetchCompanies = () => async (dispatch: any) => {
  const response: any = await vifTech.get(`/companies`)
  .catch(({response: { data: { errors } }}) => {
    throw(new Error(errors.join('///')));
  });

  console.log('fetchCompanies response:', response);
  dispatch({ type: FETCH_COMPANIES, payload: response.data.companies });
}

export const createCompany = (formValues: any) => async (dispatch: any) => {
  const response: any = await vifTech.post(`/companies`, { company: { ...formValues } })
  .catch(({response: { data: { errors } }}) => {
    throw(new Error(errors.join('///')));
  });

  console.log('fetchCompanies response:', response);
  dispatch({ type: CREATE_COMPANY, payload: response.data.company });
}

// export const fetchCompanyAllowlists = () => async (dispatch: any, getState: any) => {
//   // FETCH COMPANIES AND THEN ALLOWLISTS
//   await fetchCompanies();
//   const response_domains: any = await vifTech.get('/allowlist_domains')
//   .catch(({response: { data: { errors } }}) => {
//     throw(new Error(errors.join('///')));
//   });
//   const response_emails: any = await vifTech.get('/allowlist_emails')
//   .catch(({response: { data: { errors } }}) => {
//     throw(new Error(errors.join('///')));
//   });
//   const companies = getState().companies;

//   const obj = {
//     companyAllowLists: {

//     },
//     studentAllowList: {

//     }
//     volunteerAllowList: {

//     }
//     adminAllowList: {

//     }
//   };

//   // response.forEach(({ usertype }) => {
//   //   switch(usertype) {
//   //     case 'company representative':
//   //       companyAllowLists
//   //   }
//   // })

//   console.log('fetchAllowList response_domains:', response_domains);
//   console.log('fetchAllowList response_emails:', response_emails);
//   // dispatch({ type: FETCH_ALLOW_LIST, payload:  })
// }
