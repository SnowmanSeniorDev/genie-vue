export const log = ({ next, to }) => {
  console.log("navigation data in log.js = ", to);
  return next();
}
