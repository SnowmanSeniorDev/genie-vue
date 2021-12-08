/* ============
 * Mutations for the auth module
 * ============
 *
 * The mutations that are available on the
 * account module.
 */

import { SET_LAYOUT } from "./mutation-types";

/* eslint-disable no-param-reassign */
export default {
  [SET_LAYOUT](state, payload) {
    state.layout = payload.layout;
  }
};
