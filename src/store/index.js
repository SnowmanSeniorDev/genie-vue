import { createStore, createLogger } from "vuex";
import createPersistedState from 'vuex-persistedstate'
import auth from "./modules/auth";
import main from "./modules/main";
import account from "./modules/account";

const store = createStore({
  modules: {
    auth,
    main,
    account
  },
  plugins: process.env.NODE_ENV === 'production' ? [createPersistedState()] : [createPersistedState(), createLogger()]
});

export function useStore() {
  return store;
}

export default store;
