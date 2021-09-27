<template>
  <div class="intro-y box p-5 mt-5">
    <h1 class="text-lg text-theme-1">Create Eco System</h1>
    <hr class="my-4 mt-2"/>
    <div class="grid grid-cols-3 gap-4 mt-4">
      <div>
        <label>Name: </label>
        <input type="text" v-model="ecoSystemBody.name" class="form-control" />
      </div>
      <div>
        <label>Buyer Company: </label>
        <select v-model="ecoSystemBody.buyerCompanyId" class="form-select">
          <option v-for="company in systemCompanies" :value="company.company_uuid" :key="company.company_uuid">{{company.companyDisplayName}}</option>
        </select>
      </div>
      <div>
        <label>Seller Company: </label>
        <select class="form-select" v-model="ecoSystemBody.sellerCompanyId">
          <option v-for="company in systemCompanies" :value="company.company_uuid" :key="company.company_uuid">
            {{company.companyDisplayName}}
          </option>
        </select>
      </div>
      <div>
        <label>Funder Company: </label>
        <select class="form-select" v-model="ecoSystemBody.funderCompanyId">
          <option v-for="company in funderCompanies" :value="company.company_uuid" :key="company.company_uuid">
            {{company.companyDisplayName}}
          </option>
        </select>
      </div>
      <div>
        <label>Seller Credit: </label>
        <input type="text" v-model="ecoSystemBody.sellerCredit" class="form-control" />
      </div>
      <div>
        <label>Buyer Credit: </label>
        <input type="text" v-model="ecoSystemBody.buyerCredit" class="form-control" />
      </div>
      <div>
        <label>Base Currency Code: </label>
        <select class="form-select" v-model="ecoSystemBody.baseCurrencyCode">
          <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
            {{currency.currencyCode}}
          </option>
        </select>
      </div>
      <div>
        <label>Interest Rate: </label>
        <input type="text" v-model="ecoSystemBody.interestRate" class="form-control" />
      </div>
      <div>
        <label>Interest Rate Duration: </label>
        <select v-model="ecoSystemBody.interestRateDuration" class="form-select">
          <option v-for="duration in interestRateDuration" :value="duration" :key="duration">
            {{duration}}
          </option>
        </select>
      </div>
      <div>
        <label>Expired Date: </label>
        <Litepicker
          v-model="ecoSystemBody.expiredDate"
          :options="{
            autoApply: false,
            showWeekNumbers: true,
            dropdowns: {
              minYear: 1990,
              maxYear: null,
              months: true,
              years: true
            },
          }"
          class="form-control"
        />
      </div>
      <div>
        <label>Buyer Led Workflow</label>
        <select v-model="ecoSystemBody.buyerLedWorkflowId" class="form-select">
          <!-- <option v-for=""></option> -->
        </select>
      </div>
      <div>
        <label>Seller Led Workflow</label>
        <select v-model="ecoSystemBody.sellerLedWorkflowId" class="form-select">
          <!-- <option v-for=""></option> -->
        </select>
      </div>
    </div>
    <hr class="my-8"/>
    <div class="flex justify-end">
      <button class="w-32 btn btn-primary">Submit</button>
    </div>
  </div>

  <div class="intro-y box p-5 mt-5">
    <h1 class="text-lg text-theme-1">Eco Systems</h1>
    <div id="tabulator" ref="tableRef" class="mt-5 table-report table-report--tabulator"></div>
  </div>
</template>

<script>
import {ref, onMounted} from "vue";
import {sysAxios, appAxios} from "@/plugins/axios";
import Tabulator from "tabulator-tables";
import feather from "feather-icons";

export default {
  setup() {
    const dateFormat = process.env.VUE_APP_DATE_FORMAT;
    const loading = ref(true)
    const ecoSystemBody = ref({
      name: "string",
      buyerCompanyName: "string",
      buyerCompanyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      sellerCompanyName: "string",
      sellerCompanyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      funderCompanyName: "string",
      funderCompanyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      sellerCredit: 0,
      buyerCredit: 0,
      interestRate: 0,
      interestRateDuration: "string",
      baseCurrencyCode: "string",
      expiredDate: new Date(),
      buyerLedWorkflowId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      sellerLedWorkflowId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    })
    const ecoSystems = ref([])
    const systemCompanies = ref([])
    const funderCompanies = ref([])
    const currencies = ref([])
    const interestRateDuration = ref([])
    const tableRef = ref();
    const tabulator = ref();

    const initTabulator = (data) => { 
      tabulator.value = new Tabulator(tableRef.value, {
        data: data,
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [5, 10, 20, 30, 40],
        layout: "fitColumns",
        responsiveLayout: "collapse",
        placeholder: "No matching records found",
        columns: [
          {
            title: "BATCH NO.",
            field: "a",
            minWidth: 50,
            maxWidth: 150,
            resizable: false,
          }, {
            title: "BUYER",
            field: "b",
            headerHozAlign: 'center',
            hozAlign: "center",
            resizable: true,
          }
        ],
        renderComplete() {
          feather.replace({
            "stroke-width": 1.5
          });
        }
      });
    };

    // Redraw table onresize
    const reInitOnResizeWindow = () => {
      window.addEventListener("resize", () => {
        tabulator.value.redraw();
        feather.replace({
          "stroke-width": 1.5
        });
      });
    };

    const init = async () => {
      const getEcoSystems = 'company/v1/ecosystems'
      const companyProfileSystemConfig = 'configuration/v1/Company Profile'
      const genieSystemConfigure = 'configuration/v1/Genie Global Settings'
      const getSystemCompaniesApi = 'company/v1'
      await appAxios.get(getEcoSystems).then(res => {
        ecoSystems.value = res.data
      })
      await sysAxios.get(companyProfileSystemConfig).then(res => {
        currencies.value = JSON.parse(_.find(res.data[0].configurations, {name: "currencies"}).value)
      })
      await sysAxios.get(genieSystemConfigure).then(res => {
        interestRateDuration.value = JSON.parse(_.find(res.data[0].configurations, {name: "Interest Rate Duration"}).value)
      })
      await appAxios.get(`${getSystemCompaniesApi}?type=Company`).then(res => {
        systemCompanies.value = [...res.data]
      })
      await appAxios.get(`${getSystemCompaniesApi}?type=Funder`).then(res => {
        funderCompanies.value = [...res.data]
      })

      loading.value = false
      initTabulator(ecoSystems.value)

      return new Promise(resolve => {
        resolve(loading.value)
      })
    }
    
    onMounted(async () => {
      await init()
      reInitOnResizeWindow();
    })
    return {
      loading,
      dateFormat,
      tableRef,
      currencies,
      interestRateDuration,
      systemCompanies,
      funderCompanies,
      ecoSystemBody
    }
  },
}
</script>
