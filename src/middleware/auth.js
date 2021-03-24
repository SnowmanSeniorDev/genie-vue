export const auth = ({ next, router }) => {
  if (!localStorage.getItem("id_token")) {
    return router.push({ name: "login" });
  }

  return next();
}

export default {
	auth
};