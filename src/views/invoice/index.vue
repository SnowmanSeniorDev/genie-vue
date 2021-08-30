<template>
  <div>
    <div class="intro-y flex items-center mt-8">
      <h2 class="text-lg font-medium mr-auto">Invoices</h2>
    </div>
    <div class="intro-y box p-5 mt-5">
      <div class="flex flex-col sm:flex-row sm:items-end xl:items-start">
        <div class="flex mt-5 sm:mt-0">
          <a href="javascript:;" data-toggle="modal" data-target="#upload-invoice-modal" class="btn btn-outline-primary w-1/2 sm:w-auto mr-2" v-if="isCompany">
            <UploadIcon class="w-4 h-4 mr-2" /> Upload&nbsp;Invoice
          </a>
        </div>
        <div class="w-full xl:flex xl:justify-end sm:mr-auto ">
          <div class="sm:flex items-center sm:mr-4">
            <label class="w-12 flex-none xl:w-auto xl:flex-initial mr-2">Field</label>
            <select
              id="tabulator-html-filter-field"
              v-model="filter.field"
              class="form-select w-full sm:w-32 xxl:w-full mt-2 sm:mt-0 sm:w-auto"
            >
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="remaining_stock">Remaining Stock</option>
            </select>
          </div>
          <div class="sm:flex items-center sm:mr-4 mt-2 xl:mt-0">
            <label class="w-12 flex-none xl:w-auto xl:flex-initial mr-2">Type</label>
            <select
              id="tabulator-html-filter-type"
              v-model="filter.type"
              class="form-select w-full mt-2 sm:mt-0 sm:w-auto"
            >
              <option value="like" selected>like</option>
              <option value="=">=</option>
              <option value="<">&lt;</option>
              <option value="<=">&lt;=</option>
              <option value=">">></option>
              <option value=">=">>=</option>
              <option value="!=">!=</option>
            </select>
          </div>
          <div class="sm:flex items-center sm:mr-4 mt-2 xl:mt-0">
            <label class="w-12 flex-none xl:w-auto xl:flex-initial mr-2">Value</label>
            <input
              id="tabulator-html-filter-value"
              v-model="filter.value"
              type="text"
              class="form-control sm:w-40 xxl:w-full mt-2 sm:mt-0"
              placeholder="Search..."
            />
          </div>
          <div class="mt-2 xl:mt-0">
            <button
              id="tabulator-html-filter-go"
              type="button"
              class="btn btn-primary w-full sm:w-16"
              @click="onFilter"
            >
              Go
            </button>
            <button
              id="tabulator-html-filter-reset"
              type="button"
              class="btn btn-secondary w-full sm:w-16 mt-2 sm:mt-0 sm:ml-1"
              @click="onResetFilter"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
    <br />
    <div class="flex divide-x-2 divide-gray-500">
      <div class="">
        <button class="btn btn-sm btn-outline-primary ml-2" @click="invoiceFromPendingAction">Pending Action</button>
      </div>
      <div class="">
        <button class="btn btn-sm btn-outline-primary mr-2" @click="invoiceFromMe">My Invoice</button>
      </div> 
    </div>
    <div class="intro-y box px-3 pb-3 mt-3">
      <div v-if="loading" class="py-16">
        <div class="w-full h-8 px-8">
          <LoadingIcon icon="spinning-circles" color="gray" class="w-4 h-4 py-8" />
        </div>
      </div>
      <div v-if="!loading" class="overflow-x-auto scrollbar-hidden">
        <div id="tabulator" ref="tableRef" class="mt-5 table-report table-report--tabulator"></div>
      </div>
    </div>
    <InvoiceUploadModal :callback="getPendingAction"/>
  </div>
</template>
<script>
import { ref, reactive, onMounted } from "vue";
import { useStore } from 'vuex';
import { useRouter } from "vue-router";
import feather from "feather-icons";
import Tabulator from "tabulator-tables";
import InvoiceUploadModal from "./InvoiceUploadModal";
import { sysAxios, appAxios } from "@/plugins/axios";
import _ from "lodash";
import moment from 'moment'
import ProvenanceLang from '@/utils/provenanceLanguage'

