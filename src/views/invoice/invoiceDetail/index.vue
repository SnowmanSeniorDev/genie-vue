<template>
  <div>
    <div class='intro-y flex items-center mt-8 divide-x-2 divide-gray-500 justify-start'>
      <div class='mr-2'>
        <h2 class='text-lg font-medium mr-auto'>Invoice</h2>
      </div>
      <div class='text-lg font-medium mr-auto pl-2'>
        <span class='bg-pink-900 p-1 text-white text-sm'>Batch No: {{batchDetails.batchNumber}}</span>
      </div>
    </div>
    <div class='intro-y box p-5 mt-5'>
      <span class='text-lg'>Document Uploads</span>
      <table class='table table--lg border-l border-r'>
        <thead>
          <tr class='bg-gray-400'>
            <th class='dark:border-dark-5 whitespace-nowrap'> INVOICE NO </th>
            <th class='dark:border-dark-5 whitespace-nowrap'> INVOICE AMOUNT </th>
            <th class='dark:border-dark-5 whitespace-nowrap'> INVOICE DATE </th>
            <th class='dark:border-dark-5 whitespace-nowrap'> PAYMENT DUE DATE </th>
            <th class='dark:border-dark-5 whitespace-nowrap'> UPLOAD DATE </th>

            <th class='dark:border-dark-5 whitespace-nowrap'> ACTIONS </th>
          </tr>
        </thead>
        <tbody v-for='(item, index) in journalBatchEntry' :key='index'>
          <tr>
            <td class='dark:border-dark-5'>{{item.vendorDocumentReferenceNumber}}</td>
            <td class='dark:border-dark-5'>{{item.currencyCode +' '+item.amount.toFixed(2)}}</td>
            <td class='dark:border-dark-5'>{{moment(item.postingDate).local().format(dateFormat)}}</td>
            <td class='dark:border-dark-5'>{{moment(item.dueDate).local().format(dateFormat)}}</td>
            <td class='dark:border-dark-5'>{{moment(item.createdTime).format(dateTimeFormat)}}</td>
            <td class='dark:border-dark-5'>
              <button class='btn btn-primary h-6' @click='accordion(index)'>
                <span v-if='supportingDocumentAccordionIndex.includes(index)'>View More</span>
                <span v-else>View Less</span>
              </button>
            </td>
          </tr>
          <Documents
            v-if='!supportingDocumentAccordionIndex.includes(index)'
            :journalBatchHeaderId='item.journalBatchHeaderId'
            :journalBatchEntryId='item.journalBatchEntryId'
            :entryType='item.documentType'
            :traceId='batchDetails.traceId'
            :documentNumber='item.documentNumber'
          />
        </tbody>
      </table>
    </div>
    <div class='grid grid-cols-2 gap-4 mt-6'>
      <div class='intro-y box p-5 mt-5'>
        <div class='flex items-center'>
          <LockIcon class='w-6 h-6 mr-3' /><span class='text-lg'>Provenance</span>
        </div>
        <img alt='' class='intro-x w-full h-48' :src='require(`@/assets/images/security-cuate.svg`)'/>
        <ProvenanceHisotry
          v-if="initComponent"
          :batchDetails='batchDetails'
          :paymentAdviceWorksStatus='paymentAdviceWorksStatus'
        />
      </div>
      <PublicBatchDetails
        v-if="initComponent && batchDetails.ecosystemId === '00000000-0000-0000-0000-000000000000'"
        :batchDetail='batchDetails'
        :workflowExecutionReferenceId='props.workflowExecutionReferenceId'
        :adminCompany='adminCompany'
      />
      <Eco0BatchDetails
        v-if="initComponent && batchDetails.ecosystemId !== '00000000-0000-0000-0000-000000000000'"
        :batchDetail='batchDetails'
        :workflowExecutionReferenceId='props.workflowExecutionReferenceId'
        :adminCompany='adminCompany'
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import moment from 'moment'
import _ from 'lodash'

import { sysAxios, appAxios } from '@/plugins/axios'
import Documents from './Documents'
import ProvenanceHisotry from './Provenance'
import PublicBatchDetails from './batchDetails/Public.vue'
import Eco0BatchDetails from './batchDetails/Eco0.vue'

