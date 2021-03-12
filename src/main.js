import { createApp } from "vue";
import App from "./App.vue";
import VueAxios from "vue-axios";
// import VueI18n from "vue-i18n";
import router from "./router";
import store from "./store";
import globalComponents from "./global-components";
import axios from "./plugins/axios";
// import i18n from "./plugins/i18n";
import utils from "./utils";
import "./libs";

// Midone Theme
import "./assets/sass/app.scss";


const app = createApp(App);

app.use(store)
app.use(router)
app.use(VueAxios, axios);
// app.use(VueI18n);
  

app.config.performance = true;
app.config.devtools = true;
globalComponents(app);
utils(app);

app.mount("#app");
