import store from "@/store"

export const auth = ({ next, router, to }) => {
  if (!localStorage.getItem("id_token")) {
    return router.push({ name: "login" });
  }
  else {
    console.log(to.meta.permission)
    console.log(store.state.main.permissions)
    // if(!store.state.main.permissions.some( permission => permission.permissionName == to.meta.permission)){
    //   return router.push({ name: "GENIE_ACCESS_DENIED" });
    // }
  }
  return next();
}

export default {
	auth
};