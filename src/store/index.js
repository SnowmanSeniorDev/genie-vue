import { createStore, createLogger } from "vuex";
import auth from "./modules/auth";
import layout from "./modules/layout";
import main from "./modules/main";

const store = createStore({
  modules: {
    auth,
    layout,
    main,
  },
  plugins: process.env.NODE_ENV === 'production' ? [] : [createLogger()]
});

export function useStore() {
  return store;
}

export default store;
