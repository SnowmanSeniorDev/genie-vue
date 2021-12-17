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

// import Vue from "vue";
import axios from "axios";
import store from "@/store";

export const sysAxios = axios.create({
  baseURL: process.env.VUE_APP_DEV_SYSTEM_API_URL,
  // baseURL: process.env.VUE_APP_STG_SYSTEM_API_URL,
  headers: {
    common: {
      'Accept': 'application/json',
    }
  }
})

export const appAxios = axios.create({
  baseURL: process.env.VUE_APP_DEV_SERVICE_API_URL,
  // baseURL: process.env.VUE_APP_STG_SERVICE_API_URL,
  headers: {
    common: {
      'Accept': 'application/json',
    }
  }
})

sysAxios.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (localStorage.getItem('id_token') != null) {
      config.headers['Authorization'] = `Bearer ${localStorage.getItem('id_token')}`;
    }
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

sysAxios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401 || error.response.status === 403) {
      store.dispatch('auth/logout');
    }
    Promise.reject(error);
    return {status: 'error'}
  }
);

appAxios.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (localStorage.getItem('id_token') != null) {
      config.headers['Authorization'] = `Bearer ${localStorage.getItem('id_token')}`;
    }
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

appAxios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401 || error.response.status === 403) {
      store.dispatch('auth/logout');
    }

    Promise.reject(error);
    return {status: 'error', error: error}
  }
);
