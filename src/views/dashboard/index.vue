<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12">
      <div class="grid grid-cols-12 gap-6">
        <!-- BEGIN: General Report -->
        <div class="col-span-12 mt-8">
          <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">General Report</h2>
            <a href="javascript:;" data-toggle="modal" data-target="#upload-invoice-modal" class="btn btn-outline-primary w-1/2 sm:w-auto mr-2" >
              <UploadIcon class="w-4 h-4 mr-2" /> Upload&nbsp;Invoice
            </a>
            <a href="" class="ml-auto flex text-theme-1 dark:text-theme-10">
              <RefreshCcwIcon class="w-4 h-4 mr-3" /> Reload Data
            </a>
          </div>
          <div class="grid grid-cols-12 gap-6 mt-5">
            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="report-box zoom-in">
                <div class="box px-5 py-8 grid grid-cols-12 gap-4">
                  <div class="col-span-10">
                    <div class="text-xl font-bold leading-8">Offer Pending</div>
                    <div class="text-base text-gray-600 mt-1">EUR 8,000.00</div>
                  </div>
                  <div class="col-span-2 self-center bg-blue-200 h-12 w-12 flex rounded-full justify-center">
                    <ShoppingCartIcon class="report-box__icon text-theme-10 self-center" />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="report-box zoom-in">
                <div class="box px-5 py-8 grid grid-cols-12 gap-4">
                  <div class="col-span-10">
                    <div class="text-xl font-bold leading-8">Approved</div>
                    <div class="text-base text-gray-600 mt-1">EUR 8,000.00</div>
                  </div>
                  <div class="col-span-2 self-center bg-green-200 h-12 w-12 flex rounded-full justify-center">
                    <ThumbsUpIcon class="report-box__icon text-green-700 self-center" />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="report-box zoom-in">
                <div class="box px-5 py-8 grid grid-cols-12 gap-4">
                  <div class="col-span-10">
                    <div class="text-xl font-bold leading-8">Payable to Funder</div>
                    <div class="text-base text-gray-600 mt-1">EUR 8,000.00</div>
                  </div>
                  <div class="col-span-2 self-center bg-pink-200 h-12 w-12 flex rounded-full justify-center">
                    <ShoppingCartIcon class="report-box__icon text-pink-700 self-center" />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="report-box zoom-in">
                <div class="box px-5 py-8 grid grid-cols-12 gap-4">
                  <div class="col-span-10">
                    <div class="text-xl font-bold leading-8">Paid to Funder</div>
                    <div class="text-base text-gray-600 mt-1">EUR 3,000.00</div>
                  </div>
                  <div class="col-span-2 self-center bg-yellow-200 h-12 w-12 flex rounded-full justify-center">
                    <ShoppingCartIcon class="report-box__icon text-yellow-700 self-center" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- END: General Report -->
        <!-- STAER: Active Report-->
        <div class="col-span-12 grid grid-cols-12 gap-6 mt-5">
          <div class="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
            <div class="intro-y box p-5">
              <div class="flex items-center">
                <ListIcon class="w-6 h-6 mr-3" /><span class="text-lg">Last Activties</span>
              </div>
              <div class="report-timeline mt-5 relative">
                <div class="intro-x relative flex items-start pb-5">
                  <div class="w-6 h-6 shadow-lg flex-none image-fit rounded-full overflow-hidden bg-gray-500 ml-2"></div>
                  <div class="px-5 ml-4 flex-1">
                    <div class="items-center">
                      <span class="font-bold">Invoice Upload</span>
                      <div class="mt-2">Invoice Batch #10054 upload success</div>
                      <div class="text-gray-500">TimeStamp : 20/04/2021, 10:03</div>
                      <button class="mt-2 btn h-6 w-16 bg-pink-700 text-white btn-sm">View</button>
                    </div>
                  </div>
                </div>
                <div class="intro-x relative flex items-start pb-5">
                  <div class="w-6 h-6 shadow-lg flex-none image-fit rounded-full overflow-hidden bg-gray-500 ml-2"></div>
                  <div class="px-5 ml-4 flex-1">
                    <div class="items-center">
                      <span class="font-bold">Corporate Documents Validated</span>
                      <div class="mt-2">Your seller John.smith@happytech.com is now active on Genie!</div>
                      <div class="text-gray-500">TimeStamp : 18/04/2021, 15:30</div>
                      <button class="mt-2 btn h-6 w-16 bg-pink-700 text-white btn-sm">View</button>
                    </div>
                  </div>
                </div>
                <div class="intro-x relative flex items-start pb-5">
                  <div class="w-6 h-6 shadow-lg flex-none image-fit rounded-full overflow-hidden bg-gray-500 ml-2"></div>
                  <div class="px-5 ml-4 flex-1">
                    <div class="items-center">
                      <span class="font-bold">Wecome to Genie!</span>
                      <div class="mt-2">Your account is approved!</div>
                      <div class="text-gray-500">TimeStamp : 11/04/2021, 20:45</div>
                    </div>
                  </div>
                </div>
                <div class="intro-x relative flex items-start pb-5">
                  <div class="w-6 h-6 shadow-lg flex-none image-fit rounded-full overflow-hidden bg-gray-500 ml-2"></div>
                  <div class="px-5 ml-4 flex-1">
                    <div class="items-center">
                      <span class="font-bold">Wecome to Genie!</span>
                      <div class="mt-2">Your account is approved!</div>
                      <div class="text-gray-500">TimeStamp : 11/04/2021, 20:45</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
            <div class="intro-y p-5">
              <img alt="" class="intro-x w-full h-48" src="/img/illustration.57641b18.svg" />
              <div class="box p-8">
                <h4 class="text-lg font-bold">Upcomming Holiday Calender</h4>
                <div class="mt-3 overflow-y-auto h-48 scroll-primary">
                  <div v-for="holiday in holidays" :key="holiday.holidayCalendarEntryId" class="cursor-pointer relative flex items-center mt-2">
                    <div class="w-8 mr-1 bg-pink-200 p-1 rounded-md">
                      <CalendarIcon class="notification__icon dark:text-gray-300 text-pink-700 text-sm" />
                    </div>
                    <div class="ml-2 overflow-hidden">
                      <div class="flex items-center">
                        <a href="javascript:;" class="truncate mr-5">{{moment(holiday.date).format('LL')}}</a>
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
          </div>

          <div class="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
            <div class="box p-8">
              <h4 class="text-lg font-bold">Active Onboarded Parters</h4>
              <div class="flex gap-4 justify-around">
                <div class="py-8 flex">
                  <div class="self-center bg-blue-200 h-12 w-12 flex rounded-full justify-center">
                    <UserIcon class="report-box__icon text-theme-10 self-center" />
                  </div>
                  <div class="ml-4">
                    <div class="text-xl font-bold leading-8">4 of 6</div>
                    <div class="text-base text-gray-600">Sellers</div>
                  </div>
                </div>
                <div class="py-8 flex">
                  <div class="self-center bg-pink-200 h-12 w-12 flex rounded-full justify-center">
                    <UserIcon class="report-box__icon text-pink-700 self-center" />
                  </div>
                  <div class="ml-4">
                    <div class="text-xl font-bold leading-8">2 of 2</div>
                    <div class="text-base text-gray-600">Buyer</div>
                  </div>
                </div>
              </div>
              <button class="btn bg-pink-700 w-full text-white">Onboard Partners</button>
            </div>
            <div class="box p-8 mt-3">
              <h4 class="text-lg font-bold">Pending Actions</h4>
              <div class="py-8 flex">
                <div class="self-center bg-yellow-200 h-12 w-12 flex rounded-full justify-center">
                  <FileIcon class="report-box__icon text-yellow-500 self-center" />
                </div>
                <div class="ml-4">
                  <div class="text-xl font-bold leading-8">3 Invoice Batch</div>
                  <div class="text-base text-gray-600">Pending for validation</div>
                </div>
              </div>
              <button class="btn bg-pink-700 w-full text-white">Mange Invoices</button>
            </div>
          </div>
            
        </div>
        <!-- END: Active Report -->
        <!-- STAER: Stock Chart-->
        <div class="col-span-12">
          <div class="intro-y box w-full">
            <div id="stacked-bar-chart" class="p-5">
              <div class="preview">
                <StackedBarChart :height="200" />
              </div>
            </div>
          </div>
        </div>
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


export default defineComponent({
  components: {
    StackedBarChart,
    InvoiceUploadModal
  },
 
  setup() {
    const store = useStore()
    const holidays = ref([]);

    onMounted(async () => {
      const company_uuid = store.state.account.company_uuid
      console.log(company_uuid)
      const api = `/communications/v1/notification/${company_uuid}`
      if(company_uuid !== "00000000-0000-0000-0000-000000000000") {
        await appAxios.get(`/company/v1/${company_uuid}/holidays`).then(res => {
          holidays.value = _.filter(res.data, (holiday) => {return new Date(holiday.date) > new Date()})
        })
      }
    })
    return {holidays, moment};
  }
});
</script>
