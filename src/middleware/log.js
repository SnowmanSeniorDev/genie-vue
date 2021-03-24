export const log = ({ next, to }) => {
  console.log(to.name);
  return next();
}