export default {
  props: {
    workflowExecutionReferenceId: {
      type: String,
      required: true
    }
  },
  components: {
    Documents,
    ProvenanceHisotry,
    PublicBatchDetails,
    Eco0BatchDetails
  },
  setup(props) {

    const journalBatchEntry = ref()
    const adminCompany = ref()

    const dateFormat = process.env.VUE_APP_DATE_FORMAT
    const dateTimeFormat = process.env.VUE_APP_DATETIME_FORMAT
    const batchDetails = ref({
      batchNumber: null,
      workflowLed: '',
      bankDetails: {
        bank: null,
      },
      batchInformation: {
        bidEndTime: null,
        paymentDueDate: null,
        buyerCompany: null,
        sellerCompany: null,
        funderCompany: null,
        noOfBatchEntries: 0,
        uploadDate: null,
        totalAmount: null,
      },
      formula: {
        interestRate: null,
        processingFeeAmount: null,
        disbursableAmountToSeller: null,
        disbursableDate: null,
        platformFeeRate: null,
        platformFeeAmount: null,
        platformFeeDate: null,
        repaymentAmountToFunder: null,
        repaymentDate: null
      }
    })
    const valueDate = ref()
    const bidValue = ref(null)
    const paymentAdviceWorksStatus = ref([])
    const supportingDocumentAccordionIndex = ref([])
    const initComponent = ref(false)

    const accordion = (index) => {
      if(supportingDocumentAccordionIndex.value.includes(index)) _.remove(supportingDocumentAccordionIndex.value, (item) => {
        return item == index
      })
      else supportingDocumentAccordionIndex.value.push(index)
    }

    const init = async () => {
      //geting invoice detail information
      await appAxios.get(`/journalbatch/v1/header/byworkflowexecutionid/${props.workflowExecutionReferenceId}`).then( res => {

        const batch = {
          ...res.data,
          traceId: res.data.traceId,
          batchInformation: {
            bidEndTime: res.data.bidEndTime,
            paymentDueDate: res.data.paymentDueDate,
            uploadDate: moment.utc(res.data.createdTime).format(dateFormat),
            totalAmount: res.data.totalAmount,
            noOfBatchEntries: res.data.numberOfBatchEntries
          },
          formula: {
            interestRate: res.data.interestRate,
            interestRateDuration: res.data.interestRateDuration,
            platformFeeRate: res.data.processingFeeRateForFunder,
            repaymentAmountToFunder: res.data.totalAmount,
            repaymentDate: moment(res.data.maturityDate).local().format(dateFormat),
            maturityDate: moment(res.data.maturityDate).local().format(dateFormat),
            valueDate: moment(res.data.valueDate).local().format(dateFormat),
            numberOfDays: moment(res.data.maturityDate).diff(moment(res.data.valueDate), 'days')
          }
        }
        batchDetails.value = {...batchDetails.value, ...batch}
      })

      //getting documents of invoice
      journalBatchEntry.value = await appAxios.get(`/journalbatch/v1/header/${batchDetails.value.journalBatchHeaderId}/entries`).then(res => res.data)

      //getting global values to use invoice detail page
      const genieGlobalSetting = `configuration/v1/Genie Global Settings`
      let buyerLedWorkflowId = ''
      let sellerLedWorkflowId = ''

      await sysAxios.get(genieGlobalSetting).then(res => {
        adminCompany.value = _.find(res.data[0].configurations, {name: 'Admin Company Id'}).value
        buyerLedWorkflowId = _.find(res.data[0].configurations, {name: 'Buyer Led Workflow Id V2'}).value
        sellerLedWorkflowId = _.find(res.data[0].configurations, {name: 'Seller Led Workflow Id V2'}).value
        paymentAdviceWorksStatus.value = JSON.parse(_.find(res.data[0].configurations, {name: 'Workflow V2 Status With Payment Advice'}).value)
      })

      //getting buyer and seller workflow id from ecosystem endpoint instead of global config in case the batch is on the private ecosystem
      if(batchDetails.value.ecosystemId !== '00000000-0000-0000-0000-000000000000') {
        const ecosystem = await appAxios.get(`/company/v1/ecosystems/${batchDetails.value.ecosystemId}`).then(res => res.data)
        buyerLedWorkflowId = ecosystem.buyerLedWorkflowId
        sellerLedWorkflowId = ecosystem.buyerLedWorkflowId
      }

      var currentWorkflowStatusesApi = '/workflow/v2/statustransition/retrieve/byreferenceids?visibility=true'
      await appAxios.post(currentWorkflowStatusesApi, [batchDetails.value.workflowExecutionReferenceId]).then(async res => {
        if(res.data[0].rootWorkflowId === buyerLedWorkflowId) batchDetails.value.workflowLed = 'Buyer Led'
        if(res.data[0].rootWorkflowId === sellerLedWorkflowId) batchDetails.value.workflowLed = 'Seller Led'
        return batchDetails.value.workflowLed
      })

    }

    onMounted(async () => {
      await init()
      console.log('batchDetails: ', batchDetails.value)
      initComponent.value = true
    })

    return {
      props,
      adminCompany,
      accordion,
      batchDetails,
      bidValue,
      dateFormat,
      dateTimeFormat,
      initComponent,
      journalBatchEntry,
      moment,
      paymentAdviceWorksStatus,
      supportingDocumentAccordionIndex,
      valueDate,
    }
  },
}
</script>
