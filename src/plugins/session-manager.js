import Router from "../router/index";
import Store from "../store/index";
export const initSession = () => {
  return new Promise(() => {
    let token = localStorage.getItem('id_token');
    if(token) {
      Store.commit('auth/CHECK', {token: token})
    }
    else Router.push('/login')
  })
}