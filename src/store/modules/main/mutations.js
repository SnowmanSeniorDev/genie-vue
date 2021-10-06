import { SET_DARK_MODE, SET_MENU, SET_PERMISSIONS } from "./mutation-types";

export default {
  [SET_DARK_MODE](state, { darkMode }) {
    state.darkMode = darkMode;
  },
  [SET_MENU](state, menu) {
    state.menu = menu;
  },
  [SET_PERMISSIONS](state, permissions) {
    state.permissions = permissions
  }
};
