import { compile } from 'path-to-regexp';
import isEmpty from 'lodash/isEmpty';

const processURL = (pathRegex, params) => {
  if (isEmpty(params)) {
    return pathRegex;
  }
  const toPath = compile(pathRegex, { encode: encodeURIComponent });
  return toPath(params || {});
};

const abstractURL = (pathRegex) => (options) =>
  processURL(pathRegex, options);

export default {
  INDEX: abstractURL('/'),

  // Authentication
  AUTH: abstractURL('/auth'),
  LOGIN: abstractURL('/auth/login'),
  REGISTER: abstractURL('/auth/registeration'),
  FORGOT_PASSWORD: abstractURL('/auth/forgot-password'),
  CHANGE_PASSWORD: abstractURL('/change-password'),
  LOGOUT: abstractURL('/logout'),

  // Profile and Account
  PROFILE: abstractURL('/profile'),
  PROFILE_TYPE: abstractURL('/profile_type'),
  USERS: abstractURL('/users'),
  // EDIT_OPERATOR: abstractURL('/operator/:id'),
  // LIST_OPERATOR: abstractURL('/list_operator'),

  // Metronics
  BUILDER: abstractURL('/builder'),
  DASHBOARD: abstractURL('/dashboard'),
  GOOGLE_MATERIAL: abstractURL('/google-material'),
  REACT_BOOTSTRAP: abstractURL('/react-bootstrap'),
  DOCS: abstractURL('/docs'),

  // Admin
  LANG: abstractURL('/lang'),
  PLAN: abstractURL('/plan'),
  SERIE_TYPE: abstractURL('/serie_type'),
  CATEGORY: abstractURL('/category'),

  LIST_VIDEO: abstractURL('/videos'),
  EDIT_VIDEO: abstractURL('/video/:id'),
  UPLOAD_CONTENT: abstractURL('/content/:id'),

  STATS_VIDEO: abstractURL('/report/stats_video'),
  STATS_USER: abstractURL('/report/stats_user'),
  STATS_PAYMENT: abstractURL('/report/payment'),

  NOTFOUND: abstractURL('/error/error-v1')
};
