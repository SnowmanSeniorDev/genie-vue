export const auth = ({ next, router }) => {
  if (!localStorage.getItem("jwt")) {
    return router.push({ name: "login" });
  }

  return next();
}

export default {
	auth
};