/* ============
 * State of the auth module
 * ============
 *
 * The initial state of the auth module.
 */

export default {
  step: "company-information",
  account: {
    companyDisplayName: "",
    companyLegalName: "",
    descriptionAboutCompany: "",
    registrationNo: "",
    taxNumber: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    primaryEmail: "",
    bankAccounts: []
  }
};
