import {
  SET_DARK_MODE,
  SET_MENU,
  SET_PERMISSIONS,
  SET_ECOSYSTEMS,
  SET_LAYOUT,
  UPDATE_DEFAULTECOSYSTEM,
  NEED_UPDATE_PROVENANCE_HISTORY,
  UPDATED_PROVENANCE_HISTORY
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
  [SET_ECOSYSTEMS](state, ecoSystem) {
    state.ecoSystem = ecoSystem
  },
  [UPDATE_DEFAULTECOSYSTEM](state, defaultEcosystem) {
    state.defaultEcosystem = defaultEcosystem
  },
  [NEED_UPDATE_PROVENANCE_HISTORY](state) {
    state.provenanceHistoryUpdateNeed = true
  },
  [UPDATED_PROVENANCE_HISTORY](state) {
    state.provenanceHistoryUpdateNeed = false
  }
};
