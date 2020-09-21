import axios from "axios";

export const LOGIN_URL = "api/auth/login";
export const REGISTER_URL = "api/auth/register";
export const REQUEST_PASSWORD_URL = "api/auth/forgot-password";
export const CHANGE_PASSWORD_URL = "api/auth/change-password";
export const CHANGE_ME = "api/admin/me"

export const ME_URL = "api/user";

export function login(email, password) {
  return axios.post(LOGIN_URL, { email, password });
}

export function register(email, firstname, lastname, password) {
  return axios.post(REGISTER_URL, { email, firstname, lastname, password });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function changePassword(curPassword, newPassword, callBackSuccess, callBackError) {
  return axios.post(CHANGE_PASSWORD_URL, { curPassword, newPassword })
    .then((result) => {
      console.log('changePassword success', result);
      callBackSuccess(result.message || 'Password changed!')
    })
    .catch((error) => {
      console.log('changePassword Error', error);
      // const errorMsg = error.description || error.message || 'Unspecified error';
      callBackError('Change Password Failed!')
    });
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  return axios.get(ME_URL);
}

export function changeProfile(data, callBackSuccess, callBackError) {
  return axios.patch(CHANGE_ME, data)
    .then((result) => {
      console.log('updateMe success', result);
      callBackSuccess(result.message || 'Profile changed!')
    })
    .catch((error) => {
      console.log('updateMe Error', error);
      // const errorMsg = error.description || error.message || 'Unspecified error';
      callBackError('Profile Change Failed!')
    });
}
