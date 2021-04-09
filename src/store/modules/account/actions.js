/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

import * as types from "./mutation-types";

export const setStep = ({commit}, payload) => {
	commit(types.SET_STEP, payload);
};

export default {
	setStep,
};