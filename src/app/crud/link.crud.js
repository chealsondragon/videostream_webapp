import axios from "axios";

export const CREATE_URL = "api/link";
export const UPDATE_URL = "api/link/{id}";
export const DELETE_URL = "api/link/{id}";
export const LOAD_URL = "api/link/{id}";
export const LOAD_ALL_URL = "api/influencer/get_links";

export const GENERATE_LINK = 'api/influencer/request_campaign';

export function generate(data) {
  return axios({
    method: 'post',
    url: `${process.env.REACT_APP_IDC_BASE_URL}/${GENERATE_LINK}`,
    data
  });
}

export function loadAll(influencer_id) {
  return axios({
    method: 'get',
    url: `${process.env.REACT_APP_IDC_BASE_URL}/${LOAD_ALL_URL}?influencer_id=${influencer_id}`,
  });
}