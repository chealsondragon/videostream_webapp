import axios from "axios";

export const LOAD_WATCH_HOURS = "api/frontend/report/watch_hours";
export const LOAD_TOP_RATED = "api/frontend/report/top_rated";
export const LOAD_LATEST_WATCH = "api/frontend/report/latest_watch";
export const LOAD_USER_DATA = "api/frontend/report/user_data";
export const LOAD_PAYMENT_DATA = "api/frontend/report/payment_data";

export function getWatchHours(from, to) {
  return axios.get(LOAD_WATCH_HOURS + `?from=${from}&to=${to}`);
}

export function getTopRated(from, to) {
  return axios.get(LOAD_TOP_RATED + `?from=${from}&to=${to}`);
}

export function getLatestWatch(from, to) {
  return axios.get(LOAD_LATEST_WATCH + `?from=${from}&to=${to}`);
}

export function getUserData(from, to) {
  return axios.get(LOAD_USER_DATA + `?from=${from}&to=${to}`);
}

export function getPaymentData(from, to) {
  return axios.get(LOAD_PAYMENT_DATA + `?from=${from}&to=${to}`);
}