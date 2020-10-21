import axios from "axios";

export const LOAD_WATCH_HOURS = "api/frontend/report/watch_hours";
export const LOAD_TOP_RATED = "api/frontend/report/top_rated";
export const LOAD_LATEST_WATCH = "api/frontend/report/latest_watch";
export const LOAD_USER_DATA = "api/frontend/report/user_data";
export const LOAD_PAYMENT_DATA = "api/frontend/report/payment_data";

export function getWatchHours() {
  return axios.get(LOAD_WATCH_HOURS);
}

export function getTopRated() {
  return axios.get(LOAD_TOP_RATED);
}

export function getLatestWatch() {
  return axios.get(LOAD_LATEST_WATCH);
}

export function getUserData() {
  return axios.get(LOAD_USER_DATA);
}

export function getPaymentData() {
  return axios.get(LOAD_PAYMENT_DATA);
}