export default {
  components: {
    InvoiceUploadModal
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const tableRef = ref();
    const tabulator = ref();
    const loading = ref(true);
    const isCompany = ref(false);
    const invoiceOverview = ref([]);
    const pendingActions = ref([]);
    const filter = reactive({
      field: "name",
      type: "like",
      value: ""
    });
    
    
    const initTabulator = (data) => { 
      console.log(data,"data");
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
            field: "batchNumber",
            minWidth: 50,
            maxWidth: 200,
            resizable: false,
            headerSort: false
          },
          {
            title: "BUYER",
            field: "buyerCompanyName",
            headerHozAlign: 'center',
            hozAlign: "center",
            resizable: true,
            headerSort: false
          },
          {
            title: "SELLER",
            field: "sellerCompanyName",
            headerHozAlign: 'center',
            hozAlign: "center",
            resizable: true,
            headerSort: false
          },
          {
            title: "TOTAL AMOUNT",
            field: "totalAmount",
            minWidth: 100,
            maxWidth: 200,
            hozAlign: "right",
            resizable: true,
            headerSort: true,
            formatter(cell) {
              return cell.getData().currencyCode + " " +cell.getData().totalAmount.toFixed(2)
            },
          },
          {
            title: "LAST UPDATED BY",
            field: "lastUpdatedBy",
            hozAlign: "center",
            resizable: true,
            headerSort: false
          },
          {
            title: "LASTEST PHASE",
            field: "action",
            hozAlign: "center",
            headerHozAlign: 'center',
            resizable: true,
            headerSort: true,
            formatter(cell) {
              return ProvenanceLang[cell.getData().action]//moment(cell.getData().paymentDueDate).format("LL")
            }
          },
          {
            title: "CREATED AT",
            hozAlign: "center",
            headerHozAlign: 'center',
            resizable: true,
            headerSort: true,
            formatter(cell) {
              return moment(cell.getData().createdTime).format("LLLL")
            }
          },
          {
            title: "ACTIONS",
            minWidth: 100,
            maxWidth: 150,
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
                router.push({name: "batchDetail", params: {'workflowExecutionReferenceId': cell.getData().workflowExecutionReferenceId}});
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

    // Filter function
    const onFilter = () => {
      tabulator.value.setFilter(filter.field, filter.type, filter.value);
    };

    // On reset filter
    const onResetFilter = () => {
      filter.field = "name";
      filter.type = "like";
      filter.value = "";
      onFilter();
    };

    const getInvoiceOverview = async () => {
      const api = `/journalbatch/v1/header/${store.state.account.company_uuid}`
      getLastUpdatedBy(await appAxios.get(api).then(res => {return res.data})).then(res => {
        invoiceOverview.value = res
      })      
    }
  
    const getPendingAction = async () => {
      const company_uuid = store.state.account.company_uuid;
      const pendingActionApi = `/company/v1/${company_uuid}/dashboarddata`;
 
        await appAxios.get(pendingActionApi).then(async res => {
          let pendingItem = res.data.transactionsSnapShot.pendingForAction.groupingByAction;
          let pendingAction = {};
          if(pendingItem.length > 0)
          {
            for(let i=0;i<pendingItem.length;i++)
            {
              const batchApi = `/journalbatch/v1/header/byworkflowexecutionid/${pendingItem[i].workflowExecutionids[0]}`; 
              await appAxios.get(batchApi).then(res2 => { 
                let batchData = res2.data; 
                pendingAction.action = pendingItem[i].action;
                pendingAction = batchData; 
                pendingActions.value.push(pendingAction); 
              }); 
            }  

            if(store.state.account.company_type.toLowerCase() == "funder")
            {
              if(res.data.bidInvitations != null)
              {
                let pendingBid = res.data.bidInvitations.open; 
                if(pendingBid.workflowExecutionids.length > 0)
                { 
                    const batchApi = `/journalbatch/v1/header/byworkflowexecutionid/${pendingBid.workflowExecutionids[0]}`; 
                    await appAxios.get(batchApi).then(res2 => {
                      let batchData = res2.data; 
                      pendingAction = batchData;
                      pendingAction.action = "INVITE_FUNDERS_TO_BID"; 
                      pendingActions.value.push(pendingAction); 
                    });  
                }
              }
            }             
          }
           
              getLastUpdatedBy(pendingActions.value).then(res=>{  
                pendingActions.value = res;
                initTabulator(_.sortBy(res, ['createdTime']))
              });
            
         
        }) 
    }

    const getLastUpdatedBy = async (invoices) => {
      const withLastUpdatedBy = await Promise.all(invoices.map(async invoice => {
        const api = '/workflow/v1/statustransition/retrieve​/byreferenceids/limittolaststatustransition'
        const lastWorkflowData = await appAxios.post(api, [invoice.workflowExecutionReferenceId])
        
        const userId = lastWorkflowData.data[0].workflow.lastStatusTransition.updateBy
        if(userId === '00000000-0000-0000-0000-000000000000') {
          return {...invoice, lastUpdatedBy: 'System', action: lastWorkflowData.data[0].workflow.lastStatusTransition.statusName}
        }
        else {
          const userData = await sysAxios.get(`/api/user/v1/${userId}`)
          return {...invoice, lastUpdatedBy: userData.firstName + ' ' + userData.lastName, action: lastWorkflowData.workflow.lastStatusTransition.statusName}
        }
      }))
      return new Promise(resolve => resolve(withLastUpdatedBy))
    }

    const invoiceFromMe = () => {
      const updatedData = _.filter(invoiceOverview.value, {initiatedByCompanyId: store.state.account.company_uuid})
      tabulator.value.clearData()
      if(updatedData.length > 0 )
      {
        tabulator.value.addRow(updatedData)
      }      
    }

    const invoiceFromPendingAction = () => {
      const updatedData = pendingActions.value;
      tabulator.value.clearData()
      if(updatedData.length > 0 )
      {
        tabulator.value.addRow(updatedData)
      }      
    }

    onMounted(async () => {
      
       getInvoiceOverview();
       getPendingAction();
      if(store.state.account.company_type.toLowerCase() == "company")
      { 
        isCompany.value = true;
      }
      reInitOnResizeWindow();
      loading.value = false
    });

    return {
      isCompany,
      loading,
      tableRef,
      filter,
      onFilter,
      onResetFilter,
      getPendingAction,
      getInvoiceOverview,
      invoiceFromMe,
      invoiceFromPendingAction,
      ProvenanceLang
    };
  },
}
</script>