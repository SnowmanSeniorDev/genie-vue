<template>
  <div class="intro-y box p-5 mt-5">
    <h1 class="text-lg text-theme-1">Create Eco System</h1>
    <hr class="my-4 mt-2"/>
    <div class="grid grid-cols-3 gap-4 mt-4">
      <div>
        <label>Name: </label>
        <input type="text" v-model="ecoSystemBody.name" class="form-control" />
        <template v-if="$v.name.$error">
          <div v-for="(error, index) in $v.name.$errors" :key="index" class="text-theme-6 mt-2">
            {{ error.$message }}
          </div>
        </template>        
      </div>
      <div>
        <label>Buyer Company: </label>
        <select v-model="ecoSystemBody.buyerCompanyId" class="form-select">
          <option v-for="company in systemCompanies" :value="company.companyId" :key="company.companyId">{{company.companyDisplayName}}</option>
        </select>
        <template v-if="$v.buyerCompanyId.$error">
          <div v-for="(error, index) in $v.buyerCompanyId.$errors" :key="index" class="text-theme-6 mt-2">
            {{ error.$message }}
          </div>
        </template>  
      </div>
      <div>
        <label>Seller Company: </label>
        <select class="form-select" v-model="ecoSystemBody.sellerCompanyId">
          <option v-for="company in systemCompanies" :value="company.companyId" :key="company.companyId">
            {{company.companyDisplayName}}
          </option>
        </select> 
        <template v-if="$v.sellerCompanyId.$error">
          <div v-for="(error, index) in $v.sellerCompanyId.$errors" :key="index" class="text-theme-6 mt-2">
            {{ error.$message }}
          </div>
        </template>  
      </div>
      <div>
        <label>Funder Company: </label>
        <select class="form-select" v-model="ecoSystemBody.funderCompanyId">
          <option v-for="company in funderCompanies" :value="company.companyId" :key="company.companyId">
            {{company.companyDisplayName}}
          </option>
        </select>
        <template v-if="$v.funderCompanyId.$error">
          <div v-for="(error, index) in $v.funderCompanyId.$errors" :key="index" class="text-theme-6 mt-2">
            {{ error.$message }}
          </div>
        </template>  
      </div>
      <div>
        <label>Seller Credit: </label>
        <input type="text" v-model="ecoSystemBody.sellerCredit" class="form-control" />
        <template v-if="$v.sellerCredit.$error">
          <div v-for="(error, index) in $v.sellerCredit.$errors" :key="index" class="text-theme-6 mt-2">
            {{ error.$message }}
          </div>
        </template>  
      </div>
      <div>
        <label>Buyer Credit: </label>
        <input type="text" v-model="ecoSystemBody.buyerCredit" class="form-control" />
        <template v-if="$v.buyerCredit.$error">
          <div v-for="(error, index) in $v.buyerCredit.$errors" :key="index" class="text-theme-6 mt-2">
            {{ error.$message }}
          </div>
        </template>  
      </div>
      <div>
        <label>Base Currency Code: </label>
        <select class="form-select" v-model="ecoSystemBody.baseCurrencyCode">
          <option v-for="currency in currencies" :key="currency.currencyCode" :value="currency.currencyCode">
            {{currency.currencyCode}}
          </option>
        </select>
        <template v-if="$v.baseCurrencyCode.$error">
          <div v-for="(error, index) in $v.baseCurrencyCode.$errors" :key="index" class="text-theme-6 mt-2">
            {{ error.$message }}
          </div>
        </template>  
      </div>
      <div>
        <label>Interest Rate(%): </label>
        <input type="text" v-model="ecoSystemBody.interestRate" class="form-control" />
        <template v-if="$v.interestRate.$error">
          <div v-for="(error, index) in $v.interestRate.$errors" :key="index" class="text-theme-6 mt-2">
            {{ error.$message }}
          </div>
        </template>  
      </div>
      <div>
        <label>Interest Rate Duration: </label>
        <select v-model="ecoSystemBody.interestRateDuration" class="form-select">
          <option v-for="duration in interestRateDuration" :value="duration" :key="duration">
            {{duration}}
          </option>
        </select>
        <template v-if="$v.interestRateDuration.$error">
          <div v-for="(error, index) in $v.interestRateDuration.$errors" :key="index" class="text-theme-6 mt-2">
            {{ error.$message }}
          </div>
        </template>  
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
        <template v-if="$v.expiredDate.$error">
          <div v-for="(error, index) in $v.expiredDate.$errors" :key="index" class="text-theme-6 mt-2">
            {{ error.$message }}
          </div>
        </template>  
      </div>
      <div>
        <label>Buyer Led Workflow</label>
        <select v-model="ecoSystemBody.buyerLedWorkflowId" class="form-select">
          <option v-for="workflow in workflowLists" :value="workflow.workflowId" :key="workflow.workflowId">
              {{workflow.name}}
          </option>
        </select>
        <template v-if="$v.buyerLedWorkflowId.$error">
          <div v-for="(error, index) in $v.buyerLedWorkflowId.$errors" :key="index" class="text-theme-6 mt-2">
            {{ error.$message }}
          </div>
        </template>  
      </div>
      <div>
        <label>Seller Led Workflow</label>
        <select v-model="ecoSystemBody.sellerLedWorkflowId" class="form-select">
          <option v-for="workflow in workflowLists" :value="workflow.workflowId" :key="workflow.workflowId">
              {{workflow.name}}
          </option>
        </select>
        
        <template v-if="$v.sellerLedWorkflowId.$error">
          <div v-for="(error, index) in $v.sellerLedWorkflowId.$errors" :key="index" class="text-theme-6 mt-2">
            {{ error.$message }}
          </div>
        </template>  
      </div>
    </div>
    <hr class="my-8"/>
    <div class="flex justify-end">
      <button class="w-32 btn btn-primary" @click="saveEcoSystem" :disabled='loading'>
        Submit
        <LoadingIcon v-if="loading" icon="oval" color="white" class="w-4 h-4 ml-2" />
      </button>
    </div>
  </div>

  <div class="intro-y box p-5 mt-5">
    <h1 class="text-lg text-theme-1">Eco Systems</h1>
    <div id="tabulator" ref="tableRef" class="mt-5 table-report table-report--tabulator"></div>
  </div>
