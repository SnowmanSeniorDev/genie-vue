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
          <Docments :journalBatchHeaderId="item.journalBatchHeaderId" :journalBatchEntryId="item.journalBatchEntryId"/>
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
                  <a href="javascript:" class="text-pink-800 accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#provenance-1">View Less</a>
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
                  <a href="javascript:" class="text-pink-800 accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#provenance-2">View Less</a>
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
              <td class="border w-1/2">Payment Bank Account</td>
              <td class="border">{{batchDetails.bankDetails.bank && batchDetails.bankDetails.bank.bankName}}</td>
            </tr>
          </table>
        </div>
        <div class="mt-5">
          <span>Batch Information</span>
          <table class="table mt-2">
            <tr class="hover:bg-gray-200">
              <td class="border w-1/2">Buyer Company</td>
              <td class="border">{{batchDetails.batchInformation.buyerCompany}}</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Seller Company</td>
              <td class="border">{{batchDetails.batchInformation.sellerCompany ? batchDetails.batchInformation.sellerCompany : 'NA'}}</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Funder Company</td>
              <td class="border">{{batchDetails.batchInformation.funderCompany ? batchDetails.batchInformation.funderCompany : 'NA'}}</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">No of batch entries</td>
              <td class="border">{{batchDetails.batchInformation.noOfBatchEntries}}</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Upload Date</td>
              <td class="border">{{batchDetails.batchInformation.uploadDate}}</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Total Amount</td>
              <td class="border">{{batchDetails.batchInformation.totalAmount}}</td>
            </tr>
          </table>
        </div>
        <div class="mt-5">
          <span>Formular</span>
          <table class="table mt-2">
            <tr class="hover:bg-gray-200">
              <td class="border w-1/2">Interest Rate</td>
              <td class="border">{{batchDetails.formula.interestRate}}</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Processing Fee Rate</td>
              <td class="border">{{batchDetails.formula.processingFeeRate}}</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Processing Fee Amount</td>
              <td class="border">{{batchDetails.formula.processingFeeAmount}}</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Disbursable Amount To Seller</td>
              <td class="border">{{batchDetails.formula.disbursableAmountToSeller}}</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Disbursable Date</td>
              <td class="border">{{batchDetails.formula.disbursableDate}}</td>
            </tr>
            <tr class="hover:bg-gray-200" v-if="user.user_role === 'Buyer Admin' || user.user_role === 'Genie Admin'">
              <td class="border">Misc Fee Rate</td>
              <td class="border">{{batchDetails.formula.miscFeeRate}}</td>
            </tr>
            <tr class="hover:bg-gray-200" v-if="user.user_role === 'Buyer Admin' || user.user_role === 'Genie Admin'">
              <td class="border">Misc Fee Amount</td>
              <td class="border">{{batchDetails.formula.miscFeeAmount}}</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Misc Fee Date</td>
              <td class="border">{{batchDetails.formula.miscFeeDate}}</td>
            </tr>
            <tr class="hover:bg-gray-200" v-if="user.user_role === 'Funder Admin' || user.user_role === 'Genie Admin'">
              <td class="border">Platform Fee Rate</td>
              <td class="border">{{batchDetails.formula.platformFeeRate}}</td>
            </tr>
            <tr class="hover:bg-gray-200" v-if="user.user_role === 'Buyer Admin' || user.user_role === 'Genie Admin'">
              <td class="border">Platform Fee Amount</td>
              <td class="border">{{batchDetails.formula.platformFeeAmount}}</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Platform Fee Date</td>
              <td class="border">{{batchDetails.formula.platformFeeDate}}</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Repayment Amount To Funder</td>
              <td class="border">{{batchDetails.formula.repaymentAmountToFunder}}</td>
            </tr>
            <tr class="hover:bg-gray-200">
              <td class="border">Repayment Date</td>
              <td class="border">{{batchDetails.formula.repaymentDate}}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import moment from 'moment'
