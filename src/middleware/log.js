export const log = ({ next, to }) => {
  console.log(localStorage.getItem("id_token"))
  
  console.log(to.name);

  return next();
}
