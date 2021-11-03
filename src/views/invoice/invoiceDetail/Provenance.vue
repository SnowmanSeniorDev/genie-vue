<template>
  <div v-if='loading' class='py-16'>
    <div class='w-full h-8 px-8'>
      <LoadingIcon icon='spinning-circles' color='gray' class='w-4 h-4 py-8' />
    </div>
  </div>
  <div v-else class='report-timeline mt-5 relative'>
    <div v-for='(item, index) in provenance' class='intro-x relative flex items-start pb-5' :key='index'>
      <div class='w-6 h-6 shadow-lg flex-none image-fit rounded-full overflow-hidden bg-gray-500 ml-2'></div>
      <div class='px-5 ml-4 flex-1'> 
        <div v-if='item.loading' class='flex items-center'>
          <div
            class='alert show flex items-center h-5 p-3 text-sm justify-center alert-secondary'
            role='alert'
          >
            <LoadingIcon icon="puff" color="gray" class="w-3 h-3 mr-2" />
            <span class='pr-3'>Verifying</span> 
          </div>
        </div>
        <div v-else class='flex items-center'>
          <div
            v-if="item.state == 'Completed'"
            :class="`alert show flex items-center h-5 p-3 text-sm justify-center ${item.verified? 'bg-green-200' : 'bg-red-300' }`"
            role='alert'
          >
            <ShieldIcon v-if="item.verified && !item.loading" class="w-3 h-3 mr-3"/>
            <ShieldOffIcon v-else class="w-3 h-3 mr-3" />
            <span v-if="item.loading" class="pr-3">
              <span>Verifying</span>
            </span>
            <span v-else>
              <span v-if="item.verified">Verified</span>
              <span v-else>Not Verified</span>
            </span>
          </div> 
          <div
            v-else
            :class="`alert show flex items-center h-5 p-3 text-sm justify-center ${item.firstPending ? 'bg-yellow-200' : 'bg-gray-200'}`"
            role='alert' 
          >
            <SendIcon class='w-3 h-3 mr-3'/>
            <span v-if="item.firstPending" class='pr-3'>Pending</span>
            <span v-else class='pr-3'>Not Started</span>
          </div>
          <div class='items-center'>
            <span class='font-bold ml-3'>{{ProvenanceLang[item.statusName]}}</span> 
            <div v-if='item.updateTime != undefined' class='text-gray-500 ml-3'>Updated On :  {{moment(item.updateTime).format(dateTimeFormat)}}</div>
            <div class='text-gray-500 ml-3' v-if="batchDetails.bidEndTime != undefined && item.statusName=='INVITATION_SEND_TO_FUNDERS'">
              Approval by : {{moment(batchDetails.bidEndTime).format(dateTimeFormat)}}
            </div>
          </div>
        </div>
        <hr class='mt-5' />
      </div>
    </div>
  </div>
</template>
<script>

import {ref, onMounted} from 'vue'
import moment from 'moment'

import ProvenanceLang from '@/utils/provenanceLanguage'
import { sysAxios, appAxios } from '@/plugins/axios'

