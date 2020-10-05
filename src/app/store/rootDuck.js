import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as auth from "./ducks/auth.duck";
import * as report from "./ducks/report.duck";

import * as language from "./ducks/language.duck";
import * as plan from "./ducks/plan.duck";
import * as profile_type from "./ducks/profile_type.duck";
import * as serie_type from "./ducks/serie_type.duck";

import * as users from "./ducks/users.duck";
import * as categories from "./ducks/categories.duck";
import * as videos from "./ducks/videos.duck";
import * as video_files from "./ducks/video-files.duck";

import { metronic } from "../../_metronic";

export const rootReducer = combineReducers({
  auth: auth.reducer,
  report: report.reducer,

  language: language.reducer,
  plan: plan.reducer,
  profile_type: profile_type.reducer,
  serie_type: serie_type.reducer,

  users: users.reducer,
  categories: categories.reducer,
  videos: videos.reducer,
  video_files: video_files.reducer,

  i18n: metronic.i18n.reducer,
  builder: metronic.builder.reducer
});

export function* rootSaga() {
  yield all([
    auth.saga(), 
    // channel.saga(), 
    // link.saga(), 
    // offer.saga(),
    users.saga(),
  ]);
}
