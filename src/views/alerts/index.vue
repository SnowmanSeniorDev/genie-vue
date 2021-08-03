<template>
  <div>
    <div class="intro-y flex items-center mt-8">
      <h2 class="text-lg font-medium mr-auto">Alert Center</h2>
    </div>
    <div class="intro-y box p-4 mt-5">
      <div class="flex flex-col sm:flex-row sm:items-end xl:items-start">
        <div class="sm:flex items-center w-48 sm:w-96">
          <label class="w-12 flex-none xl:w-auto xl:flex-initial mr-2">Search</label>
          <input
            id="tabulator-html-filter-value"
            v-model="filter.value"
            type="text"
            class="form-control xxl:w-full"
            placeholder="Search..."
          />
        </div>
        <div class="w-full xl:flex xl:justify-end">
          <div class="">
            <button
              id="tabulator-html-filter-go"
              type="button"
              class="btn btn-primary w-full sm:w-32"
              @click="markReadAll"
            >
              Mark Read All
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="intro-y box px-3 pb-3 mt-3">
      <div class="overflow-x-auto scrollbar-hidden">
        <div id="tabulator" ref="tableRef" class="mt-5 table-report table-report--tabulator"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, reactive, onMounted } from "vue";
import { useStore } from 'vuex';
import { useRouter } from "vue-router";
import feather from "feather-icons";
import Tabulator from "tabulator-tables";
import { sysAxios } from "@/plugins/axios";

export default {
  setup() {
    const store = useStore()
    const router = useRouter();
    const tableRef = ref();
    const tabulator = ref();
    const notifications = ref([
      {
        notification: "Corporate Document(s) Status Change",
        eventTime: "13 April 2021 09:26PM",
        lastStatus: 'verified'
      }
    ]);
    const filter = reactive({
      value: ""
    });
    
    
    const initTabulator = () => {
      tabulator.value = new Tabulator(tableRef.value, {
        data: notifications.value,
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [5, 10, 20, 30, 40],
        layout: "fitColumns",
        responsiveLayout: "collapse",
        placeholder: "No matching records found",
        columns: [
          {
            title: "NOTIFICATIONS",
            field: "content",
            hozAlign: "left",
            resizable: true,
            headerSort: false
          },
          {
            title: "EVENT DATE & TIME",
            field: "when",
            hozAlign: "left",
            resizable: true,
            headerSort: false
          },
          {
            title: "LAST STATUS / PHASE",
            maxWidth: 200,
            hozAlign: "left",
            resizable: true,
            headerSort: false,
            formatter(cell) {
              const status = cell.getData().status
              const a = `<div class="flex items-center">
                <div class="alert show flex items-center h-5 p-3 w-32 text-sm justify-center text-green-700 bg-green-200" role="alert">
                  <span class="pr-3">${status}</span>
                </div>
              </div>`
              return a
            }
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


    const markReadAll = () => {

    }
    onMounted(async () => {
      const api = `/communications/v1/notification/${store.state.account.company_uuid}`
      await sysAxios.get(api).then(res => {
        notifications.value = res.data
      })
      initTabulator()
      reInitOnResizeWindow();
    });

    return {
      tableRef,
      filter,
      markReadAll
    };
  },
}
</script>