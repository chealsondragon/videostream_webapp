import axios from "axios";

export const LOAD_ALL_URL = "api/influencer/get_offer";

export function loadAll() {
  return axios({
    method: 'get',
    url: `${process.env.REACT_APP_IDC_BASE_URL}/${LOAD_ALL_URL}`
  });
}