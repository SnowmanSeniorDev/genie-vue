<template>
  <div>
    <div class="intro-y flex items-center mt-8 divide-x-2 divide-gray-500 justify-start">
      <div class="mr-2">
        <h2 class="text-lg font-medium mr-auto">Invoice</h2>
      </div>
      <div class="text-lg font-medium mr-auto pl-2">
        <span class="bg-pink-900 p-1 text-white text-sm">Branch No: {{batchDetails.batchNumber}}</span>
      </div>
    </div>
    <div class="intro-y box p-5 mt-5">
      <span class="text-lg">Document Uploads</span>
      <table class="table table--lg border-l border-r">
        <thead>
          <tr class="bg-gray-400">
            <th class="dark:border-dark-5 whitespace-nowrap"> BATCH REF NO </th>
            <th class="dark:border-dark-5 whitespace-nowrap"> INVOICE DATE </th>
            <th class="dark:border-dark-5 whitespace-nowrap"> INVOICE AMOUNT </th>
            <th class="dark:border-dark-5 whitespace-nowrap"> PAYMENT DUE DATE </th>
            <th class="dark:border-dark-5 whitespace-nowrap"> UPLOAD DATE </th>
            
            <th class="dark:border-dark-5 whitespace-nowrap"> ACTIONS </th>
          </tr>
        </thead>
        <tbody v-for="(item, index) in journalBatchEntry" :key="index">
          <tr>
            <td class="dark:border-dark-5">{{item.vendorDocumentReferenceNumber}}</td>
            <td class="dark:border-dark-5">{{item.currencyCode +" "+item.amount.toFixed(2)}}</td>
            <td class="dark:border-dark-5">{{moment(item.postingDate).format(dateFormat)}}</td>
            <td class="dark:border-dark-5">{{moment(item.dueDate).format(dateFormat)}}</td>
            <td class="dark:border-dark-5">{{moment(item.createdTime).format(dateTimeFormat)}}</td>
            <td class="dark:border-dark-5">
              <button class="btn btn-primary h-6" @click="accordion(index)">
                <span v-if="supportingDocumentAccordionIndex.includes(index)">View More</span>
                <span v-else>View Less</span>
              </button>
            </td>
          </tr>
          <Docments v-if="!supportingDocumentAccordionIndex.includes(index)" :journalBatchHeaderId="item.journalBatchHeaderId" :journalBatchEntryId="item.journalBatchEntryId"/>
        </tbody>
      </table>
    </div>
    <div class="grid grid-cols-2 gap-4 mt-6">
      <div class="intro-y box p-5 mt-5">
        <div class="flex items-center">
          <LockIcon class="w-6 h-6 mr-3" /><span class="text-lg">Provenance</span>
        </div>
        <img alt="" class="intro-x w-full h-48" :src="require(`@/assets/images/illustration.svg`)"/>
        <div v-if="loading.provenance" class="py-16">
          <div class="w-full h-8 px-8">
            <LoadingIcon icon="spinning-circles" color="gray" class="w-4 h-4 py-8" />
          </div>
        </div>
        <div v-else class="report-timeline mt-5 relative">
          <div v-for="(item, index) in provenance" class="intro-x relative flex items-start pb-5" :key="index">
            <div class="w-6 h-6 shadow-lg flex-none image-fit rounded-full overflow-hidden bg-gray-500 ml-2"></div>
            <div class="px-5 ml-4 flex-1"> 
                <div v-if="item.loading" class="flex items-center">
                  <div
                   
                  class="alert show flex items-center h-5 p-3 text-sm justify-center alert-secondary"
                  role="alert"
                >
                  <ShieldOffIcon class="w-3 h-3 mr-3" />
                  <span class="pr-3">Verifying</span> 
                </div>
                </div>
                <div v-else class="flex items-center">
                <div
                  v-if="item.passed && item.verified"
                  :class="'alert show flex items-center h-5 p-3 text-sm justify-center ' + ((lastWorkStatus.statusName === item.statusName)? 'text-black-700 bg-yellow-200':'text-black-700 bg-green-200' )"
                  role="alert"
                >
                  <SendIcon v-if="lastWorkStatus.statusName === item.statusName" class="w-3 h-3 mr-3" />
                  <ShieldIcon v-else class="w-3 h-3 mr-3"/>
                  
                  <span class="pr-3">{{lastWorkStatus.statusName === item.statusName ? 'Pending' : 'Verified'}}</span>
                </div>
                <div
                  v-else-if="item.passed && !item.verified"
                  class="alert show flex items-center h-5 p-3 text-sm justify-center text-black-700 bg-red-200"
                  role="alert"
                >
                  <ShieldOffIcon class="w-3 h-3 mr-3" />
                  <span class="pr-3">Not Verified</span>
                </div>
                <div
                  v-else
                  :class="`alert show flex items-center h-5 p-3 text-sm justify-center ${lastWorkStatus.statusName === item.statusName ? 'alert-warning-soft' : 'alert-secondary'}`"
                  role="alert" 
                >
                  <SendIcon class="w-3 h-3 mr-3"/>
                  <span class="pr-3">Not Started</span>
                </div>
                <div class="items-center">
                  <span class="font-bold ml-3">{{ProvenanceLang[item.statusName]}}</span> 
                  <div v-if="item.updateTime != undefined" class="text-gray-500 ml-3">Updated On :  {{moment(item.updateTime).format(dateTimeFormat)}}</div>
                  <div  class="text-gray-500 ml-3" v-if="batchDetails.bidEndTime != undefined && item.statusName=='BIDDING_IN_PROGRESS'">
                    Awarded by : {{moment(batchDetails.bidEndTime).format(dateTimeFormat)}}
                  </div>
                </div>
                </div> 
              <hr class="mt-5">
            </div>
          </div>
        </div>
      </div>
      <div class="intro-y box p-5 mt-5">
        <div class="flex items-center">
          <ListIcon class="w-6 h-6 mr-3" /><span class="text-lg">Batch Details: {{batchDetails.workflowLed}}</span>
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
            <tr class="hover:bg-gray-200" v-if="_.find(provenance, {statusName: 'AWAITING_BIDDING_RESULT'})?.passed">
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
              <td class="border">{{batchDetails.currencyCode + ' ' + batchDetails.batchInformation.totalAmount}}</td>
            </tr>
          </table>
        </div>
         <div class="mt-8" v-if="_.find(provenance, {statusName: 'AWAITING_FUNDER_FIRST_DISBURSEMENT'})?.passed || _.find(provenance, {statusName: 'AWAITING_FUNDER_DISBURSEMENT'})?.passed">
          <span>Bank Details</span>
          <table class="table mt-2">
            <tr class="hover:bg-gray-200">
              <td class="border w-1/2">Payment Bank Account</td>
              <td class="border">{{batchDetails.bankDetails.bank && batchDetails.bankDetails.bank.bankName}}</td>
            </tr>
          </table>
        </div>

        <div class="mt-5" v-if="_.find(provenance, {statusName: 'AWAITING_FUNDER_FIRST_DISBURSEMENT'})?.passed || _.find(provenance, {statusName: 'AWAITING_FUNDER_DISBURSEMENT'})?.passed">
          <span>Formular</span>
          <table class="table mt-2">
            <tr class="hover:bg-gray-200">
              <td class="border w-1/2">Interest Rate (Annual Rate %)</td>
              <td class="border">{{batchDetails.formula.interestRate}}</td>
            </tr>
              <tr class="hover:bg-gray-200">
                <td class="border">Interest Earn</td>
                <td class="border">{{batchDetails.currencyCode}} {{batchDetails.formula.interestAmount}}</td>
              </tr> 
              <tr class="hover:bg-gray-200">
                <td class="border">Platform Fee Amount</td>
                <td class="border">{{batchDetails.currencyCode}} {{batchDetails.formula.platformFeeAmount}}</td>
              </tr> 
              <tr class="hover:bg-gray-200">
                <td class="border">First Disbursable Amount To Seller by {{batchDetails.formula.disburableAmount1DueDate}}</td>
                <td class="border">{{batchDetails.currencyCode}} {{batchDetails.formula.disbursableAmount1}}</td>
              </tr>  
              <tr class="hover:bg-gray-200">
                <td class="border">Second Disbursable Amount To Seller by {{batchDetails.formula.disburableAmount2DueDate}}</td>
                <td class="border">{{batchDetails.currencyCode}} {{batchDetails.formula.disbursableAmount2}}</td>
              </tr>  
              <tr class="hover:bg-gray-200">
                <td class="border">Repayment Amount To Funder</td>
                <td class="border">{{batchDetails.currencyCode}} {{batchDetails.formula.repaymentAmountToFunder}}</td>
              </tr> 
            <tr class="hover:bg-gray-200">
              <td class="border">Repayment Date</td>
              <td class="border">{{batchDetails.formula.repaymentDate}}</td>
            </tr>
          </table>
        </div>
        <div v-if="initComponent">
          <div v-if="visibleWorkflowActions.visibleApproveButton" class="pt-8 flex justify-center">
            <a href="javascript:;" data-toggle="modal" data-target="#decline-invoice-modal" class="btn btn-secondary w-48 sm:w-auto mr-2" >Decline</a>
            <a href="javascript:;" data-toggle="modal" data-target="#approve-invoice-modal" class="btn btn-primary w-48 sm:w-auto mr-2" >Approve</a>
          </div>
          <div v-if="visibleWorkflowActions.visibleSubmitProposal" class="pt-8 flex justify-center">
            <a href="javascript:;" data-toggle="modal" data-target="#submit-proposal-modal" class="btn btn-primary w-48 sm:w-auto mr-2" >Submit Proposal</a>
          </div>
          <div v-if="visibleWorkflowActions.visibleSubmitDisbursmentAdvice" class="pt-8 flex justify-center">
            <a href="javascript:;" data-toggle="modal" data-target="#submit-disbursment-modal" class="btn btn-primary w-48 sm:w-auto mr-2" >Submit Disbursment</a>
          </div>
          <div v-if="visibleWorkflowActions.visibleSellerAcknowledgeOfReceiveDisbursement" class="pt-8 flex justify-center">
            <a href="javascript:;" @click="openSellerAcknowledgeOfReceiveDisbursementModel" class="btn btn-primary w-48 sm:w-auto mr-2" >Acknowledge Receive of Disbursement</a>
          </div>
          <div v-if="visibleWorkflowActions.visibleBuyerUploadRepaymentAdvice" class="pt-8 flex justify-center">
            <a href="javascript:;" data-toggle="modal" data-target="#buyer-upload-repayment-advice" class="btn btn-primary w-48 sm:w-auto mr-2" >Upload Repayment Advice</a>
          </div>
          <div v-if="visibleWorkflowActions.visibleFunderAcknowledgeRepaymentAdvice" class="pt-8 flex justify-center">
            <a href="javascript:;" @click="openFunderAcknowledgeUploadRepaymentAdviceModel" class="btn btn-primary w-48 sm:w-auto mr-2" >Acknowledge Repayment Advice</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="approve-invoice-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- BEGIN: Modal Header -->
        <div class="modal-header">
          <h2 class="font-medium text-base mr-auto"> Approve Invoice </h2>
        </div>
        <!-- END: Modal Header -->
        <div class="modal-body mx-8">
          <div class="grid grid-cols-2 grid-flow-row gap-4">
            <div class="self-center">Batch Number</div>
            <div class="self-center">{{batchDetails.batchNumber}}</div>
            <div class="self-center">Invoice Uploaded Date</div>
            <div class="self-center">{{moment(batchDetails.batchInformation.uploadDate).format(dateFormat)}}</div>
            <div class="self-center">Invoice Amount</div>
            <div class="self-center">{{batchDetails.currencyCode}} {{batchDetails.batchInformation.totalAmount}}</div>
            <div class="self-center">Payment Due Date</div>
            <div class="self-center">{{moment(batchDetails.batchInformation.paymentDueDate).format(dateFormat)}}</div>
            <div class="self-center">Remark</div>
            <div class="self-center">
              <textarea v-model="remark" class="border-2 border w-full" rows="3" />
            </div>
          </div>
          <signature-pad
            :modelValue="signatureFile"
            @input="onInput"
            :height="150"
            :customStyle="{ border: 'gray 1px solid', borderRadius: '25px', width: '100%' }"
            saveType="image/png"
            saveOutput="file"
            ref="signaturePad" />
          <div class="grid grid-cols-3 grid-flow-row gap-4 mt-2">
            <button @click="undoSignature" class="btn btn-warning">Undo signature</button>
            <button @click="clearSignature" class="btn btn-danger">Clear signature</button>
          </div>
        </div>
        <div class="modal-footer text-right">
          <button type="button" class="btn btn-primary w-24 mr-1" @click="approveAcknowledge" :disabled="modalLoading">
            Approve
            <LoadingIcon v-if="modalLoading" icon="oval" color="white" class="w-4 h-4 ml-2" />
          </button>
          <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-20"> Cancel </button>
        </div> <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
  <div id="decline-invoice-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- BEGIN: Modal Header -->
        <div class="modal-header">
          <h2 class="font-medium text-base mr-auto"> Decline Invoice </h2>
        </div>
        <!-- END: Modal Header -->
        <div class="modal-body mx-8">
          <div class="grid grid-cols-2 grid-flow-row gap-4">
            <div class="self-center">Batch Number</div>
            <div class="self-center">{{batchDetails.batchNumber}}</div>
            <div class="self-center">Invoice Uploaded Date</div>
            <div class="self-center">{{moment(batchDetails.batchInformation.uploadDate).format(dateFormat)}}</div>
            <div class="self-center">Invoice Amount</div>
            <div class="self-center">{{batchDetails.batchInformation.totalAmount}}</div>
            <div class="self-center">Payment Due Date</div>
            <div class="self-center">{{moment(batchDetails.batchInformation.paymentDueDate).format(dateFormat)}}</div>
            <div class="self-center">Remark</div>
            <div class="self-center">
              <textarea v-model="remark" class="border-2 border w-full" rows="3" />
            </div>
          </div>
        </div>
        <div class="modal-footer text-right">
          <button type="button" class="btn btn-primary w-20 mr-1" @click="declineAcknowledge"> Decline </button>
          <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-20"> Cancel </button>
        </div> <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
  <div id="submit-proposal-modal" class="modal" tabindex="-1" aria-hidden="true" v-if="initComponent">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- BEGIN: Modal Header -->
        <div class="modal-header">
          <h2 class="font-medium text-base mr-auto"> Submit Proposal </h2>
        </div>
        <!-- END: Modal Header -->
        <div class="modal-body mx-8">
          <div class="mt-5">
            <span>Formular</span>
            <table class="table mt-2"> 
              <tr class="hover:bg-gray-200">
                <td class="border">Batch Number</td>
                <td class="border">{{batchDetails.batchNumber}}</td>
              </tr>
              <tr class="hover:bg-gray-200">
                <td class="border">Total Invoice Amount</td>
                <td class="border">{{batchDetails.currencyCode}} {{batchDetails.totalAmount}}</td>
              </tr> 
              <tr class="hover:bg-gray-200">
                <td class="border">Value Date</td>
                <td class="border">
                  <Litepicker
                  v-model="valueDate"
                  :options="{
                    autoApply: false,
                    showWeekNumbers: true,
                    zIndex: 10001,
                    minDate: moment(batchDetails.batchInformation.bidEndTime).format(dateFormat),
                    dropdowns: {
                      minYear: 1990,
                      maxYear: null,
                      months: true,
                      years: true
                    },
                    callback:getEstimateCalc(),
                    lockDays: lockDays
                  }"
                  class="form-control"
                />
                </td>
              </tr>
              <tr class="hover:bg-gray-200">
                <td class="border">Invoice Due Date</td>
                <td class="border">{{moment(batchDetails.paymentDueDate).format(dateFormat)}}</td>
              </tr>
              <tr class="hover:bg-gray-200">
                <td class="border">Payment Due Date</td>
                <td class="border">{{moment(batchDetails.paymentDueDate).format(dateFormat)}}</td>
              </tr> 
              <tr class="hover:bg-gray-200">
                <td class="border">Numbers of Days</td>
                <td class="border">{{batchDetails.numberOfDays}}</td>
              </tr>  
              <tr class="hover:bg-gray-200">
                <td class="border">Interest Rate(Annual Rate %)</td>
                <td class="border">
                  <input type="text" v-model="bidValue" @change="getEstimateCalc" class="form-control"/>
                </td>
              </tr>  
              <tr class="hover:bg-gray-200">
                <td class="border">Interest Earn</td>
                <td class="border">{{batchDetails.currencyCode}} {{batchDetails.formula.interestAmount}}</td>
              </tr> 
              <tr class="hover:bg-gray-200">
                <td class="border">Platform Fee Amount</td>
                <td class="border">{{batchDetails.currencyCode}} {{batchDetails.formula.platformFeeAmount}}</td>
              </tr> 
              <tr class="hover:bg-gray-200">
                <td class="border">First Disbursable Amount To Seller by {{batchDetails.formula.disburableAmount1DueDate}}</td>
                <td class="border">{{batchDetails.currencyCode}} {{batchDetails.formula.disbursableAmount1}}</td>
              </tr>  
              <tr class="hover:bg-gray-200">
                <td class="border">Second Disbursable Amount To Seller by {{batchDetails.formula.disburableAmount2DueDate}}</td>
                <td class="border">{{batchDetails.currencyCode}} {{batchDetails.formula.disbursableAmount2}}</td>
              </tr>  
              <tr class="hover:bg-gray-200">
                <td class="border">Repayment Amount To Funder</td>
                <td class="border">{{batchDetails.currencyCode}} {{batchDetails.formula.repaymentAmountToFunder}}</td>
              </tr> 
            </table>
          </div> 
        </div>
        <div class="modal-footer text-right">
          <button type="button" class="btn btn-primary w-24 mr-1" @click="submitProposal" :disabled="modalLoading"> 
            Confirm
            <LoadingIcon v-if="modalLoading" icon="oval" color="white" class="w-4 h-4 ml-2" />
          </button>
          <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-20"> Cancel </button>
        </div> <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
  <div id="submit-disbursment-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- BEGIN: Modal Header -->
        <div class="modal-header">
          <h2 class="font-medium text-base mr-auto"> Upload fund disbursment payment advice </h2>
        </div>
        <!-- END: Modal Header -->
        <div class="modal-body mx-8">
          <div>Payment Advice File Upload</div>
          <div v-bind="getRootProps()" class="flex mb-3 justify-center border-red-400 border-dashed border-2 rounded-lg cursor-pointer">
            <div class="text-center py-5">
              <template v-if="!files">
                <input v-bind="getInputProps()" >
                <UploadCloudIcon class="w-24 h-20 text-red-400" />
                <div class="text-lg font-medium text-gray-600"> 
                  Drag and drop here<br>or
                </div>
                <div class="text-red-400">browse</div>
              </template>
              <template v-else>
                <div class="relative">
                  <div class="absolute top-0 right-1">
                    <XCircleIcon @click="removeFile" class="w-6 h-6" />
                  </div>
                  <FileTextIcon class="w-24 h-24"/>
                </div>
                {{files[0].name}}
              </template>
            </div>
          </div>
          <div class="grid grid-cols-2 grid-flow-row gap-4">
            
            <div class="self-center">Payment Advice Number</div>
            <div class="self-center">
              <input type="text" v-model="disbursementData.paymentAdviceNumber" class="form-control"/>
            </div>
            <div class="self-center">Payment Advice Amount</div>
            <div class="self-center">
              <input type="text" v-model="disbursementData.paymentAdviceAmount" class="form-control"/>
            </div>
            <div class="self-center">Currency Code</div>
            <div class="dropdown inline-block" data-placement="bottom">
              <button class="dropdown-toggle btn btn-primary mr-1" aria-expanded="false"> {{disbursementData.currencyCode}} </button>
              <div class="dropdown-menu" id="currencyCodeDropDown" style="z-index: 10001;">
                <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
                  
                  <a v-for="(currency, index) in currencies" :key="index"
                    href="javascript:;"
                    class="block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                    @click="setDisbursmentCurrencyCode(currency.currencyCode)"
                  >
                    {{currency.currencyCode}}
                  </a>
                </div>
              </div>
            </div>  
            <div class="self-center">Payment Advice Date</div>
            <div class="self-center">
              <Litepicker
                v-model="disbursementData.paymentAdviceDate"
                :options="{
                  autoApply: false,
                  showWeekNumbers: true,
                  zIndex: 10001,
                  minDate: moment(batchDetails.batchInformation.bidEndTime).format(dateFormat),
                  dropdowns: {
                    minYear: 1990,
                    maxYear: null,
                    months: true,
                    years: true
                  }
                }"
                class="form-control"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer text-right">
          <button type="button" class="btn btn-primary w-24 mr-1" @click="submitDisbursmentAdvice" :disabled="modalLoading">
            Submit
            <LoadingIcon v-if="modalLoading" icon="oval" color="white" class="w-4 h-4 ml-2" />
          </button>
          <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-24"> Cancel </button>
        </div> <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
  <div id="seller-acknowledge-of-receive-disbursement" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg" v-if="confirmAbleDisbursementData">
      <div class="modal-content">
        <!-- BEGIN: Modal Header -->
        <div class="modal-header">
          <h2 class="font-medium text-base mr-auto"> Acknowledge receive of disbursement </h2>
        </div>
        <!-- END: Modal Header -->
        <div class="modal-body mx-8">
          <div class="grid grid-cols-2 grid-flow-row gap-4">
            <div class="self-center">Payment Advice Number</div>
            <div class="self-center">{{confirmAbleDisbursementData.paymentAdviceNumber}}</div>
            <div class="self-center">Payment Advice File</div>
            <div class="self-center">{{confirmAbleDisbursementData.paymentAdviceNumber}}</div>
            <div class="self-center">Payment Advice Amount</div>
            <div class="self-center">{{confirmAbleDisbursementData.paymentAdviceAmount + ' ' + confirmAbleDisbursementData.currencyCode}}</div>
            <div class="self-center">Payment Advice Date</div>
            <div class="self-center">{{moment(confirmAbleDisbursementData.paymentAdviceDate).format(dateFormat)}}</div>
            <div class="self-center">Remark</div>
            <div class="self-center">
              <textarea v-model="remark" class="border-2 border w-full" rows="3" />
            </div>
          </div>
          <signature-pad
            :modelValue="signatureFile"
            @input="onInput"
            :height="150"
            :customStyle="{ border: 'gray 1px solid', borderRadius: '25px', width: '100%' }"
            saveType="image/png"
            saveOutput="file"
            ref="signaturePad" />
          <div class="grid grid-cols-2 grid-flow-row gap-4 mt-2">
            <button @click="undoSignature" class="btn btn-warning">Undo signature</button>
            <button @click="clearSignature" class="btn btn-danger">Clear signature</button>
          </div>
        </div>
        <div class="modal-footer text-right">
          <button type="button" class="btn btn-primary w-24 mr-1" @click="sellerAcknowledgeOfReceiveDisbursement" :disabled="modalLoading">
            Confirm
            <LoadingIcon v-if="modalLoading" icon="oval" color="white" class="w-4 h-4 ml-2" />
          </button>
          <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-20"> Cancel </button>
        </div> <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
  <div id="buyer-upload-repayment-advice" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- BEGIN: Modal Header -->
        <div class="modal-header">
          <h2 class="font-medium text-base mr-auto"> Upload Repayment Advice </h2>
        </div>
        <!-- END: Modal Header -->
        <div class="modal-body mx-8">
          <div>Payment Advice File Upload</div>
          <div v-bind="getRootProps()" class="flex mb-3 justify-center border-red-400 border-dashed border-2 rounded-lg cursor-pointer">
            <div class="text-center py-5">
              <template v-if="!files">
                <input v-bind="getInputProps()" >
                <UploadCloudIcon class="w-24 h-20 text-red-400" />
                <div class="text-lg font-medium text-gray-600"> 
                  Drag and drop here<br>or
                </div>
                <div class="text-red-400">browse</div>
              </template>
              <template v-else>
                <div class="relative">
                  <div class="absolute top-0 right-1">
                    <XCircleIcon @click="removeFile" class="w-6 h-6" />
                  </div>
                  <FileTextIcon class="w-24 h-24"/>
                </div>
                {{files[0].name}}
              </template>
            </div>
          </div>
          <div class="grid grid-cols-2 grid-flow-row gap-4">
            
            <div class="self-center">Payment Advice Number</div>
            <div class="self-center">
              <input type="text" v-model="disbursementData.paymentAdviceNumber" class="form-control"/>
            </div>
            <div class="self-center">Payment Advice Amount</div>
            <div class="self-center">
              <input type="text" v-model="disbursementData.paymentAdviceAmount" class="form-control"/>
            </div>
            <div class="self-center">Currency Code</div>
            <div class="dropdown inline-block" data-placement="bottom">
              <button class="dropdown-toggle btn btn-primary mr-1" aria-expanded="false"> {{disbursementData.currencyCode}} </button>
              <div class="dropdown-menu" id="currencyCodeDropDown" style="z-index: 10001;">
                <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
                  
                  <a v-for="(currency, index) in currencies" :key="index"
                    href="javascript:;"
                    class="block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                    @click="setDisbursmentCurrencyCode(currency.currencyCode)"
                  >
                    {{currency.currencyCode}}
                  </a>
                </div>
              </div>
            </div>  
            <div class="self-center">Payment Advice Date</div>
            <div class="self-center">
              <Litepicker
                v-model="disbursementData.paymentAdviceDate"
                :options="{
                  autoApply: false,
                  showWeekNumbers: true,
                  zIndex: 10001,
                  minDate: moment(batchDetails.batchInformation.bidEndTime).format(dateFormat),
                  dropdowns: {
                    minYear: 1990,
                    maxYear: null,
                    months: true,
                    years: true
                  }
                }"
                class="form-control"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer text-right">
          <button type="button" class="btn btn-primary w-24 mr-1" @click="BuyerUploadRepaymentAdvice" :disabled="modalLoading">
            Submit
            <LoadingIcon v-if="modalLoading" icon="oval" color="white" class="w-4 h-4 ml-2" />
          </button>
          <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-24"> Cancel </button>
        </div> <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
  <div id="funder-acknowledge-upload-repayment-advice" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg" v-if="confirmFunderAcknowledgeReceiveOfRepaymentData">
      <div class="modal-content">
        <!-- BEGIN: Modal Header -->
        <div class="modal-header">
          <h2 class="font-medium text-base mr-auto"> Acknowledge Receive of Repayment </h2>
        </div>
        <!-- END: Modal Header -->
        <div class="modal-body mx-8">
          <div class="grid grid-cols-2 grid-flow-row gap-4">
            <div class="self-center">Payment Advice Number</div>
            <div class="self-center">{{confirmFunderAcknowledgeReceiveOfRepaymentData.paymentAdviceNumber}}</div>
            <div class="self-center">Payment Advice File</div>
            <div class="self-center">{{confirmFunderAcknowledgeReceiveOfRepaymentData.paymentAdviceNumber}}</div>
            <div class="self-center">Payment Advice Amount</div>
            <div class="self-center">{{confirmFunderAcknowledgeReceiveOfRepaymentData.paymentAdviceAmount + ' ' + confirmFunderAcknowledgeReceiveOfRepaymentData.currencyCode}}</div>
            <div class="self-center">Payment Advice Date</div>
            <div class="self-center">{{moment(confirmFunderAcknowledgeReceiveOfRepaymentData.paymentAdviceDate).format(dateFormat)}}</div>
            <div class="self-center">Remark</div>
            <div class="self-center">
              <textarea v-model="remark" class="border-2 border w-full" rows="3" />
            </div>
          </div>
          <signature-pad
            :modelValue="signatureFile"
            @input="onInput"
            :height="150"
            :customStyle="{ border: 'gray 1px solid', borderRadius: '25px', width: '100%' }"
            saveType="image/png"
            saveOutput="file"
            ref="signaturePad" />
          <div class="grid grid-cols-2 grid-flow-row gap-4 mt-2">
            <button @click="undoSignature" class="btn btn-warning">Undo signature</button>
            <button @click="clearSignature" class="btn btn-danger">Clear signature</button>
          </div>
        </div>
        <div class="modal-footer text-right">
          <button type="button" class="btn btn-primary w-24 mr-1" @click="funderAcknowledgeOfRepaymentComfirm" :disabled="modalLoading"> Confirm </button>
          <button type="button" class="btn btn-danger w-24 mr-1" @click="funderAcknowledgeOfRepaymentDecline"> Decline </button>
          <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-20"> Cancel </button>
        </div> <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
  <div id="failed-notification-content" class="toastify-content hidden flex">
        <XCircleIcon class="text-theme-6" />
        <div class="ml-4 mr-4">
          <div class="font-medium">Upload failed!</div>
          <div class="text-gray-600 mt-1" id="error-content">{{uploadErrorMessage}}.</div>
        </div>
      </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import SignaturePad from "vue3-signature-pad";
