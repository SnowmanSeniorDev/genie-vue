/* ============
 * Mutations for the auth module
 * ============
 *
 * The mutations that are available on the
 * account module.
 */
import {
  SET_STEP,
  SET_ACCOUNT
} from "./mutation-types";

/* eslint-disable no-param-reassign */
export default {
  [SET_STEP](state, payload) {
    state.step = payload.step;
  },
  [SET_ACCOUNT](state, payload) {
    state.account = {
      ...state.account,
      ...payload
    }
  }
};
