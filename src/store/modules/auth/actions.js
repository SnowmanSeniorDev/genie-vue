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
	await sysAxios.post(api, payload).then(response => {
		console.log("response = ", response)
		return new Promise(async () => {
			commit(types.LOGIN, response.data);
			await store.dispatch('account/setCompanyIdFromApi', {userId: response.data.userId})
			store.dispatch('main/updateMenu', {userId: response.data.userId}).then(() => {
				if(response.data.roles[0] === 'guest') router.push({path: 'account'})
				else router.push({name: 'GENIE_DASHBOARD'})
			})
		});
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