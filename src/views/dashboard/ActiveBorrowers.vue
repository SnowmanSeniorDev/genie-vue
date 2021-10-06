<template>
  <div class="intro-y box p-5">
    <div class="flex items-center">
      <ListIcon class="w-6 h-6 mr-3" /><span class="text-lg">Active Borrower Companies</span>
    </div>
    <div class="report-timeline mt-5 relative" v-if="!loading">
      <div class="intro-x relative flex items-start pb-5" v-for="company in activeBorrowerCompanies" :key="company.companyId">
        <div class="w-6 h-6 shadow-lg flex-none image-fit rounded-full overflow-hidden bg-gray-500 ml-2"></div>
        <div class="px-5 ml-4 flex-1">
          <div class="items-center">
            <span class="font-bold">{{company.companyDisplayName}}</span>
            <div class="mt-2">{{company.descriptionAboutCompany}}</div>
          </div>
        </div>
        <hr />
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import {appAxios, sysAxios} from "@/plugins/axios";

export default {
  setup() {
    const store = useStore()
    const activeBorrowerCompanies = ref([]);
    const loading = ref(true);

    const init = async () => {
      const company_uuid = store.state.account.company_uuid;
      const companyIds = await appAxios.get(`/company/v1/${company_uuid}/dashboarddata`).then(res => {return res.data.funderCompanyDashBoard.activeBorrowerCompanyIds});
      await Promise.all(
        companyIds.map(companyId => {
          appAxios.get(`/company/v1/${companyId}`).then(res => activeBorrowerCompanies.value.push(res.data));
        })
      )
      return new Promise(resolve => resolve(activeBorrowerCompanies.value))
    }

    onMounted(async () => {
      await init()
      loading.value = false
    })

    return {
      loading,
      activeBorrowerCompanies
    }
  }
}
</script>