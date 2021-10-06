<template>
  <div>
    <div class="intro-y flex items-center mt-8">
      <h2 class="text-lg font-medium mr-auto">Update User</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="intro-y col-span-12 lg:col-span-6">
        <!-- BEGIN: Form Validation -->
        <div class="intro-y box">
          <div id="form-validation" class="p-5">
            <div class="preview">
              <!-- BEGIN: Validation Form -->
              <form class="validate-form" @submit.prevent="save">
                <div class="input-form">
                  <label for="validation-form-1" class="form-label w-full flex flex-col sm:flex-row">
                    First Name
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
                  </label>
                  <input
                    id="validation-form-1"
                    v-model.trim="validate.firstName.$model"
                    type="text"
                    name="firstName"
                    class="form-control"
                    :class="{ 'border-theme-6': validate.firstName.$error }"
                    placeholder="John Legend"
                  />
                  <template v-if="validate.firstName.$error">
                    <div
                      v-for="(error, index) in validate.firstName.$errors"
                      :key="index"
                      class="text-theme-6 mt-2"
                    >
                      {{ error.$message }}
                    </div>
                  </template>
                </div>
                <div class="input-form mt-3">
                  <label for="validation-form-2" class="form-label w-full flex flex-col sm:flex-row">
                    Last Name
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
                  </label>
                  <input
                    id="validation-form-2"
                    v-model.trim="validate.lastName.$model"
                    type="text"
                    name="lastName"
                    class="form-control"
                    :class="{ 'border-theme-6': validate.lastName.$error }"
                    placeholder="John Legend"
                  />
                  <template v-if="validate.lastName.$error">
                    <div
                      v-for="(error, index) in validate.lastName.$errors"
                      :key="index"
                      class="text-theme-6 mt-2"
                    >
                      {{ error.$message }}
                    </div>
                  </template>
                </div>
                <div class="input-form mt-3">
                  <label for="validation-form-3" class="form-label w-full flex flex-col sm:flex-row">
                    Email
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required, email address format</span>
                  </label>
                  <input
                    id="validation-form-3"
                    v-model.trim="validate.email.$model"
                    type="email"
                    name="email"
                    class="form-control"
                    :class="{ 'border-theme-6': validate.email.$error }"
                    placeholder="example@gmail.com"
                  />
                  <template v-if="validate.email.$error">
                    <div
                      v-for="(error, index) in validate.email.$errors"
                      :key="index"
                      class="text-theme-6 mt-2"
                    >
                      {{ error.$message }}
                    </div>
                  </template>
                </div>
                <div class="input-form mt-3">
                  <label for="validation-form-4" class="form-label w-full flex flex-col sm:flex-row">
                    Display Name
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
                  </label>
                  <input
                    id="validation-form-4"
                    v-model.trim="validate.displayName.$model"
                    type="text"
                    name="displayName"
                    class="form-control"
                    :class="{ 'border-theme-6': validate.displayName.$error }"
                    placeholder="example@gmail.com"
                  />
                  <template v-if="validate.displayName.$error">
                    <div
                      v-for="(error, index) in validate.displayName.$errors"
                      :key="index"
                      class="text-theme-6 mt-2"
                    >
                      {{ error.$message }}
                    </div>
                  </template>
                </div>
                <div v-if="selectedRoles" class="input-form mt-3">
                  <label for="validation-form-5" class="form-label w-full flex flex-col sm:flex-row">
                    User Role
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
                  </label>
                  <TailSelect 
                    v-model="selectedRoles"
                    :options="{
                      search: true,
                      descriptions: true,
                      hideSelected: true,
                      hideDisabled: true,
                      multiLimit: 15,
                      multiShowCount: false,
                      multiContainer: true,
                      classNames: 'w-full' 
                    }"
                    multiple
                    >
                    <option v-for="role in roles" :key="role.roleId" :value="role.roleId">{{role.roleName}}</option>
                  </TailSelect>
                </div>
                <button type="submit" class="btn btn-primary mt-5">Update User</button>
              </form>
              <!-- END: Validation Form -->
              <!-- BEGIN: Success Notification Content -->
              <div id="success-notification-content" class="toastify-content hidden flex">
                <CheckCircleIcon class="text-theme-9" />
                <div class="ml-4 mr-4">
                  <div class="font-medium">Update success!</div>
                  <div class="text-gray-600 mt-1">Please check your e-mail for further info!</div>
                </div>
              </div>
              <!-- END: Success Notification Content -->
              <!-- BEGIN: Failed Notification Content -->
              <div id="failed-notification-content" class="toastify-content hidden flex">
                <XCircleIcon class="text-theme-6" />
                <div class="ml-4 mr-4">
                  <div class="font-medium">Update failed!</div>
                  <div class="text-gray-600 mt-1">Please check the fileld form.</div>
                </div>
              </div>
              <!-- END: Failed Notification Content -->
            </div>
          </div>
        </div>
        <!-- END: Form Validation -->
      </div>
    </div>
    <div v-if="pageLoading" class="py-16">
      <div class="w-full h-8 px-8">
        <LoadingIcon icon="spinning-circles" color="gray" class="w-4 h-4 py-8" />
      </div>
    </div>
    <div v-else class="dark:border-dark-5">
      <div class="font-medium text-2xl">Company Information</div>
      <div class="grid grid-cols-12 gap-4 gap-y-5 mt-5" v-if="companyProfileReady">
        <div class="intro-y col-span-12 sm:col-span-6">
          <p>Company Display Name : {{companyProfile.companyDisplayName}}</p>
          <p>Company Legal Name : {{companyProfile.companyLegalName}}</p>
          <p>Registration No : {{companyProfile.registrationNo}}</p>
          <p>Tax Number : {{companyProfile.taxNumber}}</p>
          <p>Registered Address1 : {{companyProfile.addressLine1}}</p>
          <p>Registered Address2 : {{companyProfile.addressLine2}}</p>
          <p>Registered Address3 : {{companyProfile.addressLine3}}</p>
          <p>Description About Company: {{companyProfile.descriptionAboutCompany}}</p>
          <p>City : {{companyProfile.city}}</p>
          <p>State : {{companyProfile.state}}</p>
          <p>Country : {{companyProfile.country}}</p>
          <p>Phone : {{companyProfile.phone}}</p>
          <p>Primary Email : {{companyProfile.primaryEmail}}</p>
        </div>
      </div>
      <div class="font-medium text-2xl">Bank Information</div>
      <div v-for="(item, index) in bankInfos" :key="index" class="intro-y gap-4 border-b border-gray-500 py-4">
        <p>Bank Name : {{bankInfos[index].bankName}}</p>
        <p>Bank Branch Name : {{bankInfos[index].branchName}}</p>
        <p>Bank Account Number : {{bankInfos[index].address}}</p>
        <p>Bank Swift Code : {{bankInfos[index].swiftCode}}</p>
        <p>Bank Currency : {{bankInfos[index].currency}}</p>
      </div>
      <div class="font-medium text-2xl">Currency Information</div>
      <div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
        <div class="intro-y col-span-12">
          <table class="table table--lg">
            <thead>
              <tr class="bg-theme-2">
                <th class="dark:border-dark-5 whitespace-nowrap"> CURRENCY CODE </th>
                <th class="dark:border-dark-5 whitespace-nowrap"> CURRENCY NAME </th>
                <th class="dark:border-dark-5 whitespace-nowrap"> CURRENCY SYMBOL </th>
                <th class="dark:border-dark-5 whitespace-nowrap"> SUPPORT </th>
                <th class="dark:border-dark-5 whitespace-nowrap"> DEFAULT </th>
              </tr>
            </thead>
            <tbody>
              <tr class="odd:bg-gray-200" v-for="(currency, index) in currencies" :key="index">
                <td class="dark:border-dark-5">{{currency.currencyCode}}</td>
                <td class="dark:border-dark-5">{{currency.currencyName}}</td>
                <td class="dark:border-dark-5">{{currency.currencySymbol}}</td>
                <td class="dark:border-dark-5">
                  <input id="input-wizard-4-currency-eur"
                    v-model="support"
                    type="checkbox"
                    class="form-check-input"
                    :value="currency.currencyCode" disabled/>
                </td>
                <td class="dark:border-dark-5">
                  <input id="input-wizard-4-currency-eur-default"
                    v-model="defaultCurrency"
                    type="radio"
                    class="form-check-input"
                    name="default-currency"
                    :value="currency.currencyCode" readonly/>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="font-medium text-2xl">KYC Documents</div>
      <div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
        <div class="intro-y col-span-12">
          <table class="table table--lg">
            <thead>
              <tr class="bg-theme-2">
                <th class="dark:border-dark-5 whitespace-nowrap w-1/5"> DOCUMENT CATEGORY </th>
                <th class="dark:border-dark-5 whitespace-nowrap w-3/5"> STATUS </th>
              </tr>
            </thead>
            <tbody>
              <tr class="odd:bg-gray-200" v-for="(item, index) in docList" :key="index">
                <td class="dark:border-dark-5">{{item.category}}</td>
                <td class="dark:border-dark-5">
                  <div class="alert alert-warning-soft show flex items-center justify-center h-5 p-3 text-sm" role="alert">
                  <!-- <div class="alert show flex items-center h-5 p-3 text-sm justify-center text-blue-700 bg-blue-200" role="alert"> -->
                    {{item.status}}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
