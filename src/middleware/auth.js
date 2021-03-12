export const auth = ({ next, router }) => {
  console.log(localStorage.getItem("id_token"))
  if (!localStorage.getItem("id_token")) {
    return router.push({ name: "login" });
  }

  return next();
}

export default {
	auth
};