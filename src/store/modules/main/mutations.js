import { SET_DARK_MODE, SET_MENU } from "./mutation-types";

export default {
  [SET_DARK_MODE](state, { darkMode }) {
    state.darkMode = darkMode;
  },
  [SET_MENU](state, menu) {
    state.menu = menu;
  }
};