j
<script>
import { reactive, toRefs, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { sysAxios, appAxios } from "@/plugins/axios";
import { required, minLength, email } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import Toastify from "toastify-js";

export default {
  setup() {
    const route = useRoute();
    const roles = ref([]);
    // const selectedRoles = ref(["d286270d-6cb3-4d35-6eeb-08d8e37d3cba", "93cf00f1-0fb5-40a1-f68b-08d8e9b63a35", "661dfade-2b95-48b3-e4c3-08d8eab473f8"]);
    const selectedRoles = ref([]);
    const authorizationId = ref('');
    const formData = reactive({
      firstName: "",
      lastName: "",
      email: "",
      displayName: "",
    });
    const companyProfile = ref({
			companyDisplayName: '',
			companyLegalName: '',
			descriptionAboutCompany: '',
			registrationNo: '',
			taxNumber: '',
			addressLine1: '',
			addressLine2: '',
			addressLine3: '',
			city: '',
			state: '',
			country: null,
			phone: '',
			primaryEmail: '',
		});
    const bankInfos = ref([
			{
				bankName: '',
				branchName: '',
				address: '',
				accountNumber: '',
				swiftCode: '',
				currency: '',
			},
		]);
    const currencies = ref(null);
    const defaultCurrency = ref(null);
    const support = ref([]);
    const setDocIndex = ref();
    const docList = ref([]);
    const companyProfileReady = ref(false)
    const pageLoading = ref(true)
    
    const getCompanyProfile = async company_uuid => {
      const getCompanyInfo = `/company/v1/${company_uuid}`;
      const res = await appAxios.get(getCompanyInfo);
      companyProfile.value = {...res.data};
      companyProfileReady.value = true
      return new Promise(resolve => {
        resolve(res.data)
      })
    }

    const getBankInfo = async company_uuid => {
      const getBankInfo = `/company/v1/${company_uuid}/bankaccounts`;
      await appAxios.get(getBankInfo).then(res => {
				if(res.data.length !== 0) {
					bankInfos.value = [...res.data];
				}
			})
      return new Promise(resolve => {
        resolve('backInfo')
      })
    }

    const getCompanyCurrency = async company_uuid => {
      const companyProfileSystemConfig = 'configuration/v1/Company Profile';
      const getCompanyCurrencies = `/company/v1/${company_uuid}/currencies`;
      await sysAxios.get(companyProfileSystemConfig).then(res => {
				currencies.value = JSON.parse(_.find(res.data[0].configurations, {name: "currencies"}).value)
			})
      await appAxios.get(getCompanyCurrencies).then(res => {
        if(res.data.length) {
          res.data.forEach(item => {
            if(item.isDefault) defaultCurrency.value = item.currencyCode;
            support.value.push(item.currencyCode);
          });
          currencies.value = {...res.data, ...currencies.value}
        }
      })
      return new Promise(resolve => {
        resolve('get company currency')
      })
    }

    const getKycDocuments = async company_uuid => {
      const companyProfileSystemConfig = 'configuration/v1/Company Profile';
      const getCompanyCoporateInfoApi = `/company/v1/${company_uuid}/corporateinfo`;
      await sysAxios.get(companyProfileSystemConfig).then(res => {
        JSON.parse(_.find(res.data[0].configurations, {name: "kyc_dument_category"}).value).forEach(item => {
          docList.value.push({
            corporateInfoHeaderId: '',
            category: item,
            status: 'waiting for document upload',
          })
        })
      })
      await appAxios.get(getCompanyCoporateInfoApi).then(res => {
        for(let index in res.data){
          docList.value[_.findIndex(docList.value, {category: res.data[index].corporateInfoDocumentCategoryName})] = {
            corporateInfoHeaderId: res.data[index].corporateInfoHeaderId,
            category: res.data[index].corporateInfoDocumentCategoryName,
            status: res.data[index].approvalStatus
          }
        }
      })
    }

    onMounted(async () => {
      const authorizationApi = `access/v1/authorization/user/${route.params.id}`;
      sysAxios.get(authorizationApi).then(res => {
        authorizationId.value = res.data.authorizationId
        res.data.roles.forEach(role => {
          selectedRoles.value.push(role.roleId);
        });

        const rolesApi = "access/v1/role";
        sysAxios.get(rolesApi).then(res => {roles.value = res.data});
      })

      const userApi = "/user/v1/" + route.params.id;
      sysAxios.get(userApi).then((res) => {
        formData.firstName = res.data.firstName,
        formData.lastName = res.data.lastName,
        formData.displayName = res.data.displayName,
        formData.email = res.data.emailAddress
      })
      const company_uuid = await appAxios.get(`company/v1/user/${route.params.id}`).then(res => {
        if(res.status === 'error') return '00000000-0000-0000-0000-000000000000';
        else {
          companyProfileReady.value = true
          return res.data
        }
      })
      console.log('company_uuid = ', company_uuid)
      if(company_uuid !== '00000000-0000-0000-0000-000000000000') {
        await getCompanyProfile(company_uuid)
        await getBankInfo(company_uuid)
        await getCompanyCurrency(company_uuid)
        await getKycDocuments(company_uuid)
      }
      pageLoading.value = false
    })


    const rules = {
      firstName: { required, minLength: minLength(2) },
      lastName: { required, minLength: minLength(2)},
      email: { required, email },
      displayName: { required, minLength: minLength(6)},
    };

    const validate = useVuelidate(rules, toRefs(formData));
    const save = () => {
      validate.value.$touch();
      if (validate.value.$invalid) {
        Toastify({
          node: cash("#failed-notification-content").clone().removeClass("hidden")[0],
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true
        }).showToast();
      } else {
        const api = `/user/v1/${route.params.id}`;
        sysAxios.put(api, {
          emailAddress: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          displayName: formData.displayName
        }).then(res => {
          if(res.status === 200){
            const api = `access/v1/authorization/${authorizationId.value}`;
            sysAxios.put(api, {applicationDomain: "genie", roleIds: selectedRoles.value}).then(res => {
              if(res.status === 200){
                Toastify({
                  node: cash("#success-notification-content").clone().removeClass("hidden")[0],
                  duration: 3000,
                  newWindow: true,
                  close: true,
                  gravity: "top",
                  position: "right",
                  stopOnFocus: true
                }).showToast();
              }
            })
            
          }
        })
      }
    };

    return {
      validate,
      formData,
      save,
      selectedRoles,
      roles,
      companyProfile,
      pageLoading,
      companyProfileReady,
      bankInfos,
      currencies,
      defaultCurrency,
      support,
      docList
    };
  }
};
</script>
