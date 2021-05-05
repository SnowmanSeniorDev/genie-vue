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


export const login = ({commit}, payload) => {
	const store = useStore();
	const api = '/user/v1/auth';
	sysAxios.post(api, payload).then(response => {
		return new Promise(() => {
			commit(types.LOGIN, response.data);
			store.dispatch('main/updateMenu', {userId: response.data.userId}).then(() => {
				router.push({
					name: 'GENIE_DASHBOARD'
				})
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