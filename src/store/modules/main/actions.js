/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

//import store from '@/store';
import * as types from './mutation-types';
import https from "@/plugins/axios";
import { custom_menu } from "@/plugins/menu";

export const setDarkMode = ({ commit }, darkMode) => {
  commit(types.SET_DARK_MODE, { darkMode });
};

export const updateMenu = ({ commit }, payload) => {
  return new Promise((resolve) => {
    const api = `/access/v1/permission/${payload.userId}`;
    https.get(api).then((res) => {
      console.log(res.data)
      commit(types.SET_MENU, custom_menu(res.data));
      resolve();
    });
  })
};

export default {
	setDarkMode,
  updateMenu
};