<template>
  <div>
    <div class="intro-y flex items-center mt-8 divide-x-2 divide-gray-500 justify-start">
      <div class="mr-2">
        <h2 class="text-lg font-medium mr-auto">Invoice</h2>
      </div>
      <div class="text-lg font-medium mr-auto pl-2">
        <span class="bg-pink-900 p-1 text-white text-sm">Branch No: #10054</span>
      </div>
    </div>
    <div class="intro-y box p-5 mt-5">
      <span class="text-lg">Document Uploads</span>
      <table class="table table--lg border-l border-r">
        <thead>
          <tr class="bg-gray-400">
            <th class="dark:border-dark-5 whitespace-nowrap"> BATCH REF NO </th>
            <th class="dark:border-dark-5 whitespace-nowrap"> INVOICE AMOUNT(RM) </th>
            <th class="dark:border-dark-5 whitespace-nowrap"> PAYMENT DUE DATE </th>
            <th class="dark:border-dark-5 whitespace-nowrap"> OFFER EXPIRY DATE </th>
            <th class="dark:border-dark-5 whitespace-nowrap"> STATUS </th>
            <th class="dark:border-dark-5 whitespace-nowrap"> ACTIONS </th>
          </tr>
        </thead>
        <tbody v-for="(item, index) in journalBatchEntry" :key="index">
          <tr>
            <td class="dark:border-dark-5">{{item.vendorDocumentReferenceNumber}}</td>
            <td class="dark:border-dark-5">{{item.amount.toFixed(2)}}</td>
            <td class="dark:border-dark-5">{{moment(item.dueDate).format('DD/MM/YYYY')}}</td>
            <td class="dark:border-dark-5">{{moment(item.createdTime).format('DD/MM/YYYY')}}</td>
            <td class="dark:border-dark-5">
              <div class="alert alert-warning-soft show flex items-center justify-center h-5 p-3 text-sm" role="alert">
                pending
              </div>
            </td>
            <td class="dark:border-dark-5">
              <div class="alert show flex items-center h-5 p-3 text-sm justify-center text-blue-700 bg-blue-200" role="alert">
                View Less
              </div>
            </td>
          </tr>
          <Docments :journal_batch_header_id="item.journalBatchHeaderId" :journal_batch_entry_id="item.journalBatchEntryId"/>
        </tbody>
      </table>
    </div>

    <div class="grid grid-cols-2 gap-4 mt-6">
      <div class="intro-y box p-5 mt-5">
        <div class="flex items-center">
          <LockIcon class="w-6 h-6 mr-3" /><span class="text-lg">Provenance</span>
        </div>
        <img alt="" class="intro-x w-full h-48" :src="require(`@/assets/images/illustration.svg`)"/>
        <div class="report-timeline mt-5 relative">
          <div class="intro-x relative flex items-start pb-5">
            <div class="w-6 h-6 shadow-lg flex-none image-fit rounded-full overflow-hidden bg-gray-500 ml-2"></div>
            <div class="px-5 ml-4 flex-1">
              <div class="flex items-center">
                <div class="alert alert-secondary show flex items-center justify-center h-5 p-3 text-sm" role="alert">
                  Not Started
                </div>
                <span class="ml-3 text-gray-500">Buyer Acknowledgement</span>
              </div>
              <hr class="mt-5">
            </div>
          </div>
          <div class="intro-x relative flex items-start pb-5">
            <div class="w-6 h-6 shadow-lg flex-none image-fit rounded-full overflow-hidden bg-gray-500 ml-2"></div>
            <div class="px-5 ml-4 flex-1">
              <div class="flex items-center">
                <div class="alert alert-secondary show flex items-center justify-center h-5 p-3 text-sm" role="alert">
                  Not Started
                </div>
                <span class="ml-3 text-gray-500">Seller Acknowledgement</span>
              </div>
              <hr class="mt-5">
            </div>
          </div>
          <div class="intro-x relative flex items-start pb-5">
            <div class="w-6 h-6 shadow-lg flex-none image-fit rounded-full overflow-hidden bg-gray-500 ml-2"></div>
            <div class="px-5 ml-4 flex-1">
              <div class="flex items-center">
                <div class="alert alert-secondary show flex items-center justify-center h-5 p-3 text-sm" role="alert">
                  Not Started
                </div>
                <span class="ml-3 text-gray-500">Repayment</span>
              </div>
              <hr class="mt-5">
            </div>
          </div>
          <div class="intro-x relative flex items-start pb-5">
            <div class="w-6 h-6 shadow-lg flex-none image-fit rounded-full overflow-hidden bg-gray-500 ml-2"></div>
            <div class="px-5 ml-4 flex-1">
              <div class="flex items-center">
                <div class="alert alert-secondary show flex items-center justify-center h-5 p-3 text-sm" role="alert">
                  Not Started
                </div>
                <span class="ml-3 text-gray-500">Founder Approval</span>
              </div>
              <hr class="mt-5">
            </div>
          </div>
          <div class="intro-x relative flex items-start pb-5">
            <div class="w-6 h-6 shadow-lg flex-none image-fit rounded-full overflow-hidden bg-gray-500 ml-2">
            </div>
            <div class="px-5 ml-4 flex-1">
              <div class="flex items-center">
                <div class="alert alert-secondary show flex items-center justify-center h-5 p-3 text-sm" role="alert">
                  Not Started
                </div>
                <span class="ml-3 text-gray-500">Seller Acknowledgement</span>
              </div>
              <hr class="mt-5">
            </div>
          </div>
          <div class="intro-x relative flex items-start pb-5">
            <div class="w-6 h-6 shadow-lg flex-none image-fit rounded-full overflow-hidden bg-gray-500 ml-2"></div>
            <div class="px-5 ml-4 flex-1 accordion-item">
              <div class="flex items-center">
                <div class="flex items-center">
                  <div class="alert alert-warning-soft show flex items-center justify-center h-5 p-3 text-sm" role="alert">
                    <span class="px-4">Pending</span>
                  </div>
                  <span class="text-sm font-bold text-gray-800 ml-3">Support Document</span>
                </div>
                <div class="text-xs text-gray-500 ml-auto">
                  <a href="javascript:;" class="text-pink-800 accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#provenance-1">View Less</a>
                </div>
              </div>
              <div id="provenance-1" class="accordion-collapse collapse show text-gray-600 pt-2">
                <div class="mt-1">Uploader: jane.levine@peaktechnology.com</div>
                <div class="mt-1">Timestamp: 20/04/2021, 10:03</div>
              </div>
              <hr class="mt-5">
            </div>
          </div>
          <div class="intro-x relative flex items-start pb-5">
            <div class="w-6 h-6 shadow-lg flex-none image-fit rounded-full overflow-hidden bg-gray-500 ml-2"></div>
            <div class="px-5 ml-4 flex-1 accordion-item">
              <div class="flex items-center">
                <div class="flex items-center">
                  <div class="alert show flex items-center h-5 p-3 text-sm justify-center text-green-700 bg-green-200" role="alert">
                    <CheckCircleIcon class="w-3 h-3 mr-3" />
                    <span class="pr-3">Verified</span>
                  </div>
                  <span class="text-sm font-bold text-gray-800 ml-3">Invoice Uploaded</span>
                </div>
                <div class="text-xs text-gray-500 ml-auto">
                  <a href="javascript:;" class="text-pink-800 accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#provenance-2">View Less</a>
                </div>
              </div>
              <div id="provenance-2" class="accordion-collapse collapse show text-gray-600 pt-2">
                <div class="mt-1">Uploader: jane.levine@peaktechnology.com</div>
                <div class="mt-1">Timestamp: 21/03/2021, 13:55</div>
              </div>
              <hr class="mt-5">
            </div>
          </div>
        </div>
      </div>
      <div class="intro-y box p-5 mt-5">
        <div class="flex items-center">
          <ListIcon class="w-6 h-6 mr-3" /><span class="text-lg">Batch Details</span>
        </div>
        <div class="mt-8">
          <span>Bank Details</span>
          <table class="table mt-2">
            <tr class="hover:bg-gray-200">
              <td class="border w-1/2">Payment Bank Acc</td>
              <td class="border">MAYBANK 28172919212</td>
            </tr>
          </table>
        </div>
        <div class="mt-5">
          <span>Batch Information</span>
          <table class="table mt-2">
            <tr class="hover:bg-gray-200">
              <td class="border w-1/2">Buyer</td>
              <td class="border">RM 41,000.00</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Seller</td>
              <td class="border">21/03/2021, 13:35</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Seller</td>
              <td class="border">21/03/2021, 13:35</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Seller</td>
              <td class="border">21/03/2021, 13:35</td>
            </tr>
          </table>
        </div>
        <div class="mt-5">
          <span>Formular</span>
          <table class="table mt-2">
            <tr class="hover:bg-gray-200">
              <td class="border w-1/2">Invoice Amount</td>
              <td class="border">RM 41,000.00</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Upload Date & Time</td>
              <td class="border">21/03/2021, 13:35</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Founder Approval Date & TIme</td>
              <td class="border">03/04/2021, 13:35</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">No. of Days Until Payment</td>
              <td class="border">55 Days</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Misc. Fee Rate</td>
              <td class="border">2%</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Misc. Fee Amount</td>
              <td class="border">RM 820.00</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Net Amount to Founder</td>
              <td class="border">RM 41,820.00</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { sysAxios } from '@/plugins/axios';
import moment from 'moment';
import Docments from './Documents'

export default {
  props: {
    batchData: {
      type: String,
      required: true
    }
  },
  components: {
    Docments
  },
  setup(props) {
    const journalBatchEntry = ref();
    const batchData = JSON.parse(props.batchData)
    console.log("batch Detail = ", JSON.parse(props.batchData))
    
    onMounted(async () => {
      const api = `https://journalbatch.bsg-api.tk/api/genie/journalbatch/v1/header/${batchData.journalBatchHeaderId}/entries`;
      sysAxios.get(api).then(res => {
        console.log(res.data)
        journalBatchEntry.value = res.data
      })
    })

    return {
      journalBatchEntry,
      moment,
    }
  },
}
</script>