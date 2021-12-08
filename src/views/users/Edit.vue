<template>
  <div class="post intro-y overflow-hidden box mt-5">
    <div class="post__tabs nav nav-tabs flex-col sm:flex-row bg-gray-300 text-gray-600" role="tablist">
      <a
        id="user-tab"
        data-toggle="tab"
        data-target="#user"
        href="javascript:;"
        class="w-full sm:w-40 py-4 text-center flex justify-center items-center active"
        aria-selected="true"
        @click="(e) => {
          e.preventDefault()
          panel = 'user'
        }"
      >
        <UserIcon class="w-4 h-4 mr-2" /> User Data
      </a>
      <a
        id="company-info-tab"
        data-toggle="tab"
        data-target="#company-info"
        href="javascript:;"
        class="w-full sm:w-48 py-4 text-center flex justify-center items-center"
        aria-selected="false"
        @click="(e) => {
          e.preventDefault()
          panel = 'company-info'
        }"
      >
        <HomeIcon class="w-4 h-4 mr-2" /> Company Information
      </a>
      <a
        id="bank-info-tab"
        data-toggle="tab"
        data-target="#bank-info"
        href="javascript:;"
        class="w-full sm:w-40 py-4 text-center flex justify-center items-center"
        aria-selected="false"
        @click="(e) => {
          e.preventDefault()
          panel = 'bank-info'
        }"
      >
        <ApertureIcon class="w-4 h-4 mr-2" /> Bank Information
      </a>
      <a
        id="currency-settings-tab"
        data-toggle="tab"
        data-target="#currency-settings"
        href="javascript:;"
        class="w-full sm:w-40 py-4 text-center flex justify-center items-center"
        aria-selected="false"
        @click="(e) => {
          e.preventDefault()
          panel = 'currency-settings'
        }"
      >
        <DollarSignIcon class="w-4 h-4 mr-2" /> Currency Settings
      </a>
      <a
        id="kyc-document-tab"
        data-toggle="tab"
        data-target="#kyc-document"
        href="javascript:;"
        class="w-full sm:w-40 py-4 text-center flex justify-center items-center"
        aria-selected="false"
        @click="(e) => {
          e.preventDefault()
          panel = 'kyc-document'
        }"
      >
        <PaperclipIcon class="w-4 h-4 mr-2" /> KYC Documents
      </a>
    </div>
    
    <div id="user" class="tab-pane p-5" :class="`${panel === 'user' ? 'block' : 'hidden'}`">
      <div class="border border-gray-200 rounded-md p-5">
        <div id="form-validation" class="p-5">
          <div class="preview">
            <!-- BEGIN: Validation Form -->
            <form class="validate-form" @submit.prevent="saveUserData">
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
    </div>
    <div id="company-info" class="tab-pane p-5" :class="`${panel === 'company-info' ? 'block' : 'hidden'}`">
      <div class="border border-gray-200 rounded-md p-5">
        <div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
          <userComapnyProfile v-if="user_company_uuid" :companyId="user_company_uuid" />
        </div>
      </div>
    </div>
    <div id="bank-info" class="tab-pane p-5" :class="`${panel === 'bank-info' ? 'block' : 'hidden'}`">
      <div class="border border-gray-200 rounded-md p-5">
        <userBankInfo v-if="user_company_uuid" :companyId="user_company_uuid" />
      </div>
    </div>
    <div id="currency-settings" class="tab-pane p-5" :class="`${panel === 'currency-settings' ? 'block' : 'hidden'}`">
      <div class="border border-gray-200 rounded-md p-5">
        <userCurrencySetting v-if="user_company_uuid" :companyId="user_company_uuid" />
      </div>
    </div>
    <div id="kyc-document" class="tab-pane p-5" :class="`${panel === 'kyc-document' ? 'block' : 'hidden'}`">
      <userKycDocuments v-if="user_company_uuid" :companyId="user_company_uuid" />
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { sysAxios, appAxios } from '@/plugins/axios'
import { required, minLength, email } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import Toastify from 'toastify-js'
import userComapnyProfile from '@/components/templates/CompanyProfile.vue'
import userBankInfo from '@/components/templates/CompanyBankInfo.vue'
import userCurrencySetting from '@/components/templates/CompanyCurrencySetting.vue'
import userKycDocuments from '@/components/templates/CompanyKycDocument.vue'

export default {
  components: {
    userComapnyProfile, userBankInfo, userCurrencySetting, userKycDocuments
  },
  setup() {
    const route = useRoute()
    const roles = ref([])
    const selectedRoles = ref([])
    const authorizationId = ref('')
    const panel = ref('user')
    const formData = reactive({
      firstName: "",
      lastName: "",
      email: "",
      displayName: "",
    })
    const user_company_uuid = ref('')

    const rules = {
      firstName: { required, minLength: minLength(2) },
      lastName: { required, minLength: minLength(2)},
      email: { required, email },
      displayName: { required, minLength: minLength(6)},
    }

    const validate = useVuelidate(rules, toRefs(formData))
    
    const saveUserData = () => {
      validate.value.$touch()
      if (validate.value.$invalid) {
        Toastify({
          node: cash("#failed-notification-content").clone().removeClass("hidden")[0],
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true
        }).showToast()
      } else {
        const api = `/user/v1/${route.params.id}`
        sysAxios.put(api, {
          emailAddress: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          displayName: formData.displayName
        }).then(res => {
          if(res.status === 200){
            const api = `access/v1/authorization/${authorizationId.value}`
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
                }).showToast()
              }
            })
            
          }
        })
      }
    }

    onMounted(async () => {
      const authorizationApi = `access/v1/authorization/user/${route.params.id}`
      sysAxios.get(authorizationApi).then(res => {
        authorizationId.value = res.data.authorizationId
        res.data.roles.forEach(role => {
          selectedRoles.value.push(role.roleId)
        })

        const rolesApi = "access/v1/role"
        sysAxios.get(rolesApi).then(res => {roles.value = res.data})
      })

      const userApi = "/user/v1/" + route.params.id
      sysAxios.get(userApi).then((res) => {
        formData.firstName = res.data.firstName,
        formData.lastName = res.data.lastName,
        formData.displayName = res.data.displayName,
        formData.email = res.data.emailAddress
      })
      const company_uuid = await appAxios.get(`company/v1/user/${route.params.id}`).then(res => {
        if(res.status === 'error') return '00000000-0000-0000-0000-000000000000'
        else return res.data
      })
      if(company_uuid !== '00000000-0000-0000-0000-000000000000') {
        user_company_uuid.value = company_uuid
      }
    })


    return {
      validate,
      formData,
      saveUserData,
      selectedRoles,
      roles,
      user_company_uuid,
      panel,
    }
  }
}
</script>
