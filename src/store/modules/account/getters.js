/* ============
 * Getters for the auth module
 * ============
 *
 * The getters that are available on the
 * auth module.
 */

export default{
    getStep: state => state.step,
    getAccount: state => state.account,
    getCompanyId: state => state.company_uuid
};
