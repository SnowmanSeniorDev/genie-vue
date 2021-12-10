<template>
  
  <div class="intro-y box p-5 mt-5">
   
    <h1 class="text-lg text-theme-1">Eco Systems
 <div class="flex mt-5 sm:mt-0" >
          <a href="javascript:;" @click="createEcoSystem" class="btn btn-outline-primary w-1/2 sm:w-auto mr-2">
            <UploadIcon class="w-4 h-4 mr-2" /> Create Eco System
          </a>
        </div>

    </h1>
    <div id="tabulator" ref="tableRef" class="mt-5 table-report table-report--tabulator"></div>
    <RelationshipModal :callback="init" :editObject="ecoSystemBody"  />
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
import RelationshipModal from "./RelationshipModal";
export default {
  watch: {
  },
  components: {
    RelationshipModal
  },
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
      sellerLedWorkflowId: "",
      editMode: false
    });
    const dateTimeFormat = ref(process.env.VUE_APP_DATETIME_FORMAT); 
    const ecoSystems = ref([])
    const ecoSystemLine = ref([])
    const workflowLists = ref({}) 
    const tableRef = ref();
    const tabulator = ref();
    const createEcoSystem = () => {
      ecoSystemBody.value = {};
      ecoSystemBody.value.editMode = false;
      cash("#relationship-modal").modal("show");
                 
                
    }
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
            title: "Name",
            field: "name",
            minWidth: 50,
            maxWidth: 250,
            resizable: false,
          }, {
            title: "Funder",
            field: "funderCompanyName",
            headerHozAlign: 'center',
            hozAlign: "center",
            resizable: true,
          }, {
            title: "Buyer",
            field: "buyerCompanyName",
            headerHozAlign: 'center',
            hozAlign: "center",
            resizable: true,
          }, {
            title: "Seller",
            field: "sellerCompanyName",
            headerHozAlign: 'center',
            hozAlign: "center",
            resizable: true,
          }, {
            title: "Expired Date",
            field: "expiredDate",
            headerHozAlign: 'center',
            hozAlign: "center",
            resizable: true,
            formatter(cell) { 
              return moment(cell.getData().expiredDate).format(dateTimeFormat.value)
            }
          }, {
            title: "Status",
            field: "status",
            headerHozAlign: 'center',
            hozAlign: "center",
            resizable: true,
          },
          
          {
            title: "ACTIONS",
            maxWidth: 130,
            responsive: 1,
            headerHozAlign: "center",
            hozAlign: "center",
            vertAlign: "middle",
            formatter(cell) {
              const a = cash(`<div class="flex lg:justify-center items-center">
                <a class="flex items-center btn btn-sm btn-primary" href="javascript:;">
                  View
                </a>
              </div>`);
              cash(a).on("click", function() {
                cash("#relationship-modal").modal("show");
                console.log(cell.getData(),"cell.getData()");
                ecoSystemBody.value = cell.getData(); 
                ecoSystemBody.value.editMode = true;
                
              })
              return a[0];
            }
          },
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
       
      await appAxios.get(getEcoSystems).then(res => { 
        ecoSystems.value = res.data
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
      ecoSystemLine,
      workflowLists,
      loading,
      dateFormat,
      tableRef, 
      ecoSystemBody,
      dateTimeFormat,
      createEcoSystem,
      init
    }
  },
}
</script>
