/* ============
 * Mutations for the auth module
 * ============
 *
 * The mutations that are available on the
 * account module.
 */
import {
  REGISTER,
  LOGIN,
  LOGOUT,
  CHECK,
  SET_PROFILE,
  SET_USER_ID
} from "./mutation-types";

/* eslint-disable no-param-reassign */
export default {
  [REGISTER]() {
    //
  },

  [LOGIN](state, payload) {
    state.authenticated = true;
    state.loginSuccess = true;
    localStorage.setItem('id_token', payload.token);
    state.token = payload.token;
    state.user_id = payload.userId;
    state.user_role = payload.roles[0];
    state.display_name = payload.displayName;
  },

  [CHECK](state, payload) {
    state.authenticated = true;
    state.loginSuccess = true;
    state.token = payload.token;
  },

  [SET_USER_ID](state, payload) {
    state.user_id = payload.user_id
  },

  [LOGOUT](state) {
    state.authenticated = false;
    state.loginSuccess = false;
    state.userRole = null;
    localStorage.removeItem('id_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('profile');
    state.token = null;
  },

  [SET_PROFILE](state, payload) {
    state.profile = payload.profile;
  },
};