import moment from 'moment'
import _ from 'lodash'
import { sysAxios, appAxios } from '@/plugins/axios'
import Docments from './Documents'
import { useDropzone } from 'vue3-dropzone';
import ProvenanceLang from '@/utils/provenanceLanguage'
import Toastify from "toastify-js";

export default {
  props: {
    workflowExecutionReferenceId: {
      type: String,
      required: true
    }
  },
  components: {
    Docments,
    SignaturePad
  },
  setup(props) {
    const transactionType = ref();
    const journalBatchEntry = ref()
    const adminCompany = ref()
    const initWorkflowId = ref([])
    const provenance = ref()
    const provenancePendingStatusIndex = ref(0)
    const visibleWorkflowActions = ref({
      visibleApproveButton: false,
      visibleSubmitProposal: false,
      visibleSubmitDisbursmentAdvice: false,
      visibleSellerAcknowledgeOfReceiveDisbursement: false,
      visibleBuyerUploadRepaymentAdvice: false,
      visibleFunderAcknowledgeRepaymentAdvice: false,

    })
    const dateFormat = process.env.VUE_APP_DATE_FORMAT;
    const dateTimeFormat = process.env.VUE_APP_DATETIME_FORMAT;
    const currentCompanyRole = ref('');
    const currencies = ref(null)
    const signatureFileUrl = ref(null)
    const signatureDataURL = ref(null)
    const signatureFile = ref(null)
    const signaturePad = ref(null)
    const remark = ref(null)
    const lastWorkStatus = ref()
    const uploadErrorMessage = ref();
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
    const store = useStore()
    const user = store.state.auth
    const valueDate = ref()
    const bidValue = ref(null)
    const files = ref()
    const verifyRequestBody = ref({})
    const signatureLoading = ref(false)
    const modalLoading = ref(false)
    const disbursementData = ref({
      paymentAdviceNumber: null,
      paymentAdviceAmount: null,
      paymentInstructionId: null,
      currencyCode: 'USD',
      paymentAdviceDate: moment.utc(new Date()).format(dateFormat),
      paymentAdviceUri: null
    })
    const confirmAbleDisbursementData = ref()
    const confirmFunderAcknowledgeReceiveOfRepaymentData = ref()
    const paymentAdviceWorksStatus = ref([])
    const loading = ref({
      invoiceDetail: true,
      provenance: true,
      batchDetail: true
    })
    const supportingDocumentAccordionIndex = ref([])
    const lockDays = ref([])
    const initComponent = ref(false)

    const onDrop = (acceptFiles, rejectReasons) => {
      files.value = acceptFiles;
    }

    const options = reactive({
      multiple: true,
      onDrop,
      accept: '.jpg, .csv',
    })

    const { getRootProps, getInputProps, ...rest } = useDropzone(options)

    const invoiceDetailApi = async() => {
      const bankApi = `/company/v1/${store.state.account.company_uuid}/bankaccounts`
      await appAxios.get(bankApi).then(res => {
        batchDetails.value.bankDetails.bank = _.find(res.data, {currency: batchDetails.value.currencyCode})
      })

      const batchBuyerApi = `/company/v1/${batchDetails.value.buyerCompanyId}`
      await appAxios.get(batchBuyerApi).then(res => {
        batchDetails.value.batchInformation.buyerCompany = res.data.companyDisplayName
      })

      if(batchDetails.value.sellerCompanyId !== '00000000-0000-0000-0000-000000000000'){
        const batchSellerApi = `/company/v1/${batchDetails.value.sellerCompanyId}`
        await appAxios.get(batchSellerApi).then(res => {
          batchDetails.value.batchInformation.sellerCompany = res.data.companyDisplayName
        })
      }
      
      if(batchDetails.value.funderCompanyId !== '00000000-0000-0000-0000-000000000000'){
        const batchFunderApi = `/company/v1/${batchDetails.value.funderCompanyId}`
        await appAxios.get(batchFunderApi).then(res => {
          batchDetails.value.batchInformation.funderCompany = res.data.companyDisplayName
        })
      }

      const processingFeeApi = `/ledger/v1/paymentinstruction/byworkflowexecutionreferenceid/${batchDetails.value.workflowExecutionReferenceId}`
      await appAxios.get(processingFeeApi).then(res => {
          //calculate interest amount
        let dueDt = moment(batchDetails.value.paymentDueDate);
        let valueDt = moment(batchDetails.value.valueDate); 
        let noOfDays = dueDt.diff(valueDt,'days');
        batchDetails.value.numberOfDays = noOfDays;
        batchDetails.value.formula.interestAmount = (batchDetails.value.formula.interestRate * batchDetails.value.formula.repaymentAmountToFunder / 365 * noOfDays).toFixed(2);

        var tax1 = _.find(res.data, {fromCompanyId: batchDetails.value.funderCompanyId, toCompanyId: batchDetails.value.sellerCompanyId,label:"FirstDisbursableAmount"})
        batchDetails.value.formula.disbursableAmount1 = tax1?.amountBeforeTax.toFixed(2)
        batchDetails.value.formula.disburableAmount1DueDate = moment.utc(tax1?.dueDate).format(dateFormat)

        var tax2 = _.find(res.data, {fromCompanyId: batchDetails.value.funderCompanyId, toCompanyId: batchDetails.value.sellerCompanyId,label:"FinalDisbursableAmount"})
        batchDetails.value.formula.disbursableAmount2 = tax2?.amountBeforeTax.toFixed(2)
        batchDetails.value.formula.disburableAmount2DueDate = moment.utc(tax2?.dueDate).format(dateFormat)

        var platformFee = _.find(res.data, {fromCompanyId: batchDetails.value.funderCompanyId, toCompanyId: adminCompany.value})
        batchDetails.value.formula.platformFeeAmount = platformFee?.amountBeforeTax
        batchDetails.value.formula.platformFeeDate = platformFee?.dueDate
      })

      return new Promise(resolve => resolve('invoice Detail Api Done'))
    }

    const provenanceApi = async () => {
      var workflowsApi = '/workflow/v1?visibility=true'
      await appAxios.get(workflowsApi).then(res => { provenance.value = res.data })
      var currentWorkflowStatusesApi = '/workflow/v1/statustransition/retrieve/byreferenceids'
      await appAxios.post(currentWorkflowStatusesApi, [batchDetails.value.workflowExecutionReferenceId]).then(async res => {
        if(res.data[0].rootWorkflowId === initWorkflowId.value.sellerLedWorkflowId) batchDetails.value.workflowLed = 'Seller Led'
        if(res.data[0].rootWorkflowId === initWorkflowId.value.buyerLedWorkflowId) batchDetails.value.workflowLed = 'Buyer Led'
        provenance.value = await getBranchLists(res.data[0].rootWorkflowId)
        console.log(res.data[0],"res.data[0]");
        console.log(paymentAdviceWorksStatus.value,"paymentAdviceWorksStatus.value");
        paymentAdviceWorksStatus.value = _.find(paymentAdviceWorksStatus.value, {WorkflowId: res.data[0].rootWorkflowId}).StatusNames 

        provenancePendingStatusIndex.value = res.data[0].workflows.length
        res.data[0].workflows.forEach(passedWorkflow => {
          provenance.value = provenance.value.map(item => {
            if(item.workflowId === passedWorkflow.workflowId){
              item.workflowStatuses.map(workflowState => {
                if(_.find(passedWorkflow.statusTransitions, (passedWorkflowStatusTransitionEntity) => {
                  if(passedWorkflowStatusTransitionEntity.statusName === workflowState.statusName) {
                    return true
                  }
                })){
                  workflowState.passed = true
                }
              })
            }
            return item
          })
        })
        provenance.value = _.map(_.map(provenance.value, 'workflowStatuses').flat(), function(item) {
          return _.merge(item, _.find(_.map(res.data[0].workflows, 'statusTransitions').flat(), { 'statusName' : item.statusName }));
        });
      })
      const paymentAdviceData = await appAxios.get(`/ledger/v1/paymentadvice/byworkflowexecutionreferenceid/${batchDetails.value.workflowExecutionReferenceId}`).then(res => {
        return res.data
      })
      await Promise.all(
        provenance.value.map(async status => {
          var paymentAdvice = null

          if(paymentAdviceWorksStatus.value.includes(status.statusName) && paymentAdviceData.length) {
            
            let paymentAdviceEntity = paymentAdviceData.filter((workflow) => {
              return workflow.extraData.workflowStatusName === status.statusName
            })
            if(paymentAdviceEntity.length){
              await sysAxios.get(`${paymentAdviceEntity[0].paymentAdviceUri}/info`).then(res => {
                paymentAdvice = {paymentAdviceFileName: res.data.fileName, dataHash: {...res.data.dataHash}}
              })
              verifyRequestBody.value.TransactionWorkflowStatuses.push({
                "status": status.statusName,
                "datetimeutc": moment(status.updateTime).valueOf(),
                "identity": status.updateBy,
                "paymentAdvice": {...paymentAdvice},
              })
            }
          } else {
            verifyRequestBody.value.TransactionWorkflowStatuses.push({
              "status": status.statusName,
              "datetimeutc": moment(status.updateTime).valueOf(),
              "identity": status.updateBy,
              "paymentAdvice": null,
            })
          }
        })
      )
      loading.value.provenance = false;
      let workStatusList = []; 
      verifyRequestBody.value.TransactionWorkflowStatuses.forEach((workStatus, index) => {
       workStatusList = []; 
       provenance.value[index].loading= true;
      Object.keys(workStatus).forEach(k => (workStatus[k] == null || typeof workStatus[k] == "undefined") && delete workStatus[k]);
        if(provenance.value[index].passed){
          workStatusList.push(workStatus);
          sysAxios.post(`/traceability/v2/verify/journalbatch/${batchDetails.value.traceId}/status`,workStatusList ).then(res => {
            provenance.value[index].verified = res.data[0].verificationStatus;
            provenance.value[index].loading= false;
          }); 
        }
        else
        {
          provenance.value[index].verified = false;
          provenance.value[index].loading= false;
        }
      })   
      return new Promise(resolve => resolve("provenance api function done"))
    }
     console.log(provenance.value,"passed2");
    const getLockDays = async () => {
      await appAxios.get(`/company/v1/${batchDetails.value.buyerCompanyId}/holidays`).then(res => {
        res.data.forEach(item => {
          if(!lockDays.value.includes(item.date)) lockDays.value.push(item.date)
        })
      })
      await appAxios.get(`/company/v1/${batchDetails.value.sellerCompanyId}/holidays`).then(res => {
        res.data.forEach(item => {
          if(!lockDays.value.includes(item.date)) lockDays.value.push(item.date)
        })
      })
      if(batchDetails.value.funderCompanyId != '00000000-0000-0000-0000-000000000000') {
        await appAxios.get(`/company/v1/${batchDetails.value.funderCompanyId}/holidays`).then(res => {
          res.data.forEach(item => {
            if(!lockDays.value.includes(item.date)) lockDays.value.push(item.date)
          })
        })
      }
      return new Promise(resolve => resolve(lockDays.value))
    }

    const getBranchLists = async (rootWorkflowId) => {
      return new Promise((resolve, reject) => {
        var workflowQueue = [_.find(provenance.value, {workflowId: rootWorkflowId})]
        if(!workflowQueue.length) reject("no rootWorkflow")
        if(!rootWorkflowId) reject("no rootWorkflowId")
        var wholeHistory = []
        while (workflowQueue.length) {
          var parent = workflowQueue.shift()
          var child = _.filter(provenance.value, {parentWorkflowId: parent.workflowId})
          wholeHistory.push(parent)
          workflowQueue.push(...child)
        }
        resolve(wholeHistory)
      })
    }

    const getEstimateCalc = async()=>{
      if(valueDate.value != "" && valueDate.value != null && valueDate.value != undefined){
        batchDetails.value.valueDate = valueDate.value; 
        let dueDt = moment(batchDetails.value.paymentDueDate);
        let valueDt = moment(batchDetails.value.valueDate); 
        let noOfDays = dueDt.diff(valueDt,'days');
        batchDetails.value.numberOfDays = noOfDays;
      }
      if(bidValue.value != ""
      && bidValue.value != null && bidValue.value != undefined
      && valueDate.value != ""
      && valueDate.value != null && valueDate.value != undefined
      ) {
        let apiUrl = '';
        if(batchDetails.value.initiatedByCompanyId == batchDetails.value.buyerCompanyId){
          apiUrl = `/workflow/v1/buyer-led-invoice-financing-workflow-0/estimates?refId=${batchDetails.value.workflowExecutionReferenceId}&interestRate=${bidValue.value}&valueDate=${valueDate.value}`;
          //started by buyer
        }
        else{
          apiUrl = `/workflow/v1/seller-led-invoice-financing-workflow-1/estimates?refId=${batchDetails.value.workflowExecutionReferenceId}&interestRate=${bidValue.value}&valueDate=${valueDate.value}`;
          //started by seller
        }
        await appAxios.get(apiUrl).then(res => {
          let data = res.data;
          batchDetails.value.formula.disburableAmount1DueDate = moment(data.disburableAmount1DueDate).format(dateFormat);
          batchDetails.value.formula.disburableAmount2DueDate = moment(data.disburableAmount2DueDate).format(dateFormat);
          batchDetails.value.formula.disbursableAmount1 = data.disbursableAmount1.toFixed(2);
          batchDetails.value.formula.disbursableAmount2 = data.disbursableAmount2.toFixed(2);
          batchDetails.value.formula.interestAmount = data.interestAmount.toFixed(2);
          batchDetails.value.formula.platformFeeAmount = data.platformFeeAmount.toFixed(2);
          batchDetails.value.formula.platformFeeAmountDueDate = moment(data.platformFeeAmountDueDate).format(dateFormat);
          batchDetails.value.formula.repaymentAmount = data.repaymentAmount.toFixed(2);
          batchDetails.value.formula.repaymentAmountDueDate = moment(data.repaymentAmountDueDate).format(dateFormat);
         console.log(res.data,"my estimate");
        });
      }
    };

    const getLastWorkflowStatus = async() => {
      const api = '/workflow/v1/statustransition/retrieve​/byreferenceids/limittolaststatustransition'
      await appAxios.post(api, [batchDetails.value.workflowExecutionReferenceId]).then(res => {
        lastWorkStatus.value = res.data[0].workflow.lastStatusTransition
      })

      return new Promise(resolve => resolve('get last workflow status done'))
    }

    const getCurrencyCode = async() => {
      const companyProfileSystemConfig = 'configuration/v1/Company Profile';
      await sysAxios.get(companyProfileSystemConfig).then(res => {
				currencies.value = JSON.parse(_.find(res.data[0].configurations, {name: "currencies"}).value)
			})

      return new Promise(resolve => resolve(currencies.value))
    }

    const getpaymentInstructionId = async (label) => {
      const api = `/ledger/v1/paymentinstruction/byworkflowexecutionreferenceid/${props.workflowExecutionReferenceId}`
      return new Promise( resolve => {
        appAxios.get(api).then(res => {
          const paymentInstruction = _.find(res.data, {label: label}) //RepaymentAmount | DisbursableAmount
          resolve(paymentInstruction.paymentInstructionId)
        })
      })
    }

    const approveAcknowledge = async () => { 
      modalLoading.value = true
      await saveSignature().then( async()=>{  
        if(signatureFileUrl.value == null) {
          uploadErrorMessage.value = "Your signature is required!";
          console.log(cash("#error-content"))
          Toastify({
            node: cash("#failed-notification-content").clone().removeClass("hidden")[0],
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
          }).showToast();
          modalLoading.value = false
        }
        else {
          var api = ''
          if(currentCompanyRole.value === 'Seller Admin') api = '/workflow/v1/buyer-led-invoice-financing-workflow-0/seller-acknowledge-the-transaction-branch/0'
          if(currentCompanyRole.value === 'Buyer Admin')  api = '/workflow/v1/seller-led-invoice-financing-workflow-1/buyer-acknowledge-the-transaction-branch/0'
          await appAxios.post(api, {
            externalReferenceId: batchDetails.value.workflowExecutionReferenceId,
            remark: remark.value,
            signatureUri: signatureFileUrl.value
          }).then(res => {
            modalLoading.value = false
            if(res.status === 200) {
              cash("#approve-invoice-modal").modal("hide")
              visibleWorkflowActions.value.visibleApproveButton = false
              provenancePendingStatusIndex.value ++;
            }
            loading.value.provenance = true
            updateProvenanceApi()
          })
        } 
      }); 
    }

    const declineAcknowledge = async () => { 
        if(currentCompanyRole.value === 'Seller Admin') api = '/workflow/v1/buyer-led-invoice-financing-workflow-0/seller-not-acknowledge-the-transaction-branch/0'
        if(currentCompanyRole.value === 'Buyer Admin') api = '/workflow/v1/seller-led-invoice-financing-workflow-1/buyer-not-acknowledge-the-transaction-branch/0'
        appAxios.post(api, {
          externalReferenceId: batchDetails.value.workflowExecutionReferenceId,
          remark: remark.value,
          signatureUri: signatureFileUrl.value
        }).then(res => {
          if(res.status === 200) {
            visibleWorkflowActions.value.visibleApproveButton.value = false
            provenancePendingStatusIndex.value ++;
            loading.value.provenance = true
            updateProvenanceApi()
          }
        }) 
    }

    const submitProposal = async () => {
      modalLoading.value = true
      const api = `/bidding/v1/${batchDetails.value.workflowExecutionReferenceId}/vote`
      appAxios.put(api, {
        vote: {
          companyId: store.state.account.company_uuid,
          bidValue: bidValue.value,
          valueDate: moment.utc(valueDate.value).format(),
        }
      }).then(res => {
        modalLoading.value = false
        if(res.status === 201) {
          cash("#submit-proposal-modal").modal("hide")
          loading.value.provenance = true
          visibleWorkflowActions.value.visibleSubmitProposal = false;
          updateProvenanceApi()
        }
      })
    }

    const submitDisbursmentAdvice = async () => {
      modalLoading.value = true
      await uploadFile()
      var api = ''
      if(batchDetails.value.workflowLed === 'Buyer Led') {
        disbursementData.value.paymentInstructionId = await getpaymentInstructionId("DisbursableAmount")
        api = '/workflow/v1/buyer-led-invoice-financing-workflow-0/funder-identified-after-bidding-branch/10'
      }
      else if(batchDetails.value.workflowLed === 'Seller Led' && lastWorkStatus.value.statusName === 'AWAITING_FUNDER_FIRST_DISBURSEMENT') {
        disbursementData.value.paymentInstructionId = await getpaymentInstructionId("FirstDisbursableAmount")
        api = '/workflow/v1/seller-led-invoice-financing-workflow-1/funder-identified-after-bidding-branch/10'
      } else if(batchDetails.value.workflowLed === 'Seller Led' && lastWorkStatus.value.statusName === 'AWAITING_FUNDER_FINAL_DISBURSEMENT') {
        disbursementData.value.paymentInstructionId = await getpaymentInstructionId("FinalDisbursableAmount")
        api = '/workflow/v1/seller-led-invoice-financing-workflow-1/funder-acknowledge-received-of-repayment-branch/20'
      }
      const request = {
        externalReferenceId: batchDetails.value.workflowExecutionReferenceId,
        paymentInstructionId: disbursementData.value.paymentInstructionId,
        paymentAdviceNumber: disbursementData.value.paymentAdviceNumber,
        paymentAdviceFileName: files.value[0].name,
        paymentAdviceUri: disbursementData.value.paymentAdviceUri,
        paymentAdviceAmount: disbursementData.value.paymentAdviceAmount,
        currencyCode: disbursementData.value.currencyCode,
        paymentAdviceDate: moment.utc(disbursementData.value.paymentAdviceDate).format()
      }

      appAxios.post(api, request).then(res => {
        modalLoading.value = false
        if(res.status == '200') {
          cash("#submit-disbursment-modal").modal("hide")
          loading.value.provenance = true
          updateProvenanceApi()
        }
      })
    }

    const openSellerAcknowledgeOfReceiveDisbursementModel = async () => {
      var paymentInstructionId
      if(batchDetails.value.workflowLed === 'Buyer Led') paymentInstructionId = await getpaymentInstructionId("DisbursableAmount")
      else if(batchDetails.value.workflowLed === 'Seller Led' && lastWorkStatus.value.statusName === 'AWAITING_SELLER_ACKNOWLEDGE_RECEIVE_OF_FIRST_DISBURSEMENT') paymentInstructionId = await getpaymentInstructionId("FirstDisbursableAmount")
      else if(batchDetails.value.workflowLed === 'Seller Led' && lastWorkStatus.value.statusName === 'AWAITING_SELLER_ACKNOWLEDGE_RECEIVE_OF_FINAL_DISBURSEMENT') paymentInstructionId = await getpaymentInstructionId("FinalDisbursableAmount")

      const api = `/ledger/v1/paymentadvice/byworkflowexecutionreferenceid/${props.workflowExecutionReferenceId}`
      const conformableDisbursementData = await appAxios.get(api)
      confirmAbleDisbursementData.value = {..._.find(conformableDisbursementData.data, {paymentInstructionId: paymentInstructionId}) }
      cash("#seller-acknowledge-of-receive-disbursement").modal("show")
    }

    const openFunderAcknowledgeUploadRepaymentAdviceModel = async () => {
      const paymentInstructionId = await getpaymentInstructionId("RepaymentAmount")
      const api = `/ledger/v1/paymentadvice/byworkflowexecutionreferenceid/${props.workflowExecutionReferenceId}`
      const resData = await appAxios.get(api)
      confirmFunderAcknowledgeReceiveOfRepaymentData.value = {..._.find(resData.data, {paymentInstructionId: paymentInstructionId}) }
      cash("#funder-acknowledge-upload-repayment-advice").modal("show")
    }

    const sellerAcknowledgeOfReceiveDisbursement = async () => {
      
      modalLoading.value = true
      await saveSignature().then( async()=>{ 
        if(signatureFileUrl.value == null) {
            uploadErrorMessage.value = "Your signature is required!";
            console.log(cash("#error-content"))
            Toastify({
              node: cash("#failed-notification-content").clone().removeClass("hidden")[0],
              duration: 3000,
              newWindow: true,
              close: true,
              gravity: "top",
              position: "right",
              stopOnFocus: true,
            }).showToast();
            modalLoading.value = false
        }
        else {
        var api = ''
        if(batchDetails.value.workflowLed === 'Buyer Led') api = '/workflow/v1/buyer-led-invoice-financing-workflow-0/seller-acknowledged-receive-of-disbursement-branch/0'
        else if(batchDetails.value.workflowLed === 'Seller Led' && lastWorkStatus.value.statusName === 'AWAITING_SELLER_ACKNOWLEDGE_RECEIVE_OF_FIRST_DISBURSEMENT') api = '/workflow/v1/seller-led-invoice-financing-workflow-1/seller-acknowledged-receive-of-first-disbursement-branch/0'
        else if(batchDetails.value.workflowLed === 'Seller Led' && lastWorkStatus.value.statusName === 'AWAITING_SELLER_ACKNOWLEDGE_RECEIVE_OF_FINAL_DISBURSEMENT') api = '/workflow/v1/seller-led-invoice-financing-workflow-1/seller-acknowledged-receive-of-final-disbursement-branch/0'
        
        const request = {
          externalReferenceId: props.workflowExecutionReferenceId,
          signatureUri: signatureFileUrl.value,
          remarks: remark.value
        }
        await appAxios.post(api, request).then(res => {
          modalLoading.value = false
          console.log(res)
          if(res.status === 200) {
            cash("#seller-acknowledge-of-receive-disbursement").modal("hide")
            loading.value.provenance = true
            provenanceApi()
          }
        })

      }

      });
    }

    const funderAcknowledgeOfRepaymentComfirm = async () => {
     
      modalLoading.value = true
      await saveSignature().then( async()=>{ 
        if(signatureFileUrl.value == null) {
            uploadErrorMessage.value = "Your signature is required!";
            console.log(cash("#error-content"))
            Toastify({
              node: cash("#failed-notification-content").clone().removeClass("hidden")[0],
              duration: 3000,
              newWindow: true,
              close: true,
              gravity: "top",
              position: "right",
              stopOnFocus: true,
            }).showToast();
            modalLoading.value = false
        }
        else {
          var api = ''
          if(batchDetails.value.workflowLed === 'Buyer Led') api = '/workflow/v1/buyer-led-invoice-financing-workflow-0/funder-acknowledge-received-of-repayment-branch/0'
          if(batchDetails.value.workflowLed === 'Seller Led') api = '/workflow/v1/seller-led-invoice-financing-workflow-1/funder-acknowledge-received-of-repayment-branch/0'
          const request = {
            externalReferenceId: props.workflowExecutionReferenceId,
            signatureUri: signatureFileUrl.value,
            remarks: remark.value
          }
          await appAxios.post(api, request).then(res => {
            modalLoading.value = false
            console.log(res)
            if(res.status === 200){
              cash("#funder-acknowledge-upload-repayment-advice").modal("hide")
              loading.value.provenance = true
              updateProvenanceApi()
            }
          })
        }
      });
    }

    const funderAcknowledgeOfRepaymentDecline = async () => {
      if(signatureFileUrl.value == null) {
        uploadErrorMessage.value = "Your signature is required!";
        console.log(cash("#error-content"))
        Toastify({
          node: cash("#failed-notification-content").clone().removeClass("hidden")[0],
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true,
        }).showToast(); 
      }
      else {
        await saveSignature().then( async()=>{ 
          if(batchDetails.value.workflowLed === 'Buyer Led') api = '/workflow/v1/buyer-led-invoice-financing-workflow-0/funder-not-acknowledged-receive-of-repayment-branch/0';
          if(batchDetails.value.workflowLed === 'Seller Led') api = '/workflow/v1/seller-led-invoice-financing-workflow-1/funder-not-acknowledged-receive-of-repayment-branch/0';
          const request = {
            externalReferenceId: props.workflowExecutionReferenceId,
            remarks: remark.value
          }
          await appAxios.post(api, request).then(res => {
            console.log(res)
            cash("#funder-acknowledge-upload-repayment-advice").modal("hide")
            loading.value.provenance = true
            updateProvenanceApi()
          })
        });
      }
    }

    const setDisbursmentCurrencyCode = (currencyCode) => {
      disbursementData.value.currencyCode = currencyCode
    }

    const BuyerUploadRepaymentAdvice = async () => {
      modalLoading.value = true
      await uploadFile()
      var api = ''
      if(batchDetails.value.workflowLed === 'Buyer Led') api = '/workflow/v1/buyer-led-invoice-financing-workflow-0/seller-acknowledged-receive-of-disbursement-branch/20'
      if(batchDetails.value.workflowLed === 'Seller Led') api = '/workflow/v1/seller-led-invoice-financing-workflow-1/seller-acknowledged-receive-of-first-disbursement-branch/20'
      disbursementData.value.paymentInstructionId = await getpaymentInstructionId("RepaymentAmount")
      const request = {
        externalReferenceId: batchDetails.value.workflowExecutionReferenceId,
        paymentInstructionId: disbursementData.value.paymentInstructionId,
        paymentAdviceNumber: disbursementData.value.paymentAdviceNumber,
        paymentAdviceFileName: files.value[0].name,
        paymentAdviceUri: disbursementData.value.paymentAdviceUri,
        paymentAdviceAmount: disbursementData.value.paymentAdviceAmount,
        currencyCode: disbursementData.value.currencyCode,
        paymentAdviceDate: moment.utc(disbursementData.value.paymentAdviceDate).format()
      }
      appAxios.post(api, request).then(res => {
        modalLoading.value = false
        console.log(res)
        if(res.status === 200) cash("#buyer-upload-repayment-advice").modal("hide")
        loading.value.provenance = true
        updateProvenanceApi()
      })
    }

    const FunderUploadRepaymentAdvice = async () => {
      await uploadFile()
      disbursementData.value.paymentInstructionId = await getpaymentInstructionId("RepaymentAmount")

      const api = '/workflow/v1/buyer-led-invoice-financing-workflow-0/seller-acknowledged-receive-of-disbursement-branch/20'
      const request = {
        externalReferenceId: batchDetails.value.workflowExecutionReferenceId,
        paymentInstructionId: disbursementData.value.paymentInstructionId,
        paymentAdviceNumber: disbursementData.value.paymentAdviceNumber,
        paymentAdviceUri: disbursementData.value.paymentAdviceUri,
        paymentAdviceAmount: disbursementData.value.paymentAdviceAmount,
        currencyCode: disbursementData.value.currencyCode,
        paymentAdviceDate: moment.utc(disbursementData.value.paymentAdviceDate).format()
      }
      appAxios.post(api, request).then(res => {
        cash("#seller-upload-repayment-advice").modal("hide")
      })
    } 

    const uploadFile = async () => {
      const fileUploadApi = 'uploads/v1/payment_advice';
      let formData = new FormData();
      formData.append('file', files.value[0])
      let res = await sysAxios.post(fileUploadApi, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
      });
      disbursementData.value.paymentAdviceUri = 'https://authorization.bsg-api.tk/api/uploads/v1/' + res.data
    }

    const removeFile = () => files.value = null

    const getSignaturePad = () => {
      console.log(signaturePad,"signaturePad")
      if (!signaturePad.value) {
        throw new Error("No signature pad ref could be found");
      }
      return signaturePad.value;
    }

    const clearSignature = () => {
      getSignaturePad().clearSignature();
    }

    const undoSignature = () => {
      getSignaturePad().undoSignature();
    }

    const saveSignature = async () => {
      signatureLoading.value = true
      const signature = getSignaturePad().saveSignature();
      const fileUploadApi = 'uploads/v1/acknowledgement_signature';
      let formData = new FormData();
      console.log(signature,"signature");
      if(signature.isEmpty)
      {
        return new Promise(resolve => {
          resolve("Error!")
        })
      }
      else
      {
        formData.append('file', signature.file)
        await sysAxios.post(fileUploadApi, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
          signatureFileUrl.value = `https://authorization.bsg-api.tk/api/uploads/v1/${res.data}`
          signatureLoading.value = false
        });
        return new Promise(resolve => {
          resolve(signatureFileUrl.value)
        })
      }
      
    }

    const onInput = (value) => {
      if (!value) {
        signatureDataURL.value = null;
        signatureFile.value = null;
      } else if (value instanceof File) {
        signatureDataURL.value = null;
        signatureFile.value = value;
      } else {
        signatureDataURL.value = value;
        signatureFile.value = null;
      }
    }

    const accordion = (index) => {
      if(supportingDocumentAccordionIndex.value.includes(index)) _.remove(supportingDocumentAccordionIndex.value, (item) => {
        return item == index
      })
      else supportingDocumentAccordionIndex.value.push(index)
    }

    const init = async () => {
      //geting invoice detail information
      await appAxios.get(`/journalbatch/v1/header/byworkflowexecutionid/${props.workflowExecutionReferenceId}`).then( res => {
        console.log(res)

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
            platformFeeRate: res.data.processingFeeRateForFunder,
            repaymentAmountToFunder: res.data.totalAmount,
            repaymentDate: moment.utc(res.data.paymentDueDate).format(dateFormat)
          }
        }
        batchDetails.value.valueDate = moment().add(2,'days'); 
        valueDate.value = batchDetails.value.valueDate; 
        let dueDt = moment(batchDetails.value.paymentDueDate);
        let valueDt = moment(batchDetails.value.valueDate); 
        let noOfDays = dueDt.diff(valueDt,'days');
        batchDetails.value.numberOfDays = noOfDays;
        batchDetails.value = {...batchDetails.value, ...batch}
      })
      
      verifyRequestBody.value = {
        batchId: batchDetails.value.batchNumber,
        batchTotal: batchDetails.value.batchInformation.totalAmount,
        batchCurrency: batchDetails.value.currencyCode,
        batchEntriesBreakup: [{
          entryType: "INV",
          entryQuantity: batchDetails.value.numberOfBatchEntries
        }],
        batchEntries: [],
        TransactionWorkflowStatuses: []
      }
      await appAxios.get(`/journalbatch/v1/header/${batchDetails.value.journalBatchHeaderId}/entries`).then(res => {
        journalBatchEntry.value = res.data
        console.log(journalBatchEntry.value);
        res.data.forEach(async entry => {
          const api = `/journalbatch/v1/header/${entry.journalBatchHeaderId }/entry/${entry.journalBatchEntryId }/supportingdocuments`;
          let supportingDocument = []
          await appAxios.get(api).then(res => {
            res.data.forEach(async document => {
              const fileData = await appAxios.get(document.documentURI + '/info').then(res => {
                return res.data
              })
              supportingDocument.push({
                "supportingdocumentname": document.documentName,
                "supportingdocumentcategory": 'Supporting Document',
                "identity": fileData.uploadByUserId,
                "datetimeutc": moment.utc(document.uploadTime).format("X"),
                "dataHash": fileData.dataHash,
              })
            })
          })
          verifyRequestBody.value.batchEntries.push({
            entryId: entry.documentNumber,
            entryType: entry.documentType,
            supportingDocument: supportingDocument
          })
        })
      })

      const genieGlobalSetting = `configuration/v1/Genie Global Settings`
      await sysAxios.get(genieGlobalSetting).then(res => {
        adminCompany.value = _.find(res.data[0].configurations, {name: 'Admin Company Id'}).value
        initWorkflowId.value = {...initWorkflowId.value, buyerLedWorkflowId: _.find(res.data[0].configurations, {name: 'Buyer Led Workflow Id'}).value}
        initWorkflowId.value = {...initWorkflowId.value, sellerLedWorkflowId: _.find(res.data[0].configurations, {name: 'Seller Led Workflow Id'}).value}
        paymentAdviceWorksStatus.value = JSON.parse(_.find(res.data[0].configurations, {name: 'Workflow Status With Payment Advice'}).value)
      })

      //getting invoice detail data from journalbatch api endpoint
      await invoiceDetailApi()

      //get the last workflow status to use as compare value;
      await getLastWorkflowStatus()

      //getting current batch workflow status and getting verify the current workflow from verify endpoint
      await provenanceApi()
      
      //determine current company is seller role or buyer role in this invoice
      if(batchDetails.value.workflowLed == 'Buyer Led') {
        if(batchDetails.value.initiatedByCompanyId == store.state.account.company_uuid) currentCompanyRole.value = "Buyer Admin";
        else currentCompanyRole.value = "Seller Admin";
      } else {
        if(batchDetails.value.initiatedByCompanyId == store.state.account.company_uuid) currentCompanyRole.value = "Seller Admin";
        else currentCompanyRole.value = "Buyer Admin"
      }

      //determine what action button should be showed in Batch Detail page
      if(lastWorkStatus.value['statusName'] === "AWAITING_SELLER_ACKNOWLEDGEMENT" && currentCompanyRole.value === "Seller Admin") visibleWorkflowActions.value.visibleApproveButton = true
      else if(lastWorkStatus.value['statusName'] === "AWAITING_BUYER_ACKNOWLEDGEMENT" && currentCompanyRole.value === "Buyer Admin") visibleWorkflowActions.value.visibleApproveButton = true
      else if(lastWorkStatus.value['statusName'] === "BIDDING_IN_PROGRESS" && user.user_role === "Funder Admin") visibleWorkflowActions.value.visibleSubmitProposal = true
      else if(lastWorkStatus.value['statusName'] === "AWAITING_FUNDER_DISBURSEMENT" && user.user_role === "Funder Admin") visibleWorkflowActions.value.visibleSubmitDisbursmentAdvice = true
      else if(lastWorkStatus.value['statusName'] === "AWAITING_FUNDER_FIRST_DISBURSEMENT" && user.user_role === "Funder Admin") visibleWorkflowActions.value.visibleSubmitDisbursmentAdvice = true
      else if(lastWorkStatus.value['statusName'] === "AWAITING_FUNDER_FINAL_DISBURSEMENT" && user.user_role === "Funder Admin") visibleWorkflowActions.value.visibleSubmitDisbursmentAdvice = true
      else if(lastWorkStatus.value['statusName'] === "AWAITING_SELLER_ACKNOWLEDGE_DISBURSEMENT" && currentCompanyRole.value=== "Seller Admin") visibleWorkflowActions.value.visibleSellerAcknowledgeOfReceiveDisbursement = true
      else if(lastWorkStatus.value['statusName'] === "AWAITING_SELLER_ACKNOWLEDGE_RECEIVE_OF_FIRST_DISBURSEMENT" && currentCompanyRole.value === "Seller Admin") visibleWorkflowActions.value.visibleSellerAcknowledgeOfReceiveDisbursement = true
      else if(lastWorkStatus.value['statusName'] === "AWAITING_SELLER_ACKNOWLEDGE_RECEIVE_OF_FINAL_DISBURSEMENT" && currentCompanyRole.value === "Seller Admin") visibleWorkflowActions.value.visibleSellerAcknowledgeOfReceiveDisbursement = true
      else if(lastWorkStatus.value['statusName'] === "AWAITING_BUYER_REPAYMENT_ON_DUE_DATE" && currentCompanyRole.value === "Buyer Admin") visibleWorkflowActions.value.visibleBuyerUploadRepaymentAdvice = true
      else if(lastWorkStatus.value['statusName'] === "AWAITING_FUNDER_ACKNOWLEDGE_REPAYMENT" && user.user_role === "Funder Admin") visibleWorkflowActions.value.visibleFunderAcknowledgeRepaymentAdvice = true
      console.log(lastWorkStatus.value)
      //getting currency code by using action modal currency select box
      await getCurrencyCode()
      //lock days consists of company holidays and it will be disabled in datepicker
      await getLockDays()
      const company_uuid = store.state.account.company_uuid;
      const dashboardApi = `/company/v1/${company_uuid}/dashboarddata`;
      visibleWorkflowActions.value.visibleSubmitProposal = false;
      await appAxios.get(dashboardApi).then(res => {
          let pendingItem = res.data.transactionsSnapShot.pendingForAction.groupingByAction;
          let pendingAction = {}; 
          
            if(res.data.bidInvitations != null) {
              let pendingBid = res.data.bidInvitations.open;
              if(pendingBid.workflowExecutionids.length > 0) {
                const batchApi = `/journalbatch/v1/header/byworkflowexecutionid/${pendingBid.workflowExecutionids[0]}`; 
                appAxios.get(batchApi).then(res2 => {
                  
                  let batchData = res2.data;
                  if(batchData.workflowExecutionReferenceId == props.workflowExecutionReferenceId)
                  {
                    visibleWorkflowActions.value.visibleSubmitProposal = true;
                  } 
                }); 
              }
            } 
        })
    }
    
    const updateProvenanceApi = async () => {
      const genieGlobalSetting = `configuration/v1/Genie Global Settings`
      await sysAxios.get(genieGlobalSetting).then(res => {
        adminCompany.value = _.find(res.data[0].configurations, {name: 'Admin Company Id'}).value
        initWorkflowId.value = {...initWorkflowId.value, buyerLedWorkflowId: _.find(res.data[0].configurations, {name: 'Buyer Led Workflow Id'}).value}
        initWorkflowId.value = {...initWorkflowId.value, sellerLedWorkflowId: _.find(res.data[0].configurations, {name: 'Seller Led Workflow Id'}).value}
        paymentAdviceWorksStatus.value = JSON.parse(_.find(res.data[0].configurations, {name: 'Workflow Status With Payment Advice'}).value)
      })
      await provenanceApi()
    }

    onMounted(async () => {
      await init()
      initComponent.value = true
    })
    
    return { 
      dateFormat,
      dateTimeFormat,
      transactionType,
      loading,
      journalBatchEntry,
      moment,
      provenance,
      lastWorkStatus,
      provenancePendingStatusIndex,
      batchDetails,
      visibleWorkflowActions,
      currencies,
      user,
      bidValue,
      valueDate,
      remark,
      disbursementData,
      confirmAbleDisbursementData,
      confirmFunderAcknowledgeReceiveOfRepaymentData,
      approveAcknowledge,
      declineAcknowledge,
      submitProposal,
      submitDisbursmentAdvice,
      setDisbursmentCurrencyCode,
      BuyerUploadRepaymentAdvice,
      FunderUploadRepaymentAdvice,
      openSellerAcknowledgeOfReceiveDisbursementModel,
      openFunderAcknowledgeUploadRepaymentAdviceModel,
      sellerAcknowledgeOfReceiveDisbursement,
      funderAcknowledgeOfRepaymentComfirm,
      funderAcknowledgeOfRepaymentDecline,
      getRootProps,
      getInputProps,
      files,
      removeFile,
      signaturePad,
      signatureDataURL,
      signatureFile,
      clearSignature,
      undoSignature,
      saveSignature,
      onInput,
      signatureLoading,
      modalLoading,
      supportingDocumentAccordionIndex,
      accordion,
      _,
      ProvenanceLang,
      initComponent,
      lockDays,
      getEstimateCalc,
      uploadErrorMessage
    }
  },
}
</script>