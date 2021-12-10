/* ============
 * Mutations for the auth module
 * ============
 *
 * The mutations that are available on the
 * account module.
 */
import {
  SET_STEP,
  SET_ACCOUNT,
  SET_COMPANYID,
  SET_COMPANYTYPE
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
  },
  [SET_COMPANYID](state, payload) {
    state.company_uuid = payload.company_uuid
  },
  [SET_COMPANYTYPE](state, payload) {
    state.company_type = payload.company_type
  },
};
