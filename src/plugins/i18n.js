// import Vue from "vue";
import VueI18n from 'vue-i18n';
// import messages from '../locale';
const messages = {
  en: {
    message: {
      hello: 'hello world'
    }
  }
}

// Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'en',
  messages
});


export default i18n;