import _ from 'lodash'
import { sysAxios } from '@/plugins/axios'
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
    const journalBatchEntry = ref()
    const batchData = JSON.parse(props.batchData)
    const adminCompany = ref()
    const batchDetails = ref({
      bankDetails: {
        bank: null,
      },
      batchInformation: {
        buyerCompany: null,
        sellerCompany: null,
        funderCompany: null,
        noOfBatchEntries: 0,
        uploadDate: moment(batchData.createdTime).format('DD/MM/YYYY'),
        totalAmount: `${batchData.currencyCode} ${batchData.totalAmount}`
      },
      formula: {
        interestRate: batchData.interestRate,
        processingFeeRate: batchData.processingFeeRateForSeller + batchData.processingFeeRateForFunder,
        processingFeeAmount: null,
        disbursableAmountToSeller: null,
        disbursableDate: null,
        miscFeeRate: batchData.processingFeeRateForBuyer,
        miscFeeAmount: null,
        miscFeeDate: null,
        platformFeeRate: batchData.processingFeeRateForFunder,
        platformFeeAmount: null,
        platformFeeDate: null,
        repaymentAmountToFunder: batchData.totalAmount,
        repaymentDate: moment(batchData.paymentDueDate).format('DD/MM/YYYY')
      }
    })
    const store = useStore()
    const user = store.state.auth
    console.log('user = ', user)
    console.log("batch Detail = ", JSON.parse(props.batchData))
    
    onMounted(async () => {
      const api = `https://journalbatch.bsg-api.tk/api/genie/journalbatch/v1/header/${batchData.journalBatchHeaderId}/entries`
      await sysAxios.get(api).then(res => {
        journalBatchEntry.value = res.data
        batchDetails.value.batchInformation.noOfBatchEntries = res.data.length
      })

      const bankApi = `https://companies.bsg-api.tk/api/genie/company/v1/${store.state.account.company_uuid}/bankaccounts`
      await sysAxios.get(bankApi).then(res => {
        batchDetails.value.bankDetails.bank = _.find(res.data, {currency: batchData.currencyCode})
      })

      const batchBuyerApi = `https://companies.bsg-api.tk/api/genie/company/v1/${batchData.buyerCompanyId}`
      await sysAxios.get(batchBuyerApi).then(res => {
        batchDetails.value.batchInformation.buyerCompany = res.data.companyDisplayName
      })

      if(batchData.sellerCompanyId !== '00000000-0000-0000-0000-000000000000'){
        const batchSellerApi = `https://companies.bsg-api.tk/api/genie/company/v1/${batchData.sellerCompanyId}`
        await sysAxios.get(batchSellerApi).then(res => {
          batchDetails.value.batchInformation.sellerCompany = res.data.companyDisplayName
        })
      }
      
      if(batchData.funderCompanyId !== '00000000-0000-0000-0000-000000000000'){
        const batchFunderApi = `https://companies.bsg-api.tk/api/genie/company/v1/${batchData.funderCompanyId}`
        await sysAxios.get(batchFunderApi).then(res => {
          batchDetails.value.batchInformation.funderCompany = res.data.companyDisplayName
        })
      }

      const adminCompanyApi = `configuration/v1/Genie Global Settings`
      await sysAxios.get(adminCompanyApi).then(res => {
        console.log('adminCompany = ', res.data)
        adminCompany.value = _.find(res.data[0].configurations, {name: 'Admin Company Id'}).value
      })

      const processingFeeApi = `https://ledger.bsg-api.tk/api/genie/ledger/v1/paymentinstruction/byworkflowexecutionreferenceyid/${batchData.workflowExecutionReferenceId}`
      await sysAxios.get(processingFeeApi).then(res => {

        console.log(processingFeeApi)
        console.log("taxs = ", res.data)
        var tax = _.find(res.data, {fromCompanyId: batchData.funderCompanyId, toCompanyId: batchData.sellerCompanyId})
        console.log('tax =' , tax)
        console.log("tax.amountBeforeTax = ", tax.amountBeforeTax)
        console.log("batchData.totalAmount = ", batchData.totalAmount)
        batchDetails.value.formula.processingFeeAmount = batchData.totalAmount - tax.amountBeforeTax
        batchDetails.value.formula.disbursableAmountToSeller = tax.amountBeforeTax
        batchDetails.value.formula.disbursableDate = moment(tax.dueDate).format('DD/MM/YYYY')

        var misc = _.find(res.data, {fromCompanyId: adminCompany.value, toCompanyId: batchData.buyerCompanyId})
        batchDetails.value.formula.miscFeeAmount = misc.amountBeforeTax
        batchDetails.value.formula.miscFeeDate = misc.dueDate

        var platformFee = _.find(res.data, {fromCompanyId: batchData.funderCompanyId, toCompanyId: adminCompany.value})
        batchDetails.value.formula.platformFeeAmount = platformFee.amountBeforeTax
        batchDetails.value.formula.platformFeeDate = platformFee.dueDate
      })
    })

    return {
      journalBatchEntry,
      moment,
      batchDetails,
      user
    }
  },
}
</script>