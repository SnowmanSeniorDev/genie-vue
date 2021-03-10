/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

import Vue from "vue";
//import store from '@/store';
import * as types from "./mutation-types";
import axios from "@/plugins/axios";

export const check = ({
	commit
}) => {
	commit(types.CHECK);
};

export const register = ({commit}) => {
	commit(types.LOGIN, 'RandomGeneratedToken');
	Vue.router.push({
		name: 'home.index',
	});
};

export const login = ({commit}, payload) => {
	console.log(axios.defaults.baseURL)
	const api = '/user/v1/auth';
	axios.post(api, payload).then(response => {
		return new Promise(() => {
			commit(types.LOGIN, {token: response.token, userRole: response.userRole});
		});
	})
};

export const logout = ({commit}) => {
	commit(types.LOGOUT);
	Vue.router.push({
		name: 'login',
	});
};

export const setMyProfile = ({commit}, payload) => {
	commit(
		types.SET_PROFILE, {
			profile: payload,
		}
	);
};

export default {
	check,
	register,
	login,
	logout,
	setMyProfile
};