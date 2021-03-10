/* ============
 * Axios
 * ============
 *
 * Promise based HTTP client for the browser and node.js.
 * Because Vue Resource has been retired, Axios will now been used
 * to perform AJAX-requests.
 *
 * https://github.com/mzabriskie/axios
 */

import Vue from "vue";
import axios from "axios";
import store from "@/store";



axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
axios.defaults.headers.common.Accept = 'application/json';

const token = localStorage.getItem('id_token');
if (token) {
  axios.defaults.headers.common['Authorization'] = "Bearer " + token;
}

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      store.dispatch('auth/logout');
    }

    return Promise.reject(error);
  }
);

axios.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (localStorage.getItem('id_token') != null) {
      Vue.$http.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('id_token')}`;
    }
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default axios