import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as auth from "./ducks/auth.duck";
import * as channel from "./ducks/channel.duck";
import * as link from "./ducks/link.duck";
import * as offer from "./ducks/offer.duck";
import * as report from "./ducks/report.duck";

import { metronic } from "../../_metronic";

export const rootReducer = combineReducers({
  auth: auth.reducer,
  channel: channel.reducer,
  link: link.reducer,
  offer: offer.reducer,
  report: report.reducer,

  i18n: metronic.i18n.reducer,
  builder: metronic.builder.reducer
});

export function* rootSaga() {
  yield all([auth.saga(), channel.saga(), link.saga(), offer.saga()]);
}
