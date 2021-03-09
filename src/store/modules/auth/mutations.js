/* ============
 * Mutations for the auth module
 * ============
 *
 * The mutations that are available on the
 * account module.
 */

import Vue from "vue";
import {
  CHECK,
  REGISTER,
  LOGIN,
  LOGOUT,
  SET_PROFILE
} from "./mutation-types";

/* eslint-disable no-param-reassign */
export default {
  [CHECK](state) {
    state.authenticated = !!localStorage.getItem('id_token');
    if (state.authenticated) {
      Vue.$http.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('id_token')}`;
    }
  },

  [REGISTER]() {
    //
  },

  [LOGIN](state, payload) {
    state.authenticated = true;
    state.loginSuccess = true;
    localStorage.setItem('id_token', payload.token);
    state.token = payload.token;
    state.userRole = payload.userRole;
  },

  [LOGOUT](state) {
    state.authenticated = false;
    state.loginSuccess = false;
    state.userRole = null;
    localStorage.removeItem('id_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('profile');
    state.token = null;
    Vue.$http.defaults.headers.common.Authorization = '';
  },

  [SET_PROFILE](state, payload) {
    state.profile = payload.profile;
  },
};
