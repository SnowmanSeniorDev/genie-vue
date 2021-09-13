<template>
  <div v-if="!loading && cardsData.companyDashBoard" class="col-span-12 intro-y w-100">
    <div class="grid grid-cols-4 gap-6">
      <div class="report-box zoom-in">
        <div class="box p-5">
          <div class="flex">
            <div class="w-full">
              <div class="text-2xl font-bold leading-8">Financing Funded</div>
              <div class="ml-auto">Count: {{cardsData.companyDashBoard.historicalRelationship.funded.count}}</div>
              <div class="text-base text-gray-600 mt-1">Total Amount: {{cardsData.currencyCode}} {{cardsData.companyDashBoard.historicalRelationship.funded.totalAmount}}</div>
            </div>
            <div class="flex justify-end items-center">
              <ShoppingCartIcon class="report-box__icon text-theme-10" />
            </div>
          </div>
        </div>
      </div>
      <div class="report-box zoom-in">
        <div class="box p-5">
          <div class="flex">
            <div class="w-full">
              <div class="text-2xl font-bold leading-8">Financing Requested</div>
              <div class="ml-auto">Count: {{cardsData.companyDashBoard.historicalRelationship.finacingRequested.count}}</div>
              <div class="text-base text-gray-600 mt-1">Total Amount: {{cardsData.currencyCode}} {{cardsData.companyDashBoard.historicalRelationship.finacingRequested.totalAmount}}</div>
            </div>
            <div class="flex justify-end items-center">
              <ShoppingCartIcon class="report-box__icon text-theme-10" />
            </div>
          </div>
        </div>
      </div>
      <div class="report-box zoom-in">
        <div class="box p-5">
          <div class="flex">
            <div class="w-full">
              <div class="text-2xl font-bold leading-8">Line Information</div>
              <div class="ml-auto">Available Limite: {{cardsData.currencyCode}} {{cardsData.companyDashBoard.lineInformation.availableLimit}}</div>
              <div class="text-base text-gray-600 mt-1">Overall Limite: {{cardsData.currencyCode}} {{cardsData.companyDashBoard.lineInformation.overallLimit}}</div>
              <div class="text-base text-gray-600 mt-1">Utilised Amount: {{cardsData.currencyCode}} {{cardsData.companyDashBoard.lineInformation.utilisedAmount}}</div>
            </div>
            <div class="flex justify-end items-center">
              <ShoppingCartIcon class="report-box__icon text-theme-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="!loading && cardsData.funderCompanyDashBoard" class="col-span-12 intro-y w-100">
    <div class="grid grid-cols-4 gap-6">
      <div class="report-box zoom-in">
        <div class="box p-5">
          <div class="flex">
            <div class="w-full">
              <div class="text-2xl font-bold leading-8">LINE INFORMATION</div>
              <div class="ml-auto">Available Limite: {{cardsData.currencyCode}} {{cardsData.funderCompanyDashBoard.availableLimit}}</div>
              <div class="ml-auto">Funded Amoun: {{cardsData.currencyCode}} {{cardsData.funderCompanyDashBoard.fundedAmount}}</div>
              <div class="ml-auto">Total Allocated Amount: {{cardsData.currencyCode}} {{cardsData.funderCompanyDashBoard.totalAllocatedLimit}}</div>
            </div>
            <div class="flex justify-end items-center">
              <ShoppingCartIcon class="report-box__icon text-theme-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { sysAxios, appAxios } from "@/plugins/axios";
export default {
  setup() {
    const store = useStore();
    const company_uuid = store.state.account.company_uuid;
    const loading = ref(true);
    const cardsData = ref({});
    
    const init = async () => {
      cardsData.value = await appAxios.get(`/company/v1/${company_uuid}/dashboarddata`).then(res => {return res.data});
      return new Promise(resolve => resolve(cardsData.value));
    }

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
