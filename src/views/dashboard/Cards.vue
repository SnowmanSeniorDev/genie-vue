<template>
  <div v-if='!loading && cardsData?.funderCompanyDashBoard' class='col-span-12 intro-y w-100'>
    <div class='grid grid-cols-4 gap-6'>
      <div class='report-box zoom-in'>
        <div class='box p-5'>
          <div class='flex'>
            <div class='w-full'>
              <div class='text-2xl font-bold leading-8'>LINE INFORMATION</div>
              <div class='ml-auto'>Available Limit: {{cardsData.currencyCode}} {{cardsData?.funderCompanyDashBoard.availableLimit}}</div>
              <div class='ml-auto'>Funded Amount: {{cardsData.currencyCode}} {{cardsData?.funderCompanyDashBoard.fundedAmount}}</div>
              <div class='ml-auto'>Total Allocated Amount: {{cardsData.currencyCode}} {{cardsData?.funderCompanyDashBoard.totalAllocatedLimit}}</div>
            </div>
            <div class='flex justify-end items-center'>
              <ShoppingCartIcon class='report-box__icon text-theme-10' />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if='!loading && cardsData?.companyDashBoard' class='col-span-12 intro-y w-100'>
    <div class='grid grid-cols-3 gap-6'>
      <div class='report-box zoom-in'>
        <div class='box p-5'>
          <div class='flex'>
            <div class='w-full'>
              <div class='text-2xl font-bold leading-8'>LINE INFORMATION</div>
              <div class='ml-auto'>Available Limit: {{cardsData.currencyCode}} {{cardsData?.companyDashBoard.lineInformation.availableLimit}}</div>
              <div class='ml-auto'>Outstanding Amount For Disbursement: {{cardsData.currencyCode}} {{cardsData?.companyDashBoard.lineInformation.outstandingForDisbursementAmount}}</div>
              <div class='ml-auto'>Utilized Amount: {{cardsData.currencyCode}} {{cardsData?.companyDashBoard.lineInformation.utilisedAmount}}</div>
              <div class='ml-auto'>Overall Limit: {{cardsData.currencyCode}} {{cardsData?.companyDashBoard.lineInformation.overallLimit}}</div>
            </div>
            <div class='flex justify-end items-center'>
              <ShoppingCartIcon class='report-box__icon text-theme-10' />
            </div>
          </div>
        </div>
      </div>
      <div class='report-box zoom-in'>
        <div class='box p-5'>
          <div class='flex'>
            <div class='w-full'>
              <div class='text-2xl font-bold leading-8'>Financing Funded</div>
              <div class='ml-auto'>Count: {{cardsData?.companyDashBoard.historicalRelationship.funded.count}}</div>
              <div class='text-base text-gray-600 mt-1'>Total Amount: {{cardsData.currencyCode}} {{$h.formatCurrency(cardsData?.companyDashBoard.historicalRelationship.funded.totalAmount)}}</div>
            </div>
            <div class='flex justify-end items-center'>
              <ShoppingCartIcon class='report-box__icon text-theme-10' />
            </div>
          </div>
        </div>
      </div>
      <div class='report-box zoom-in'>
        <div class='box p-5'>
          <div class='flex'>
            <div class='w-full'>
              <div class='text-2xl font-bold leading-8'>Financing Requested</div>
              <div class='ml-auto'>Count: {{cardsData?.companyDashBoard.historicalRelationship.finacingRequested.count}}</div>
              <div class='text-base text-gray-600 mt-1'>Total Amount: {{cardsData.currencyCode}} {{$h.formatCurrency(cardsData?.companyDashBoard.historicalRelationship.finacingRequested.totalAmount)}}</div>
            </div>
            <div class='flex justify-end items-center'>
              <ShoppingCartIcon class='report-box__icon text-theme-10' />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { ref, onMounted, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { appAxios } from '@/plugins/axios'

export default {
  setup() {
    const store = useStore()
    const defaultEcosystemId = ref(store.state.main.defaultEcosystem.ecosystemId)
    const company_uuid = store.state.account.company_uuid
    const loading = ref(true)
    const cardsData = ref()


    const init = async () => {
      let api = ''
      if(defaultEcosystemId.value === '00000000-0000-0000-0000-000000000000')api = `/company/v1/${company_uuid}/dashboarddata`
      else api = `/company/v1/ecosystem/${defaultEcosystemId.value}/${company_uuid}/dashboarddata`
      cardsData.value = await appAxios.get(api).then(res => res.data)
      return new Promise(resolve => resolve(cardsData.value));
    }

    watchEffect(() => {
      if(store.state.main.defaultEcosystem.ecosystemId !== defaultEcosystemId.value) {
        defaultEcosystemId.value = store.state.main.defaultEcosystem.ecosystemId
        init()
      }
    })

    onMounted(async () => {
      await init();
      loading.value = false
    })

    return {
      loading,
      cardsData
    }
  }
}
</script>
