import { createApp } from "vue";
import App from "./App.vue";
import VueAxios from 'vue-axios'
import router from "./router";
import store from "./store";
import globalComponents from "./global-components";
import utils from "./utils";
import axios from './plugins/axios';
import "./libs";

// Midone Theme
import "./assets/sass/app.scss";

const app = createApp(App)
  .use(store)
  .use(router)
  .use(VueAxios, axios);

app.config.performance = true;
app.config.devtools = true;
globalComponents(app);
utils(app);

app.mount("#app");