</template>

<script>
import {reactive, onMounted, ref, computed } from "vue";
import {sysAxios, appAxios} from "@/plugins/axios";
import Tabulator from "tabulator-tables";
import feather from "feather-icons";
import moment from "moment";
import { required, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

export default {
  setup() {
    
    const dateFormat = process.env.VUE_APP_DATE_FORMAT;
    const loading = ref(true)
    const ecoSystemBody = ref({
      name: "",
      buyerCompanyName: "",
      buyerCompanyId: "",
      sellerCompanyName: "",
      sellerCompanyId: "",
      funderCompanyName: "",
      funderCompanyId: "",
      sellerCredit: 0,
      buyerCredit: 0,
      interestRate: 0,
      interestRateDuration: "",
      baseCurrencyCode: "",
      expiredDate: new Date(),
      buyerLedWorkflowId: "",
      sellerLedWorkflowId: ""
    });
       const rules = computed(() => {
      return {
        name: { required },
        buyerCompanyId: { required },
        sellerCompanyId: { required },
        funderCompanyId: { required },
        sellerCredit: { required },
        buyerCredit: { required },
        interestRate: { required },
        interestRateDuration: { required },
        baseCurrencyCode: { required },
        expiredDate:{ required },
        buyerLedWorkflowId: { required },
        sellerLedWorkflowId: { required },
      }
    })
    const ecoSystems = ref([])
    const workflowLists = ref({})
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
 

    const $v = useVuelidate(rules.value, ecoSystemBody.value);
    const saveEcoSystem = async() => {

      loading.value = true;
        console.log(ecoSystemBody.value,"save trigger")
        console.log(rules.value,"rules.value");
            console.log($v.value,"before");
            $v.value.$touch();
            console.log($v.value,"after");
            console.log($v.value.$invalid,"validation");
            if(!$v.value.$invalid)
            { 
              ecoSystemBody.value.buyerCompanyName = systemCompanies.value.filter(c => c.companyId == ecoSystemBody.value.buyerCompanyId)[0].companyDisplayName;
              ecoSystemBody.value.sellerCompanyName = systemCompanies.value.filter(c => c.companyId == ecoSystemBody.value.sellerCompanyId)[0].companyDisplayName;
              ecoSystemBody.value.funderCompanyName = funderCompanies.value.filter(f => f.companyId == ecoSystemBody.value.funderCompanyId)[0].companyDisplayName;
              ecoSystemBody.value.expiredDate = moment.utc(ecoSystemBody.value.expiredDate).format();
              
              await appAxios.post('/company/v1/ecosystems ',ecoSystemBody.value).then(res => { 
                console.log(res,"result");
              })
            }
      /*
      /api/genie/company/v1/ecosystems 
      {
        "name": "string",
        "buyerCompanyName": "string",
        "buyerCompanyId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "sellerCompanyName": "string",
        "sellerCompanyId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "funderCompanyName": "string",
        "funderCompanyId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "sellerCredit": 0,
        "buyerCredit": 0,
        "interestRate": 0,
        "interestRateDuration": "string",
        "baseCurrencyCode": "string",
        "expiredDate": "2021-10-18T07:05:21.707Z",
        "buyerLedWorkflowId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "sellerLedWorkflowId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      } 
      */

      loading.value = false;
    };
    const init = async () => {
      const getEcoSystems = 'company/v1/ecosystems'
      const companyProfileSystemConfig = 'configuration/v1/Company Profile'
      const genieSystemConfigure = 'configuration/v1/Genie Global Settings'
      const getSystemCompaniesApi = 'company/v1'
      const getWorkflowsId = 'workflow/v2/00000000-0000-0000-0000-000000000000/children?visibility=true';

      await appAxios.get(getEcoSystems).then(res => { 
        ecoSystems.value = res.data
      })
      await sysAxios.get(companyProfileSystemConfig).then(res => {
        currencies.value = JSON.parse(_.find(res.data[0].configurations, {name: "currencies"}).value)

        console.log(currencies.value,"currencies.value");
      })
      await sysAxios.get(genieSystemConfigure).then(res => {
        interestRateDuration.value = JSON.parse(_.find(res.data[0].configurations, {name: "Interest Rate Duration"}).value)
      })
      await appAxios.get(`${getSystemCompaniesApi}?type=Company`).then(res => {
        systemCompanies.value = [...res.data]

        console.log(systemCompanies.value,"systemCompanies");
      })
      await appAxios.get(`${getSystemCompaniesApi}?type=Funder`).then(res => {
        funderCompanies.value = [...res.data]
      })
      await appAxios.get(getWorkflowsId).then(res => {
        workflowLists.value = res.data
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
      $v,
      rules,
      saveEcoSystem,
      workflowLists,
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
