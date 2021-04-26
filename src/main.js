import { createApp } from "vue";
import { VueReCaptcha } from "vue-recaptcha-v3";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import globalComponents from "./global-components";
import i18n from "./plugins/i18n";
import utils from "./utils";
import "./libs";

// Midone Theme
import "./assets/sass/app.scss";



const app = createApp(App)
app.use(i18n);
app.use(store);
app.use(router);
app.use(VueReCaptcha, { siteKey: process.env.VUE_APP_RECAPTCHA_SITE_KEY });


app.config.performance = true;
app.config.devtools = true;
globalComponents(app);
utils(app);

app.mount("#app");
