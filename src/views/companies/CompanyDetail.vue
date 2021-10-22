<template>
  <div class="post intro-y overflow-hidden box mt-5">
    <div class="post__tabs nav nav-tabs flex-col sm:flex-row bg-gray-300 text-gray-600" role="tablist">
      <a
        id="company-info-tab"
        data-toggle="tab"
        data-target="#company-info"
        href="javascript:;"
        class="w-full sm:w-48 py-4 text-center flex justify-center items-center active"
        aria-selected="true"
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
    
    <div id="company-info" class="tab-pane p-5" :class="`${panel === 'company-info' ? 'block' : 'hidden'}`">
      <div class="border border-gray-200 rounded-md p-5">
        <div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
          <CompanyProfile v-if="company_uuid" :companyId="company_uuid" />
        </div>
      </div>
    </div>
    <div id="bank-info" class="tab-pane p-5" :class="`${panel === 'bank-info' ? 'block' : 'hidden'}`">
      <div class="border border-gray-200 rounded-md p-5">
        <CompanyBankInfo v-if="company_uuid" :companyId="company_uuid" />
      </div>
    </div>
    <div id="currency-settings" class="tab-pane p-5" :class="`${panel === 'currency-settings' ? 'block' : 'hidden'}`">
      <div class="border border-gray-200 rounded-md p-5">
        <CompanyCurrencySetting v-if="company_uuid" :companyId="company_uuid" />
      </div>
    </div>
    <div id="kyc-document" class="tab-pane p-5" :class="`${panel === 'kyc-document' ? 'block' : 'hidden'}`">
      <CompanyKycDocuments v-if="company_uuid" :companyId="company_uuid" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import CompanyProfile from '@/components/templates/CompanyProfile.vue'
import CompanyBankInfo from '@/components/templates/CompanyBankInfo.vue'
import CompanyCurrencySetting from '@/components/templates/CompanyCurrencySetting.vue'
import CompanyKycDocuments from '@/components/templates/CompanyKycDocument.vue'

export default {
  components: {
    CompanyProfile,
    CompanyBankInfo,
    CompanyCurrencySetting,
    CompanyKycDocuments
  },
  setup() {
    const route = useRoute()
    const panel = ref('company-info')
    const company_uuid = ref(route.params.companyId)
    return {
      panel,
      company_uuid
    }
  }
}
</script>
