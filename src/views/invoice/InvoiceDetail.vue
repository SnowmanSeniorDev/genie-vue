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
          <div v-for="(item, index) in provenance" class="intro-x relative flex items-start pb-5" :key="index">
            <div class="w-6 h-6 shadow-lg flex-none image-fit rounded-full overflow-hidden bg-gray-500 ml-2"></div>
            <div class="px-5 ml-4 flex-1">
              <div class="flex items-center">
                <div v-if="item.passed" :class="`alert show flex items-center h-5 p-3 text-sm justify-center ${lastWorkStatus.statusName === item.statusName ? 'alert-warning-soft' : 'text-green-700 bg-green-200'} `" role="alert">
                  <CheckCircleIcon class="w-3 h-3 mr-3" />
                  <span class="pr-3">{{lastWorkStatus.statusName === item.statusName ? 'Pending' : 'Passed'}}</span>
                </div>
                <div v-else class="alert alert-secondary show flex items-center justify-center h-5 p-3 text-sm" role="alert">
                  Not Started
                </div>
                <span class="ml-3 text-gray-500">{{item.statusName}}</span>
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
          <div v-if="visibleApproveButton" class="pt-8 flex justify-center">
            <a href="javascript:;" data-toggle="modal" data-target="#approve-invoice-modal" class="btn btn-primary w-48 sm:w-auto mr-2" >Approve</a>
            <a href="javascript:;" data-toggle="modal" data-target="#decline-invoice-modal" class="btn btn-secondary w-48 sm:w-auto mr-2" >Decline</a>
          </div>
          <div v-if="visibleSubmitProposal" class="pt-8 flex justify-center">
            <a href="javascript:;" data-toggle="modal" data-target="#submit-proposal-modal" class="btn btn-primary w-48 sm:w-auto mr-2" >Submit Proposal</a>
          </div>
          <div v-if="visibleSubmitDisbursmentAdvice" class="pt-8 flex justify-center">
            <a href="javascript:;" data-toggle="modal" data-target="#submit-disbursment-modal" class="btn btn-primary w-48 sm:w-auto mr-2" >Submit Disbursment</a>
          </div>
          <div v-if="visibleSellerAcknowledgeOfReceiveDisbursement" class="pt-8 flex justify-center">
          <!-- <div class="pt-8 flex justify-center"> -->
            <a href="javascript:;" @click="openSellerAcknowledgeOfReceiveDisbursementModel" class="btn btn-primary w-48 sm:w-auto mr-2" >Acknowledge Receive of Disbursement</a>
          </div>
          <div v-if="visibleBuyerUploadRepaymentAdvice" class="pt-8 flex justify-center">
          <!-- <div class="pt-8 flex justify-center"> -->
            <a href="javascript:;" data-toggle="modal" data-target="#buyer-upload-repayment-advice" class="btn btn-primary w-48 sm:w-auto mr-2" >Upload Repayment Advice</a>
          </div>
          <div v-if="visibleFunderAcknowledgeRepaymentAdvice" class="pt-8 flex justify-center">
          <!-- <div class="pt-8 flex justify-center"> -->
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
            <div class="self-center">Bid Expiry Date & Time</div>
            <div class="self-center">{{batchDetails.batchInformation.bidEndTime}}</div>
            <div class="self-center">Invoice Amount</div>
            <div class="self-center">{{batchDetails.batchInformation.totalAmount}}</div>
            <div class="self-center">Payment Due Date</div>
            <div class="self-center">{{batchDetails.batchInformation.paymentDueDate}}</div>
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
            <button @click="saveSignature" class="btn btn-primary">Save signature</button>
          </div>
        </div>
        <div class="modal-footer text-right">
          <button type="button" class="btn btn-primary w-20 mr-1" @click="approveAcknowledge"> Approve </button>
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
            <div class="self-center">Bid Expiry Date & Time</div>
            <div class="self-center">{{batchDetails.batchInformation.bidEndTime}}</div>
            <div class="self-center">Invoice Amount</div>
            <div class="self-center">{{batchDetails.batchInformation.totalAmount}}</div>
            <div class="self-center">Payment Due Date</div>
            <div class="self-center">{{batchDetails.batchInformation.paymentDueDate}}</div>
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
  <div id="submit-proposal-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- BEGIN: Modal Header -->
        <div class="modal-header">
          <h2 class="font-medium text-base mr-auto"> Approve Invoice </h2>
        </div>
        <!-- END: Modal Header -->
        <div class="modal-body mx-8">
          <div class="grid grid-cols-2 grid-flow-row gap-4">
            <div class="self-center">Interest Rate</div>
            <div class="self-center">
              <input type="text" v-model="bidValue" class="form-control"/>
            </div>
            <div class="self-center">Value Date</div>
            <div class="self-center">
              <Litepicker
                v-model="valueDate"
                :options="{
                  autoApply: false,
                  showWeekNumbers: true,
                  zIndex: 10001,
                  minDate: moment(batchDetails.batchInformation.bidEndTime).format('DD MMM, YYYY'),
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
          <button type="button" class="btn btn-primary w-20 mr-1" @click="submitProposal"> Confirm </button>
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
                  minDate: moment(batchDetails.batchInformation.bidEndTime).format('DD MMM, YYYY'),
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
          <button type="button" class="btn btn-primary w-20 mr-1" @click="submitDisbursmentAdvice"> Submit </button>
          <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-20"> Cancel </button>
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
            <div class="self-center">{{moment(confirmAbleDisbursementData.paymentAdviceDate).format("DD MMM, YYYY")}}</div>
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
            <button @click="saveSignature" class="btn btn-primary">Save signature</button>
          </div>
        </div>
        <div class="modal-footer text-right">
          <button type="button" class="btn btn-primary w-20 mr-1" @click="sellerAcknowledgeOfReceiveDisbursement"> Confirm </button>
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
                  minDate: moment(batchDetails.batchInformation.bidEndTime).format('DD MMM, YYYY'),
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
          <button type="button" class="btn btn-primary w-20 mr-1" @click="BuyerUploadRepaymentAdvice"> Submit </button>
          <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-20"> Cancel </button>
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
            <div class="self-center">{{moment(confirmFunderAcknowledgeReceiveOfRepaymentData.paymentAdviceDate).format("DD MMM, YYYY")}}</div>
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
            <button @click="saveSignature" class="btn btn-primary">Save signature</button>
          </div>
        </div>
        <div class="modal-footer text-right">
          <button type="button" class="btn btn-primary w-20 mr-1" @click="funderAcknowledgeOfRepaymentComfirm"> Confirm </button>
          <button type="button" class="btn btn-danger w-20 mr-1" @click="funderAcknowledgeOfRepaymentDecline"> Decline </button>
          <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-20"> Cancel </button>
        </div> <!-- END: Modal Footer -->
      </div>
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
    const journalBatchEntry = ref()
    const adminCompany = ref()
    const initWorkflowId = ref()
    const provenance = ref()
    const provenancePendingStatusIndex = ref(0)
    const visibleApproveButton = ref(false)
    const visibleSubmitProposal = ref(false)
    const visibleSubmitDisbursmentAdvice = ref(false)
    const visibleSellerAcknowledgeOfReceiveDisbursement = ref(false)
    const visibleBuyerUploadRepaymentAdvice = ref(false)
    const visibleFunderAcknowledgeRepaymentAdvice = ref(false)
    const currencies = ref(null)
    const signatureFileUrl = ref(null)
    const signatureDataURL = ref(null)
    const signatureFile = ref(null)
    const signaturePad = ref(null)
    const remark = ref(null)
    const lastWorkStatus = ref()
    const batchDetails = ref({
      batchNumber: null,
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
        totalAmount: null
      },
      formula: {
        interestRate: null,
        processingFeeRate: null,
        processingFeeAmount: null,
        disbursableAmountToSeller: null,
        disbursableDate: null,
        miscFeeRate: null,
        miscFeeAmount: null,
        miscFeeDate: null,
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
    const disbursementData = ref({
      paymentAdviceNumber: null,
      paymentAdviceAmount: null,
      paymentInstructionId: null,
      currencyCode: 'USD',
      paymentAdviceDate: moment(new Date()).format("DD MMM, YYYY"),
      paymentAdviceUri: null
    })
    const confirmAbleDisbursementData = ref()
    const confirmFunderAcknowledgeReceiveOfRepaymentData = ref()


    const onDrop = (acceptFiles, rejectReasons) => {
      files.value = acceptFiles;
      console.log(acceptFiles)
      console.log(rejectReasons)
    }

    const options = reactive({
      multiple: true,
      onDrop,
      accept: '.jpg, .csv',
    })

    const { getRootProps, getInputProps, ...rest } = useDropzone(options)

    console.log('user = ', user)
    console.log("company uuid = ", store.state.account)
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

        var tax = _.find(res.data, {fromCompanyId: batchDetails.value.funderCompanyId, toCompanyId: batchDetails.value.sellerCompanyId})
        batchDetails.value.formula.processingFeeAmount = batchDetails.value.totalAmount - tax.amountBeforeTax
        batchDetails.value.formula.disbursableAmountToSeller = tax.amountBeforeTax
        batchDetails.value.formula.disbursableDate = moment(tax.dueDate).format('DD/MM/YYYY')

        var misc = _.find(res.data, {fromCompanyId: adminCompany.value, toCompanyId: batchDetails.value.buyerCompanyId})
        batchDetails.value.formula.miscFeeAmount = misc.amountBeforeTax
        batchDetails.value.formula.miscFeeDate = misc.dueDate

        var platformFee = _.find(res.data, {fromCompanyId: batchDetails.value.funderCompanyId, toCompanyId: adminCompany.value})
        batchDetails.value.formula.platformFeeAmount = platformFee.amountBeforeTax
        batchDetails.value.formula.platformFeeDate = platformFee.dueDate
      })
    }

    const provenanceApi = async() => {
      var workflowsApi = '/workflow/v1?visibility=true'
      await appAxios.get(workflowsApi).then(res => {
        provenance.value = res.data
      })
      var currentWorkflowStatusesApi = '/workflow/v1/statustransition/retrieve/byreferenceids'
      await appAxios.post(currentWorkflowStatusesApi, [batchDetails.value.workflowExecutionReferenceId]).then(res => {
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

        provenance.value = _.map(provenance.value, 'workflowStatuses').flat().reverse()
      })
    }
    
    const getLastWorkflowStatus = async() => {
      const api = '/workflow/v1/statustransition/retrieve​/byreferenceids/limittolaststatustransition'
      await appAxios.post(api, [batchDetails.value.workflowExecutionReferenceId]).then(res => {
        lastWorkStatus.value = res.data[0].workflow.lastStatusTransition
        if(res.data[0].workflow.lastStatusTransition['statusName'] === "AWAITING_SELLER_ACKNOWLEDGEMENT" && user.user_role === "Seller Admin") visibleApproveButton.value = true
        else if(res.data[0].workflow.lastStatusTransition['statusName'] === "BIDDING_IN_PROGRESS" && user.user_role === "Funder Admin") visibleSubmitProposal.value = true
        else if(res.data[0].workflow.lastStatusTransition['statusName'] === "AWAITING_FUNDER_DISBURSEMENT" && user.user_role === "Funder Admin") visibleSubmitDisbursmentAdvice.value = true
        else if(res.data[0].workflow.lastStatusTransition['statusName'] === "AWAITING_SELLER_ACKNOWLEDGE_DISBURSEMENT" && user.user_role === "Seller Admin") visibleSellerAcknowledgeOfReceiveDisbursement.value = true
        else if(res.data[0].workflow.lastStatusTransition['statusName'] === "AWAITING_BUYER_REPAYMENT_ON_DUE_DATE" && user.user_role === "Buyer Admin") visibleBuyerUploadRepaymentAdvice.value = true
        else if(res.data[0].workflow.lastStatusTransition['statusName'] === "AWAITING_FUNDER_ACKNOWLEDGE_REPAYMENT" && user.user_role === "Funder Admin") visibleFunderAcknowledgeRepaymentAdvice.value = true
      })
    }

    const getCurrencyCode = async() => {
      const companyProfileSystemConfig = 'configuration/v1/Company Profile';
      await sysAxios.get(companyProfileSystemConfig).then(res => {
				currencies.value = JSON.parse(_.find(res.data[0].configurations, {name: "currencies"}).value)
			})
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

    const approveAcknowledge = () => {
      const api = '/workflow/v1/buyer-led-invoice-financing-workflow-0/seller-acknowledge-the-transaction-branch/0'
      appAxios.post(api, {
        externalReferenceId: batchDetails.value.workflowExecutionReferenceId,
        remark: remark.value,
        signatureUri: signatureFileUrl.value
      }).then(res => {
        if(res.status === 200) {
          visibleApproveButton.value = false
          provenancePendingStatusIndex.value ++;
        }
      })
    }

    const declineAcknowledge = () => {
      const api = '/workflow/v1/buyer-led-invoice-financing-workflow-0/seller-not-acknowledge-the-transaction-branch/0'
      appAxios.post(api, {
        externalReferenceId: batchDetails.value.workflowExecutionReferenceId,
        remark: remark.value,
      }).then(res => {
        if(res.status === 200) {
          visibleApproveButton.value = false
          provenancePendingStatusIndex.value ++;
        }
      })
    }

    const submitProposal = async () => {
      const api = `/bidding/v1/${batchDetails.value.workflowExecutionReferenceId}/vote`
      appAxios.put(api, {
        vote: {
          companyId: store.state.account.company_uuid,
          bidValue: bidValue.value,
          valueDate: moment(valueDate.value).format(),
        }
      }).then(res => {
        console.log(res)
      })
    }

    const submitDisbursmentAdvice = async () => {
      await uploadFile()
      disbursementData.value.paymentInstructionId = await getpaymentInstructionId("DisbursableAmount")

      const api = '/workflow/v1/buyer-led-invoice-financing-workflow-0/funder-identified-after-bidding-branch/10'
      const request = {
        externalReferenceId: batchDetails.value.workflowExecutionReferenceId,
        paymentInstructionId: disbursementData.value.paymentInstructionId,
        paymentAdviceNumber: disbursementData.value.paymentAdviceNumber,
        paymentAdviceUri: disbursementData.value.paymentAdviceUri,
        paymentAdviceAmount: disbursementData.value.paymentAdviceAmount,
        currencyCode: disbursementData.value.currencyCode,
        paymentAdviceDate: moment(disbursementData.value.paymentAdviceDate).format()
      }
      appAxios.post(api, request).then(res => {
        console.log(res)
        cash("#submit-disbursment-modal").model("hide")
      })
    }

    const openSellerAcknowledgeOfReceiveDisbursementModel = async () => {
      const paymentInstructionId = await getpaymentInstructionId("DisbursableAmount")
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
      console.log("result filter = ", confirmFunderAcknowledgeReceiveOfRepaymentData.value)
      cash("#funder-acknowledge-upload-repayment-advice").modal("show")
    }

    const sellerAcknowledgeOfReceiveDisbursement = async () => {
      const api = '/workflow/v1/buyer-led-invoice-financing-workflow-0/seller-acknowledged-receive-of-disbursement-branch/0'
      const request = {
        externalReferenceId: props.workflowExecutionReferenceId,
        signatureUri: signatureFileUrl.value,
        remarks: remark.value
      }
      appAxios.post(api, request).then(res => {
        console.log(res)
        cash("#seller-acknowledge-of-receive-disbursement").model("hide")
      })
    }

    const funderAcknowledgeOfRepaymentComfirm = async () => {
      const api = '/workflow/v1/buyer-led-invoice-financing-workflow-0/funder-acknowledge-received-of-repayment-branch/0'
      const request = {
        externalReferenceId: props.workflowExecutionReferenceId,
        signatureUri: signatureFileUrl.value,
        remarks: remark.value
      }
      appAxios.post(api, request).then(res => {
        console.log(res)
        cash("#funder-acknowledge-upload-repayment-advice").model("hide")
      })
    }

    const funderAcknowledgeOfRepaymentDecline = async () => {
      const api = '/workflow/v1/buyer-led-invoice-financing-workflow-0/funder-not-acknowledged-receive-of-repayment-branch/0'
      const request = {
        externalReferenceId: props.workflowExecutionReferenceId,
        remarks: remark.value
      }
      appAxios.post(api, request).then(res => {
        console.log(res)
        cash("#funder-acknowledge-upload-repayment-advice").model("hide")
      })
    }

    const setDisbursmentCurrencyCode = (currencyCode) => {
      disbursementData.value.currencyCode = currencyCode
    }

    const BuyerUploadRepaymentAdvice = async () => {
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
        paymentAdviceDate: moment(disbursementData.value.paymentAdviceDate).format()
      }
      appAxios.post(api, request).then(res => {
        console.log(res)
        cash("#buyer-upload-repayment-advice").model("hide")
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
        paymentAdviceDate: moment(disbursementData.value.paymentAdviceDate).format()
      }
      appAxios.post(api, request).then(res => {
        console.log(res)
        cash("#seller-upload-repayment-advice").model("hide")
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

    const removeFile = () => {
      files.value = null;
    }

    const getSignaturePad = () => {
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

    const saveSignature = () => {
      const signature = getSignaturePad().saveSignature();
      const fileUploadApi = 'uploads/v1/acknowledgement_signature';
      let formData = new FormData();
      formData.append('file', signature.file)
      sysAxios.post(fileUploadApi, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
      }).then(res => {
        signatureFileUrl.value = `https://authorization.bsg-api.tk/api/uploads/v1/${res.data}`
      });
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

    onMounted(async () => {

      await appAxios.get(`/journalbatch/v1/header/byworkflowexecutionid/${props.workflowExecutionReferenceId}`).then( res => {        
        const batch = {
          ...res.data,
          batchInformation: {
            bidEndTime: res.data.bidEndTime,
            paymentDueDate: res.data.paymentDueDate,
            uploadDate: moment(res.data.createdTime).format('DD/MM/YYYY'),
            totalAmount: `${res.data.currencyCode} ${res.data.totalAmount}`,
            noOfBatchEntries: res.data.numberOfBatchEntries
          },
          formula: {
            interestRate: res.data.interestRate,
            processingFeeRate: res.data.processingFeeRateForSeller + res.data.processingFeeRateForFunder,
            miscFeeRate: res.data.processingFeeRateForBuyer,
            platformFeeRate: res.data.processingFeeRateForFunder,
            repaymentAmountToFunder: res.data.totalAmount,
            repaymentDate: moment(res.data.paymentDueDate).format('DD/MM/YYYY')
          }
        }
        batchDetails.value = {...batchDetails.value, ...batch}
      })
      console.log(batchDetails.value)
      await appAxios.get(`/journalbatch/v1/header/${batchDetails.value.journalBatchHeaderId}/entries`).then(res => {
        console.log("entries = ", res)
        journalBatchEntry.value = res.data
      })
      const genieGlobalSetting = `configuration/v1/Genie Global Settings`
      await sysAxios.get(genieGlobalSetting).then(res => {
        adminCompany.value = _.find(res.data[0].configurations, {name: 'Admin Company Id'}).value
        initWorkflowId.value = _.find(res.data[0].configurations, {name: 'Buyer Led Workflow Id'}).value
      })
      invoiceDetailApi()
      provenanceApi()
      getLastWorkflowStatus()
      getCurrencyCode()
    })

    return {
      journalBatchEntry,
      moment,
      provenance,
      lastWorkStatus,
      provenancePendingStatusIndex,
      batchDetails,
      visibleApproveButton,
      visibleSubmitProposal,
      visibleSubmitDisbursmentAdvice,
      visibleSellerAcknowledgeOfReceiveDisbursement,
      visibleBuyerUploadRepaymentAdvice,
      visibleFunderAcknowledgeRepaymentAdvice,
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
    }
  },
}
</script>