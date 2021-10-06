/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

//import store from '@/store';
import * as types from './mutation-types';
import { sysAxios } from "@/plugins/axios";
import { custom_menu } from "@/plugins/menu";
// import _ from "lodash";

export const setDarkMode = ({ commit }, darkMode) => {
  commit(types.SET_DARK_MODE, { darkMode });
};

export const updateMenu = ({ commit }, payload) => {
  return new Promise((resolve) => {
    const api = `/access/v1/permission/${payload.userId}`;
    sysAxios.get(api).then((res) => {
      commit(types.SET_PERMISSIONS, res.data.filter(item => {return item.type === "Menu"}));
      commit(types.SET_MENU, custom_menu(res.data.filter(item => {return item.type === "Menu"})));
      resolve();
    });
  })
};

export default {
	setDarkMode,
  updateMenu
};