import { SET_DARK_MODE } from "./mutation-types";

export default {
  [SET_DARK_MODE](state, { darkMode }) {
    state.darkMode = darkMode;
  }
};
