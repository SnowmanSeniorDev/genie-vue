/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

//import store from '@/store';
import * as types from './mutation-types'
import { sysAxios, appAxios } from '@/plugins/axios'
import { custom_menu } from '@/plugins/menu'

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

export const updateEcosystem = ({ commit }, payload) => {
  const api = `/company/v1/ecosystems/bycompanyid/${payload.company_uuid}`
  return new Promise((resolve) => {
    appAxios.get(api).then(res => {
      commit(types.SET_ECOSYSTEM, [{
        ecosystemId: '00000000-0000-0000-0000-000000000000',
        name: 'Public ecosystem'
      }, ...res.data])

      resolve([{
        ecosystemId: '00000000-0000-0000-0000-000000000000',
        name: 'Public ecosystem'
      }, ...res.data])
    })
  })
}

export const updateDefaultEcosystem = ({ commit }, payload) => {
  commit(types.UPDATE_DEFAULTECOSYSTEM, payload)
}

export default {
	setDarkMode,
  updateMenu,
  updateEcosystem,
  updateDefaultEcosystem
};