<template>
  <div>
    <div class="intro-y flex items-center mt-8">
      <h2 class="text-lg font-medium mr-auto">Alert Center</h2>
    </div>
    <div class="intro-y box p-4 mt-5">
      <div class="flex flex-col sm:flex-row sm:items-end xl:items-start">
        <div class="w-full xl:flex xl:justify-start">
          <div class="flex justify-center rounded-lg text-lg" role="group">
            <a
              class="bg-white border border-theme-1 rounded-l-lg px-4 py-2 text-sm  cursor-pointer"
              :class="`${split ? 'text-theme-1' : 'bg-theme-1 text-white'}`"
              @click="showAllNotification"
            >All</a>
            <a
              class="bg-white border border-theme-1 rounded-r-lg px-4 py-2 text-sm cursor-pointer"
              :class="`${split ? 'bg-theme-1 text-white' : 'text-theme-1'}`"
              @click="showUnreadNotification"
            >Unread</a>
          </div>
        </div>
        <div class="w-full xl:flex xl:justify-start">
          <div class="">
            <button
              id="tabulator-html-filter-go"
              type="button"
              class="btn btn-primary w-full sm:w-36"
              @click="markReadAll"
            >
              Mark all as Read
            </button>
          </div>
        </div>
        <div class="mt-2 sm:mt-0 flex items-center w-full sm:w-96">
          <input v-model="filter.value" type="text" class="form-control xxl:w-full" placeholder="Search..."/>
          <button type="button" class="btn btn-primary btn-sm ml-1" @click="search">
            <SearchIcon />
          </button>
        </div>
      </div>
    </div>
    <div class="intro-y box px-3 pb-3 mt-3">
      <div class="overflow-x-auto scrollbar-hidden">
        <div id="tabulator" ref="tableRef" class="mt-5 table-report table-report--tabulator"></div>
      </div>
    </div>
    <div id="acknowledge-notification" class="modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <!-- BEGIN: Modal Header -->
          <div class="modal-header">
            <h2 class="font-medium text-base mr-auto"> {{viewingNotification.title}} </h2>
          </div>
          <!-- END: Modal Header -->
          <div class="modal-body mx-8">
            {{viewingNotification.content}}
            <div class="text-right">
              <br />
              {{moment(viewingNotification.when).format(dateTimeFormat)}}
            </div>
          </div>
          <div class="modal-footer text-right">
            <button v-if="viewingNotification.status == 'Complete'" type="button" class="btn btn-primary w-24" @click="makeAsRead">OK</button>
            <button v-else type="button" data-dismiss="modal" class="btn btn-primary w-24">Cancel</button>
          </div> <!-- END: Modal Footer -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, reactive, onMounted } from "vue";
import { useStore } from 'vuex';
import feather from "feather-icons";
import Tabulator from "tabulator-tables";
import { sysAxios } from "@/plugins/axios";
import moment from "moment";

export default {
  props: {
    notificationId: {
      type: String,
      required: false
    }
  },
  setup(props) {
    const store = useStore()
    const tableRef = ref();
    const tabulator = ref();
    const notifications = ref([]);
    const filter = reactive({
      field: "content",
      type: "like",
      value: ""
    });
    const viewingNotification = ref({
      notificationId: null,
      title: null,
      content: null,
      when: null,
    });
    const dateTimeFormat = process.env.VUE_APP_DATETIME_FORMAT
    var split = ref(true);
    
    const initTabulator = () => {
      const tabelData = split.value ? _.filter(notifications.value, {status: "Complete"}) : notifications.value
      tabulator.value = new Tabulator(tableRef.value, {
        data: tabelData,
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [5, 10, 20, 30, 40],
        layout: "fitColumns",
        responsiveLayout: "collapse",
        placeholder: "No matching records found",
        columns: [
          {
            title: "Notifications",
            field: "content",
            hozAlign: "left",
            resizable: true,
            headerSort: false
          },
          {
            title: "Event Timestamp",
            maxWidth: 300,
            hozAlign: "left",
            resizable: true,
            headerSort: false,
            formatter(cell) { 
              const dateTime = cell.getData().when
              return moment(dateTime).format(dateTimeFormat)
            }
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
            title: "Actions",
            maxWidth: 100,
            hozAlign: "center",
            resizable: true,
            headerSort: false,
            formatter(cell) {
              const notification = cell.getData()
              const a = cash(`<div class="flex items-center justify-center">
                <a>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </a>
              </div>`)
              cash(a).on("click", function() {
                openAcknowledgeNotificationModal(notification)
              })
              return a[0]
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

    const markReadAll = async () => {
      await new Promise.all(notifications.value.forEach(notification => {
        if(notification.status == 'read') return;
        const api = `communications/v1/notification/${notification.notificationId}/read`
        sysAxios.put(api)
      }))
      init()
    }

    const openAcknowledgeNotificationModal = (notification) => {
      viewingNotification.value = notification;
      cash("#acknowledge-notification").modal("show")
    }

    const makeAsRead = async () => {
      const api = `communications/v1/notification/${viewingNotification.value.notificationId}/Read`
      await sysAxios.put(api)
      cash("#acknowledge-notification").modal("hide")
      init()
    }

    const search = () => {
      tabulator.value.setFilter(filter.field, filter.type, filter.value);
      console.log(filter.value)
    }

    const showUnreadNotification = () => {
      split.value = true
      initTabulator()
    }

    const showAllNotification = () => {
      split.value = false
      initTabulator()
    }

    const init = async () => {
      const api = `communications/v1/notification/${store.state.account.company_uuid}`
      notifications.value = await sysAxios.get(api + '?status=Complete').then(res => {return res.data})
      await sysAxios.get(api + '?status=Read').then(res => {
        notifications.value.push(...res.data)
      })
      initTabulator()
      return new Promise(resolve => {
        resolve(notifications.value)
      })
    }

    onMounted(async () => {
      console.log(props.notificationId)
      await init()
      reInitOnResizeWindow()
    });

    return {
      tableRef,
      filter,
      markReadAll,
      search,
      openAcknowledgeNotificationModal,
      makeAsRead,
      viewingNotification,
      moment,
      dateTimeFormat,
      split,
      showUnreadNotification,
      showAllNotification,
    };
  },
}
</script>

<style>
  .xlsx-viewer tr:nth-child(odd) {
    background: #adb3bd80;
  }
  .xlsx-viewer tr {
    border: 1px solid black;
  }
  .xlsx-viewer td {
    height: 20px;
  }
</style>