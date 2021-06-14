<template>
  <div>
    <div class="intro-y flex items-center mt-8">
      <h2 class="text-lg font-medium mr-auto">Invoices</h2>
    </div>
    <div class="intro-y box p-5 mt-5">
      <div class="flex flex-col sm:flex-row sm:items-end xl:items-start">
        <div class="flex mt-5 sm:mt-0">
          <a href="javascript:;" data-toggle="modal" data-target="#upload-invoice-modal" class="btn btn-outline-primary w-1/2 sm:w-auto mr-2" >
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
    <h4 class="text-lg underline mt-5 ml-2 text-red-400 font-bold">Invoice Overview</h4>
    <div class="intro-y box px-3 mt-3">
      <div class="overflow-x-auto scrollbar-hidden">
        <div id="tabulator" ref="tableRef" class="mt-5 table-report table-report--tabulator"></div>
      </div>
    </div>
    <InvoiceUploadModal />
  </div>
</template>
<script>
import { ref, reactive, onMounted } from "vue";
import { useStore } from 'vuex';
import { useRouter } from "vue-router";
import feather from "feather-icons";
import Tabulator from "tabulator-tables";
import InvoiceUploadModal from "./InvoiceUploadModal";
import { sysAxios } from "@/plugins/axios";

export default {
  components: {
    InvoiceUploadModal
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const tableRef = ref();
    const tabulator = ref();
    const invoiceOverview = ref([]);
    const filter = reactive({
      field: "name",
      type: "like",
      value: ""
    });
    
    
    const initTabulator = () => {
      tabulator.value = new Tabulator(tableRef.value, {
        data: invoiceOverview.value,
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [5, 10, 20, 30, 40],
        layout: "fitColumns",
        responsiveLayout: "collapse",
        placeholder: "No matching records found",
        columns: [
          {
            title: "BATCH NO.",
            field: "dataSource",
            minWidth: 50,
            maxWidth: 150,
            resizable: false,
            headerSort: false
          },
          {
            title: "BUYER",
            field: "buyerCompanyId",
            hozAlign: "center",
            resizable: false,
            headerSort: false
          },
          {
            title: "SELLER",
            field: "sellerCompanyId",
            hozAlign: "center",
            resizable: false,
            headerSort: false
          },
          {
            title: "TOTAL AMOUNT (RM)",
            field: "totalAmount",
            minWidth: 100,
            maxWidth: 200,
            hozAlign: "right",
            resizable: false,
            headerSort: false,
            formatter(cell) {
              return cell.getData().totalAmount.toFixed(2)
            },
          },
          {
            title: "LAST UPDATED BY",
            field: "documentDate",
            hozAlign: "center",
            resizable: false,
            headerSort: false
          },
          {
            title: "LASTEST PHASE",
            field: "paymentDueDate",
            hozAlign: "center",
            resizable: false,
            headerSort: false
          },
          {
            title: "ACTIONS",
            minWidth: 100,
            maxWidth: 150,
            field: "actions",
            responsive: 1,
            hozAlign: "center",
            vertAlign: "middle",
            formatter(cell) {
              const a = cash(`<div class="flex lg:justify-center items-center">
                <a class="flex items-center btn btn-sm btn-primary" href="javascript:;">
                  View
                </a>
              </div>`);
              cash(a).on("click", function() {
                router.push({name: "batchDetail", params: {'batchData': JSON.stringify(cell.getData())}});
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

    const getInvoiceOverview = () => {
      const api = `https://journalbatch.bsg-api.tk/api/genie/journalbatch/v1/header/${store.state.account.company_uuid}`;
      sysAxios.get(api).then(res => {
        invoiceOverview.value = res.data;
        console.log(invoiceOverview.value);
        initTabulator()
      })
    }

    onMounted(async () => {
      await getInvoiceOverview();
      reInitOnResizeWindow();
    });

    return {
      tableRef,
      filter,
      onFilter,
      onResetFilter,
    };
  },
}
</script>