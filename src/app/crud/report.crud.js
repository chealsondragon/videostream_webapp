import axios from "axios";

export const LOAD_GAME_SUMMARY = "api/influencer/report/getdata_game_summary";
export const LOAD_GAME_STATS = "api/influencer/report/getdata_game_stats";

export function loadGameSummary(start_date, end_date, currency = 'EUR') {
  return axios({
    method: 'get',
    url: `${process.env.REACT_APP_IDC_BASE_URL}/${LOAD_GAME_SUMMARY}?start_date=${start_date}&end_date=${end_date}&currency=${currency}`
  });
}

export function loadGameStats(date_from, date_to) {
  return axios({
    method: 'get',
    url: `${process.env.REACT_APP_IDC_BASE_URL}/${LOAD_GAME_STATS}?date_from=${date_from}&date_to=${date_to}`
  });
}