/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

import * as types from "./mutation-types";
import { appAxios } from "@/plugins/axios";

export const setStep = ({commit}, payload) => {
	commit(types.SET_STEP, payload);
};

export const setCompanyId = ({commit}, payload) => {
	commit(types.SET_COMPANYID, payload)
}

export const setCompanyIdFromApi = ({commit}, payload) => {
	return new Promise((resolve) => {
    const api = `/company/v1/user/${payload.userId}`;
    appAxios.get(api).then((res) => {
      commit(types.SET_COMPANYID, {company_uuid: res.data});
      resolve();
    });
  })
}
export default {
	setStep,
	setCompanyId,
	setCompanyIdFromApi
};