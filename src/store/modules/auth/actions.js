/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

import Vue from "vue";
import * as types from "./mutation-types";
import axios from "@/plugins/axios";
import router from "@/router";

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
	const api = 'user/v1/auth';
	axios.post(api, payload).then(response => {
		return new Promise(() => {
			commit(types.LOGIN, {token: response.data.token});
			router.push({
				name: 'dashboard'
			})
		});
	})
};

export const getuserid = ({commit}, payload) => {
	const api = 'user/v1/auth';
	axios.post(api, payload).then(response => {
		console.log(response)
		return new Promise(() => {
			commit(types.SET_SUER_ID, {user_id: response.user_id})
		})
	})
}

export const logout = ({commit}) => {
	commit(types.LOGOUT);
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