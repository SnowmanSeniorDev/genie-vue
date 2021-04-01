import store from "@/store"

export const auth = ({ next, router, to }) => {
  if (!localStorage.getItem("id_token")) return router.push({ name: "login" });
  else {
    if(!store.state.main.permissions.some( permission => permission.permissionName == to.name)){
      return router.push({ name: "GENIE_ACCESS_DENIED" });
    }
  }
  return next();
}

export default {
	auth
};