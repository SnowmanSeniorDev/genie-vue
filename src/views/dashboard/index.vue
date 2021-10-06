<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12">
      <div class="grid grid-cols-12 gap-6">
        <!-- BEGIN: General Report -->
        <div class="col-span-12 mt-8">
          <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">Dashboard</h2>
            <a href="" class="ml-auto flex text-theme-1 dark:text-theme-10">
              <RefreshCcwIcon class="w-4 h-4 mr-3" /> Reload Data
            </a>
          </div> 
        </div>
        <!-- END: General Report -->
        <!-- START: Cards Data -->
        <Cards />
        <!-- END: Cards Data -->
        <!-- STAER: Active Report-->
        <div class="col-span-12 grid grid-cols-3 gap-6 mt-5">
          <div class="intro-y box p-5">
            <div class="flex items-center">
              <ListIcon class="w-6 h-6 mr-3" /><span class="text-lg">Pending For Action</span>
            </div>
            <div class="report-timeline mt-5 relative" v-if="pendingActions.length > 0">
              <div class="intro-x relative flex items-start pb-5" v-for="pendingAction in pendingActions" :key="pendingAction.workflowExecutionReferenceId">
                <div class="w-6 h-6 shadow-lg flex-none image-fit rounded-full overflow-hidden bg-gray-500 ml-2"></div>
                <div class="px-5 ml-4 flex-1">
                  <div class="items-center">
                    <span class="font-bold">{{ProvenanceLang[pendingAction.action]}}</span>
                    <div class="mt-2">Invoice Batch {{pendingAction.batchNumber}}</div>
                    <div class="text-gray-500">Created On :  {{pendingAction.createdTime}}</div>
                    <a :href="`/invoice/detail/${pendingAction.workflowExecutionReferenceId}`"><button class="mt-2 btn h-6 w-16 bg-pink-700 text-white btn-sm">View</button></a>
                  </div>
                </div>
              </div>  
            </div>
            <div class="mt-5 relative" v-else>
              <div class="intro-x relative flex items-start pb-5"> 
                <div class="px-5 ml-4 flex-1">
                  <div class="items-center">
                    No pending item
                  </div>
                </div>
              </div>  
            </div>
          </div>
          <div class="intro-y bg-theme-2">
            <div class="p-5">
              <img alt="" class="intro-x w-full h-36" src="/Calendar-bro.svg" />
            </div>
            <div class="box p-8">
              <h4 class="text-lg font-bold">Upcoming Holiday Calendar</h4>
              <div class="mt-3 overflow-y-auto h-48 scroll-primary">
                <div v-for="holiday in holidays" :key="holiday.holidayCalendarEntryId" class="cursor-pointer relative flex items-center mt-2">
                  <div class="w-8 mr-1 bg-pink-200 p-1 rounded-md">
                    <CalendarIcon class="notification__icon dark:text-gray-300 text-pink-700 text-sm" />
                  </div>
                  <div class="ml-2 overflow-hidden">
                    <div class="flex items-center">
                      <a href="javascript:;" class="truncate mr-5">{{moment(holiday.date).format(dateFormat)}}</a>
                    </div>
                    <div class="flex items-center">
                      <a href="javascript:;" class="font-medium truncate mr-5">{{holiday.description}}</a>
                    </div>
                    <div class="w-full truncate text-gray-600 mt-0.5">{{holiday.label}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ActiveBorrowers v-if="userRole == 'Funder Admin'"/>
        </div>
        <!-- END: Active Report -->
        <!-- STAER: Stock Chart-->
        <!-- div class="col-span-12">
          <div class="intro-y box w-full">
            <div id="stacked-bar-chart" class="p-5">
              <div class="preview">
                <StackedBarChart :height="200" />
              </div>
            </div>
          </div>
        </!-->
        <!-- END: Stock Chart -->
      </div>
    </div>
    <InvoiceUploadModal />
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import StackedBarChart from "@/components/stacked-bar-chart/Main.vue";
import { useStore } from 'vuex';
import moment from 'moment';
import _ from 'lodash';
import { appAxios } from '@/plugins/axios';
import InvoiceUploadModal from "../invoice/InvoiceUploadModal";
import Cards from "./Cards.vue";
import ActiveBorrowers from "./ActiveBorrowers.vue"
import ProvenanceLang from '@/utils/provenanceLanguage'

export default defineComponent({
  components: {
    //StackedBarChart,
    InvoiceUploadModal,
    Cards,
    ActiveBorrowers
  },
 
  setup() {
    const dateFormat = process.env.VUE_APP_DATE_FORMAT;
    const store = useStore()
    const holidays = ref([]);
    const pendingActions = ref([]);

    onMounted(async () => {
      const company_uuid = store.state.account.company_uuid;

      const dashboardApi = `/company/v1/${company_uuid}/dashboarddata`;
      const api = `/communications/v1/notification/${company_uuid}`;
      if(company_uuid !== "00000000-0000-0000-0000-000000000000") {
        await appAxios.get(`/company/v1/${company_uuid}/holidays`).then(res => {
          holidays.value = _.filter(res.data, (holiday) => {return new Date(holiday.date) > new Date()})
        })
        
        await appAxios.get(dashboardApi).then(res => {
          let pendingItem = res.data.transactionsSnapShot.pendingForAction.groupingByAction;
          let pendingAction = {};
          if(pendingItem.length > 0) {
            for(let i=0;i<pendingItem.length;i++) {
              const batchApi = `/journalbatch/v1/header/byworkflowexecutionid/${pendingItem[i].workflowExecutionids[0]}`; 
              appAxios.get(batchApi).then(res2 => {
                let batchData = res2.data;

                pendingAction = {};
                pendingAction.action = pendingItem[i].action;
                pendingAction.batchNumber = batchData.batchNumber;
                pendingAction.workflowExecutionReferenceId = batchData.workflowExecutionReferenceId;
                pendingAction.createdTime = moment(batchData.createdTime).format(dateFormat);
                pendingAction.initiatedByCompanyName = batchData.initiatedByCompanyName;
                pendingActions.value.push(pendingAction);
              }); 
            }
          }
          if(store.state.account.company_type.toLowerCase() == "funder") {
            if(res.data.bidInvitations != null) {
              let pendingBid = res.data.bidInvitations.open;
              if(pendingBid.workflowExecutionids.length > 0) {
                for(let i=0;i<pendingBid.workflowExecutionids.length;i++) {
                  const batchApi = `/journalbatch/v1/header/byworkflowexecutionid/${pendingBid.workflowExecutionids[i]}`; 
                  appAxios.get(batchApi).then(res2 => {
                    let batchData = res2.data; 
                    pendingAction = {};
                    pendingAction.action = "BIDDING_IN_PROGRESS";
                    pendingAction.batchNumber = batchData.batchNumber;
                    pendingAction.workflowExecutionReferenceId = batchData.workflowExecutionReferenceId;
                    pendingAction.createdTime = moment(batchData.createdTime).format(dateFormat);
                    pendingAction.initiatedByCompanyName = batchData.initiatedByCompanyName;
                    pendingActions.value.push(pendingAction);
                  });              
                }
              }
            }
          }
        })
      }
    })

    return {
      dateFormat,
      pendingActions,
      holidays, 
      moment,
      ProvenanceLang,
      userRole: store.state.auth.user_role
    };
  }
});
</script>
