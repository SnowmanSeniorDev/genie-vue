/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

import * as types from "./mutation-types";
import {sysAxios} from "@/plugins/axios";
import router from "@/router";
import { useStore } from "@/store";


export const login = async ({commit}, payload) => {
	const store = useStore();
	const api = '/user/v1/auth';
	return new Promise((resolve) => {
		sysAxios.post(api, payload).then(async response => {
			if(response.status !== 'error') {
				commit(types.LOGIN, response.data);
				await store.dispatch('account/setCompanyIdFromApi', {userId: response.data.userId})
				await store.dispatch('account/setCompanyType', {company_uuid: store.state.account.company_uuid})
				store.dispatch('main/updateMenu', {userId: response.data.userId}).then(() => {
					if(response.data.roles[0] === 'guest') router.push({path: 'account'})
					else router.push({name: 'GENIE_DASHBOARD'})
				})
			}
			else resolve(response)
		})
	})
};

export const logout = ({commit}) => {
	commit(types.LOGOUT);
	router.push({name: 'login'})
};

export default {
	login,
	logout,
};