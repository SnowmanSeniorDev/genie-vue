<template>
  <div class="intro-y col-span-12 mt-5">
    <div class="intro-y box p-8 pt-3">
      <h2 class="text-lg font-medium mr-auto">Company Onboard</h2>
      <form class="validate-form pt-6 grid grid-cols-7 gap-4" @submit.prevent="invite">
        <div class="input-form col-span-3">
          <label for="vender-code" class="form-label w-full flex flex-col sm:flex-row">
            Company Display Name
            <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
          </label>
          <input type="text" v-model="inviteNewPayload.parameters[0].value" class="form-control" placeholder="company display name"/>
        </div>
        <div class="input-form col-span-3">
          <label for="seller-email" class="form-label w-full flex flex-col sm:flex-row">
            Company's Email
            <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
          </label>
          <input type="email" v-model="inviteNewPayload.to" class="form-control" placeholder="seller@email.com"/>
        </div>
        <div class="col-span-1 items-end flex">
          <button class="btn btn-primary w-full mx-5" @click="inviteNewCompany">Invite</button>
        </div>
      </form>
    </div>

    <div class="intro-y col-span-12 mt-10 box p-3">
      <p class="text-2xl">Onboared Companies</p>
      <table class="table table--lg border-l border-r">
        <thead>
          <tr class="bg-gray-400">
            <th class="dark:border-dark-5 whitespace-nowrap w-2/7"> COMPANY NAME </th>
            <th class="dark:border-dark-5 whitespace-nowrap w-1/7"> COMPANY CODE </th>
            <th class="dark:border-dark-5 whitespace-nowrap w-1/7"> CREDIT LIMIT </th>
            <th class="dark:border-dark-5 whitespace-nowrap w-1/7"> START DATE </th>
            <th class="dark:border-dark-5 whitespace-nowrap w-1/7"> END DATE </th>
            <th class="dark:border-dark-5 whitespace-nowrap w-1/7"> STATUS </th>
            <th class="dark:border-dark-5 whitespace-nowrap w-1/7 text-center"> ACTIONS </th>
          </tr>
        </thead>
        <tbody v-if="!loading">
          <tr class="odd:bg-gray-200" v-for="company in onboardedCompanies" :key="company.relationshipId">
            <td class="dark:border-dark-5">{{company.companyDisplayName}}</td>
            <td class="dark:border-dark-5">{{company.registrationNo}}</td>
            <td class="dark:border-dark-5">{{company.creditLimit}}</td>
            <td class="dark:border-dark-5">{{moment(company.startDate).format(dateFormat)}}</td>
            <td class="dark:border-dark-5">{{moment(company.endDate).format(dateFormat)}}</td>
            <td class="dark:border-dark-5">
              <div
                :class="`alert show flex items-center h-5 p-3 text-sm justify-center text-green-700 bg-green-200
                ${company.approvalStatus == 'Approved' ? 'text-green-700 bg-green-200' : 'text-green-700 bg-green-200'}`"

                role="alert">
                {{company.approvalStatus}}
              </div>
            </td>
            <td class="dark:border-dark-5 flex justify-center">
              <button class="btn btn-outline-primary w-24 inline-block" v-if="company.approvalStatus != 'Approved'"> Reinvite </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="intro-y col-span-12 mt-10 box p-3">
      <p class="text-2xl">Available Companies</p>
      <table class="table table--lg border-l border-r">
        <thead>
          <tr class="bg-gray-400">
            <th class="dark:border-dark-5 whitespace-nowrap w-2/7"> COMPANY NAME </th>
            <th class="dark:border-dark-5 whitespace-nowrap w-1/7"> COMPANY CODE </th>
            <th class="dark:border-dark-5 whitespace-nowrap w-1/7"> EMAIL </th>
            <th class="dark:border-dark-5 whitespace-nowrap w-1/7"> DISPLAY NAME </th>
            <th class="dark:border-dark-5 whitespace-nowrap w-1/7"> ADDRESS </th>
            <th class="dark:border-dark-5 whitespace-nowrap w-1/7 text-center"> ACTIONS </th>
          </tr>
        </thead>
        <tbody v-if="!loading">
          <tr class="odd:bg-gray-200" v-for="company in availableCompanies" :key="company.companyId">
            <td class="dark:border-dark-5">{{company.companyDisplayName}}</td>
            <td class="dark:border-dark-5">{{company.registrationNo}}</td>
            <td class="dark:border-dark-5">{{company.primaryEmail}}</td>
            <td class="dark:border-dark-5">{{company.displayName}}</td>
            <td class="dark:border-dark-5">
              <div class="alert show flex items-center h-5 p-3 text-sm justify-center text-yellow-700 bg-yellow-200" role="alert">
                Pending
              </div>
            </td>
            <td class="dark:border-dark-5 flex justify-center">
              <button @click="openCompanyInviteModal(company)" class="btn btn-primary w-24 inline-block"> Invite </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div id="invite-company-modal" class="modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- BEGIN: Modal Header -->
          <div class="modal-header">
            <h2 class="font-medium text-base mr-auto"> Invite Company </h2>
          </div>
          <!-- END: Modal Header -->
          <div class="modal-body mx-8">
            <div class="grid grid-cols-2 grid-flow-row gap-4">
              <div class="self-center">Currency Code</div>
              <div class="self-center">
                <select v-model="invitePayload.currencyCode" class="form-select">
                  <option v-for="(currency, currency_index) in currencies" :key="currency_index">
                    {{currency.currencyCode}}
                  </option>
                </select>
              </div>
              <div class="self-center">Credit Limite</div>
              <div class="self-center">
                <input type="number" v-model="invitePayload.creditLimit" class="form-control"/>
              </div>
              <div class="self-center">End Date</div>
              <div class="self-center">
                <Litepicker
                  v-model="invitePayload.endDate"
                  :options="{
                    autoApply: false,
                    showWeekNumbers: true,
                    zIndex: 10001,
                    dropdowns: {
                      minYear: 1990,
                      maxYear: null,
                      months: true,
                      years: true
                    }
                  }"
                  class="form-control"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer text-right">
            <button type="button" class="btn btn-primary w-24 mr-1" @click="inviteCompany" :disabled="modalLoading">
              Invite
              <LoadingIcon v-if="modalLoading" icon="oval" color="white" class="w-4 h-4 ml-2" />
            </button>
            <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-24"> Cancel </button>
          </div> <!-- END: Modal Footer -->
        </div>
      </div>
    </div>
    <div id="success-notification-content" class="toastify-content hidden">
      <div class="flex">
        <CheckCircleIcon class="text-theme-9" />
        <div class="ml-4 mr-4">
          <div class="font-medium">Invite success!</div>
          <div class="text-gray-600 mt-1">Successfully invited the company</div>
        </div>
      </div>
    </div>
    <div id="success-email-notification-content" class="toastify-content hidden">
      <div class="flex">
        <CheckCircleIcon class="text-theme-9" />
        <div class="ml-4 mr-4">
          <div class="font-medium">Invite success!</div>
          <div class="text-gray-600 mt-1">Successfully invited the company</div>
        </div>
      </div>
    </div>
    <div id="failed-notification-content" class="toastify-content hidden">
      <div class="flex">
        <XCircleIcon class="text-theme-6" />
        <div class="ml-4 mr-4">
          <div class="font-medium">Upload failed!</div>
          <div class="text-gray-600 mt-1" id="error-content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { appAxios, sysAxios } from "@/plugins/axios";
import { useStore } from "vuex";
import _ from "lodash";
import moment from "moment";
import Toastify from "toastify-js";

export default {
  setup() {
    const store = useStore();
    const invitePayload = ref({
      companyId: '',
      currencyCode: '',
      creditLimit: 1000,
      endDate: new Date(),
      approvalStatus: 'Pending'
    });
    const inviteNewPayload = ref({
      emailTemplateId: "",
      to: "",
      cc: "string",
      subject: "string",
      parameters: [
        {
          name: "company_name",
          value: ""
        }
      ],
      whenToSend: new Date(),
      onCompleteEventHandler: null
    })
    const emailTemplate = ref("");
    const currencies = ref([]);
    const onboardedCompanies = ref([]);
    const availableCompanies = ref([]);
    const loading = ref(true);
    const modalLoading = ref(false);
    const dateFormat = process.env.VUE_APP_DATETIME_FORMAT;
    const endDate = new Date();

    const openCompanyInviteModal = (company) => {
      invitePayload.value.companyId = company.companyId
      cash("#invite-company-modal").modal("show")
    }

    const inviteCompany = async () => {
      modalLoading.value = true
      console.log(invitePayload.value)
      const api = `/company/v1/${store.state.account.company_uuid}/relationships`
      const inviteResponse = await appAxios.post(api, {
        ...invitePayload.value,
        endDate: new Date(invitePayload.value.endDate),
        creditLimit: parseInt(invitePayload.value.creditLimit)
      });
      if(inviteResponse.status == 201) {
        modalLoading.value = false;
        cash("#invite-company-modal").modal("hide")
        Toastify({
          node: cash("#success-notification-content").clone().removeClass("hidden")[0],
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true
        }).showToast();
      } else {
        modalLoading.value = false;
        cash("#error-content").text(inviteResponse.error.response.data)
        Toastify({
          node: cash("#failed-notification-content").clone().removeClass("hidden")[0],
          duration: 5000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "center",
          stopOnFocus: true,
        }).showToast();
      }
    }

    const inviteNewCompany = async () => {
      console.log("inviteNewPayload = ", inviteNewPayload.value)
      const api = 'communications/v1/email/templates/render'
      sysAxios.post(api, inviteNewPayload.value).then(res => {
        if(res.status == 200) {
          inviteNewPayload.value.parameters[0].value = ""
          inviteNewPayload.value.to = ""
          Toastify({
            node: cash("#success-email-notification-content").clone().removeClass("hidden")[0],
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

    const getConfig = async () => {
      const companyProfileSystemConfig = 'configuration/v1/Company Profile'
      const genieGlobalSystemConfig = 'configuration/v1/Genie Global Settings'

      await sysAxios.get(companyProfileSystemConfig).then(res => {
				currencies.value = JSON.parse(_.find(res.data[0].configurations, {name: "currencies"}).value)
        invitePayload.value.currencyCode = 'SGD'
			})
      await sysAxios.get(genieGlobalSystemConfig).then(res => {
        emailTemplate.value = JSON.parse(_.find(res.data[0].configurations, {name: 'Platform Registration Invitation'}).value)
        console.log("emailTemplate.value = ", emailTemplate.value)
        inviteNewPayload.value.emailTemplateId = emailTemplate.value.emailTemplateId
        inviteNewPayload.value.subject = emailTemplate.value.subject
        inviteNewPayload.value.cc = emailTemplate.value.cc
      })

      return new Promise(resolve => {resolve("configuration was done")});
    }

    const init = async () => {
      const onboardedCompanyApi = `/company/v1/${store.state.account.company_uuid}/relationships`
      const companiesApi = '/company/v1/'
      
      onboardedCompanies.value = await appAxios.get(onboardedCompanyApi).then(res => {return res.data})
      availableCompanies.value = await appAxios.get(companiesApi, {type: 'company'}).then(res => {
        const companies  = []
        res.data.map(company => {
          const index = _.findIndex(onboardedCompanies.value, {companyId: company.companyId})
          if(index != -1){
            onboardedCompanies.value[index] = {...onboardedCompanies.value[index], ...company}
          } else companies.push(company)
        })
        return companies;
      })
      
      return new Promise(resolve => {resolve("component initialize was done")})
    }

    onMounted( async () => {
      await getConfig();
      await init();
      loading.value = false;
    })
    
    return {
      onboardedCompanies,
      availableCompanies,
      currencies,
      loading,
      modalLoading,
      endDate,
      dateFormat,
      moment,
      openCompanyInviteModal,
      invitePayload,
      inviteNewPayload,
      inviteCompany,
      inviteNewCompany
    }
  }
}
</script>
