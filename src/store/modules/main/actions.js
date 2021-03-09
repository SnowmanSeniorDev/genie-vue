/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

//import store from '@/store';
import * as types from './mutation-types';

export const setDarkMode = ({ commit }, darkMode) => {
  commit(types.SET_DARK_MODE, { darkMode });
};

export default {
	setDarkMode
};