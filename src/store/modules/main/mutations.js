import {
  SET_DARK_MODE,
  SET_MENU,
  SET_PERMISSIONS,
  SET_ECOSYSTEM,
  UPDATE_DEFAULTECOSYSTEM
} from "./mutation-types";

export default {
  [SET_DARK_MODE](state, { darkMode }) {
    state.darkMode = darkMode;
  },
  [SET_MENU](state, menu) {
    state.menu = menu;
  },
  [SET_PERMISSIONS](state, permissions) {
    state.permissions = permissions
  },
  [SET_ECOSYSTEM](state, ecoSystem) {
    state.ecoSystem = ecoSystem
  },
  [UPDATE_DEFAULTECOSYSTEM](state, defaultEcosystem) {
    state.defaultEcosystem = defaultEcosystem
  }
};