export default {
  props: {
    batchDetails: {
      type: Object,
      required: true
    },
    paymentAdviceWorksStatus: {
      type: Object,
      required: true
    },
  },
  setup(props) {
    const loading = ref(true)
    const provenance = ref([])
    const batchDetails = ref(props.batchDetails)
    const paymentAdviceWorksStatus = ref(props.paymentAdviceWorksStatus)
    const lastWorkStatus = ref(props.lastWorkStatus)
    const provenancePendingStatusIndex = ref(0)
    const verifyRequestBody = ref({
      batchId: props.batchDetails.batchNumber,
      batchTotal: props.batchDetails.batchInformation.totalAmount,
      batchCurrency: props.batchDetails.currencyCode,
      batchEntriesBreakup: [{
        entryType: 'INV',
        entryQuantity: props.batchDetails.numberOfBatchEntries
      }],
      batchEntries: [],
      TransactionWorkflowStatuses: []
    })
    const dateTimeFormat = process.env.VUE_APP_DATETIME_FORMAT

    const getLastWorkflowStatus = async() => {
      const api = '/workflow/v2/statustransition/retrieve/byreferenceids/limittolaststatustransition'
      await appAxios.post(api, [batchDetails.value.workflowExecutionReferenceId]).then(res => {
        lastWorkStatus.value = res.data[0].workflow.lastStatusTransition
      })

      return new Promise(resolve => resolve('get last workflow status done'))
    }

    const provenanceApi = async() => {
      await getLastWorkflowStatus()
      var currentWorkflowStatusesApi = '/workflow/v2/statustransition/retrieve/byreferenceids?visibility=true'
      await appAxios.post(currentWorkflowStatusesApi, [batchDetails.value.workflowExecutionReferenceId]).then(async res => {
        paymentAdviceWorksStatus.value = _.find(paymentAdviceWorksStatus.value, {WorkflowId: res.data[0].rootWorkflowId}).StatusNames 
        provenancePendingStatusIndex.value = res.data[0].workflows.length
        _.map(res.data[0].workflows, (item) => {
          let subProvenance = item.statusTransitions
          subProvenance = subProvenance.sort((a, b) => {
            if(a.order === b.order) return 0
            else if(a.order > b.order) return 1
            else return -1
          })
          provenance.value.push(...subProvenance)
        })

        for(var i=0; i<provenance.value.length - 1; i++) {
          if( provenance.value[i].statusName === lastWorkStatus.value.statusName ) provenance.value[i + 1]['firstPending'] = true
        }
      })
      
      const paymentAdviceData = await appAxios.get(`/ledger/v1/paymentadvice/byworkflowexecutionreferenceid/${batchDetails.value.workflowExecutionReferenceId}`).then(res => {
        return res.data
      })
      await Promise.all(
        provenance.value.map(async status => {
          var paymentAdvice = null
          if(status.state === 'Completed') {
            if(paymentAdviceWorksStatus.value.includes(status.statusName) && paymentAdviceData.length) {
              let paymentAdviceEntity = paymentAdviceData.filter((workflow) => {
                return workflow.extraData.workflowStatusName === status.statusName
              })
              if(paymentAdviceEntity.length){
                await sysAxios.get(`${paymentAdviceEntity[0].paymentAdviceUri}/info`).then(res => {
                  paymentAdvice = {paymentAdviceFileName: res.data.fileName, dataHash: {...res.data.dataHash}}
                })
                verifyRequestBody.value.TransactionWorkflowStatuses.push({
                  'status': status.statusName,
                  'datetimeutc': moment(status.updateTime).valueOf(),
                  'identity': status.updateBy,
                  'paymentAdvice': {...paymentAdvice},
                })
              }
            } else {
              verifyRequestBody.value.TransactionWorkflowStatuses.push({
                'status': status.statusName,
                'datetimeutc': moment(status.updateTime).valueOf(),
                'identity': status.updateBy,
                'paymentAdvice': null,
              })
            }
          }
        })
      )
      let workStatusList = []
      verifyRequestBody.value.TransactionWorkflowStatuses.forEach(async (workStatus, index) => {
        workStatusList = []
        provenance.value[index].loading= true
        Object.keys(workStatus).forEach(async k => (workStatus[k] == null || typeof workStatus[k] == 'undefined') && delete workStatus[k])

        workStatusList.push(workStatus)
        await sysAxios.post(`/traceability/v2/verify/journalbatch/${batchDetails.value.traceId}/status`, workStatusList ).then(res => {
          provenance.value[index].verified = res.data[0].verificationStatus
          provenance.value[index].loading= false
          if(!res.data[0].verificationStatus) {
            errorStepsMsg.value ='Data Verification failed, the Database data has been compromise. Please contact Genie Support for further action.'
            return
          }
        })
      })
      return new Promise(resolve => resolve('provenance api function done'))
    }

    const init = async() => {
      await provenanceApi()
      loading.value = false
    }
    onMounted(() => {
      init()
    })
    return {
      loading,
      provenance,
      ProvenanceLang,
      moment,
      dateTimeFormat
    }
  },
}
</script>
