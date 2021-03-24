/* ============
 * Getters for the auth module
 * ============
 *
 * The getters that are available on the
 * auth module.
 */

//export default {
  export default{
    getToken: state => state.token,
    getUserRole: state => state.userRole,
    getMyProfile: state => state.profile,
    getUserId: state => state.getUserId
};
