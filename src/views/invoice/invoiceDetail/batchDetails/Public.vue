<template>
  <div class='intro-y box p-5 mt-5'>
    <div class='flex items-center'>
      <ListIcon class='w-6 h-6 mr-3' /><span class='text-lg'>Batch Details: {{batchDetails.workflowLed}}</span>
    </div>

    <div class='mt-5'>
      <span>Batch Information</span>
      <table class='table mt-2'>
        <tr class='hover:bg-gray-200'>
          <td class='border w-1/2'>Buyer Company</td>
          <td class='border'>{{batchDetails.buyerCompanyName}}</td>
        </tr>
        <tr class='hover:bg-gray-200'>
          <td class='border'>Seller Company</td>
          <td class='border'>{{batchDetails.sellerCompanyName}}</td>
        </tr>
        <tr class='hover:bg-gray-200'>
          <td class='border'>Funder Company</td>
          <td class='border'>{{batchDetails.funderCompanyName ? batchDetails.funderCompanyName : 'Not Selected Yet'}}</td>
        </tr>
        <tr class='hover:bg-gray-200'>
          <td class='border'>No of batch entries</td>
          <td class='border'>{{batchDetails.batchInformation.noOfBatchEntries}}</td>
        </tr>
        <tr class='hover:bg-gray-200'>
          <td class='border'>Upload Date</td>
          <td class='border'>{{batchDetails.batchInformation.uploadDate}}</td>
        </tr>
        <tr class='hover:bg-gray-200'>
          <td class='border'>Total Amount</td>
          <td class='border'>{{batchDetails.currencyCode}} {{$h.formatCurrency(batchDetails.batchInformation.totalAmount)}}</td>
        </tr>
      </table>
    </div>
    <div class='mt-8' v-if="lodash.find(provenance, {statusName: 'AWAITING_FUNDER_FIRST_DISBURSEMENT'})?.passed || lodash.find(provenance, {statusName: 'AWAITING_FUNDER_DISBURSEMENT'})?.passed">
      <span>Bank Details</span>
      <table class='table mt-2'>
        <tr class='hover:bg-gray-200'>
          <td class='border w-1/2'>Disbursement Bank Account</td>
          <td class='border'>
            <p v-if='batchDetails.extraData.disbursableAccount'>
            Account number: {{batchDetails.extraData.disbursableAccount.accountNumber}}
            <br>
            Bank Name: {{batchDetails.extraData.disbursableAccount.bankName}}
            <br>
            Address: {{batchDetails.extraData.disbursableAccount.address}}
            <br>
            Swift Code: {{batchDetails.extraData.disbursableAccount.swiftCode}}
            </p>
          </td>
        </tr>
      </table>
    </div>
    <div class='mt-5' v-if="lodash.find(provenance, {statusName: 'TRANSACTION_APPROVED_BY_FUNDER'})?.state === 'Completed'">
      <span>Formular</span>
      <table class='table mt-2'>
        <tr class='hover:bg-gray-200' v-if="user.user_role === 'Funder Admin' || batchDetails.workflowLed === 'Seller Led' && currentCompanyRole === 'Seller Admin' || batchDetails.workflowLed === 'Buyer Led' && currentCompanyRole === 'Buyer Admin'">
          <td class='border w-1/2'>Interest Rate</td>
          <td class='border'>{{batchDetails.formula.interestRate}}% {{batchDetails.formula.interestRateDuration}}</td>
        </tr>
        <tr class='hover:bg-gray-200'>
          <td class='border'>Value Date</td>
          <td class='border'>{{batchDetails.formula.valueDate}}</td>
        </tr>
        <tr class='hover:bg-gray-200'>
          <td class='border'>Maturity Date</td>
          <td class='border'>{{batchDetails.formula.maturityDate}}</td>
        </tr>
        <tr class='hover:bg-gray-200'>
          <td class='border'>Number of days</td>
          <td class='border'>{{batchDetails.formula.numberOfDays}}</td>
        </tr>
        <tr class='hover:bg-gray-200' v-if="user.user_role === 'Funder Admin' || batchDetails.workflowLed === 'Seller Led' && currentCompanyRole === 'Seller Admin' || batchDetails.workflowLed === 'Buyer Led' && currentCompanyRole === 'Buyer Admin'">
          <td class='border'>Interest Earn</td>
          <td class='border'>{{batchDetails.currencyCode}} {{batchDetails.formula.interestAmount}}</td>
        </tr>
        <tr class='hover:bg-gray-200' v-if="user.user_role === 'Funder Admin' || batchDetails.workflowLed === 'Seller Led' && currentCompanyRole === 'Seller Admin' || batchDetails.workflowLed === 'Buyer Led' && currentCompanyRole === 'Buyer Admin'">
          <td class='border'>Platform Fee Amount</td>
          <td class='border'>{{batchDetails.currencyCode}} {{$h.formatCurrency(batchDetails.formula.platformFeeAmount)}} </td>
        </tr>
        <tr class='hover:bg-gray-200' v-if="user.user_role === 'Funder Admin' && batchDetails.extraData?.disbursableAccount">
          <td class='border'>Disbursement Bank Account</td>
          <td class='border'>{{batchDetails.extraData.disbursableAccount.bankName}} {{batchDetails.extraData.disbursableAccount.accountNumber}}</td>
        </tr>
        <tr class='hover:bg-gray-200' v-if="user.user_role === 'Funder Admin' || batchDetails.workflowLed === 'Seller Led' && currentCompanyRole === 'Seller Admin' || batchDetails.workflowLed === 'Buyer Led' && currentCompanyRole === 'Buyer Admin'">
          <td class='border'>Disbursement Amount Financed Less Platform Fee</td>
          <td class='border'>{{batchDetails.currencyCode}} {{$h.formatCurrency(batchDetails.formula.disbursableAmount1)}}</td>
        </tr>
        <tr class='hover:bg-gray-200' v-if="user.user_role === 'Funder Admin' || batchDetails.workflowLed === 'Seller Led' && currentCompanyRole === 'Seller Admin' || batchDetails.workflowLed === 'Buyer Led' && currentCompanyRole === 'Buyer Admin'">
          <td class='border'>Balance Settlement Amount to Seller Less Interest Amount</td>
          <td class='border'>{{batchDetails.currencyCode}} {{$h.formatCurrency(batchDetails.formula.disbursableAmount2)}}</td>
        </tr>
        <tr class='hover:bg-gray-200' v-if="currentCompanyRole === 'Buyer Admin' && batchDetail.extraData?.repaymentAccount">
          <td class='border'>Repayment Bank Account</td>
          <td class='border'>{{batchDetails.extraData.repaymentAccount.bankName}} {{batchDetails.extraData.repaymentAccount.accountNumber}}</td>
        </tr>
        <tr class='hover:bg-gray-200'>
          <td class='border'>Repayment Amount To Funder</td>
          <td class='border'>{{batchDetails.currencyCode}} {{$h.formatCurrency(batchDetails.formula.repaymentAmountToFunder)}}</td>
        </tr>
        <tr class='hover:bg-gray-200'>
          <td class='border'>Repayment Date</td>
          <td class='border'>{{batchDetails.formula.repaymentDate}}</td>
        </tr>
      </table>
    </div>

    <div v-if='initComponent'>
      <div v-if='visibleWorkflowActions.visibleApproveButton' class='pt-8 flex justify-center'>
        <a href='javascript:;' data-toggle='modal' data-target='#decline-invoice-modal' class='btn btn-secondary w-48 sm:w-auto mr-2' >Decline</a>
        <a href='javascript:;' data-toggle='modal' data-target='#approve-invoice-modal' class='btn btn-primary w-48 sm:w-auto mr-2' >Approve</a>
      </div>
      <div v-if='visibleWorkflowActions.visibleSubmitProposal' class='pt-8 flex justify-center'>
        <a href='javascript:;' data-toggle='modal' data-target='#submit-proposal-modal' class='btn btn-primary w-48 sm:w-auto mr-2' >Approve Transaction</a>
        <a href='javascript:;' data-toggle='modal' data-target='#reject-proposal-modal' class='btn btn-primary w-48 sm:w-auto mr-2' >Reject Transaction</a>
      </div>
      <div v-if='visibleWorkflowActions.visibleSubmitDisbursmentAdvice' class='pt-8 flex justify-center'>
        <a href='javascript:;' data-toggle='modal' data-target='#submit-disbursment-modal' class='btn btn-primary w-48 sm:w-auto mr-2' >Submit Disbursment</a>
      </div>
      <div v-if='visibleWorkflowActions.visibleSellerAcknowledgeOfReceiveDisbursement' class='pt-8 flex justify-center'>
        <a href='javascript:;' @click='openSellerAcknowledgeOfReceiveDisbursementModel' class='btn btn-primary w-48 sm:w-auto mr-2' >Acknowledge Receive of Disbursement</a>
      </div>
      <div v-if='visibleWorkflowActions.visibleBuyerUploadRepaymentAdvice' class='pt-8 flex justify-center'>
        <a href='javascript:;' data-toggle='modal' data-target='#buyer-upload-repayment-advice' class='btn btn-primary w-48 sm:w-auto mr-2' >Upload Repayment Advice</a>
      </div>
      <div v-if='visibleWorkflowActions.visibleFunderAcknowledgeRepaymentAdvice' class='pt-8 flex justify-center'>
        <a href='javascript:;' @click='openFunderAcknowledgeUploadRepaymentAdviceModel' class='btn btn-primary w-48 sm:w-auto mr-2' >Acknowledge Repayment Advice</a>
      </div>
    </div>
    <div v-if="batchMessage.length" class="bg-gray-300 mt-6 text-center">
      <p class='text-gray-700 px-2 py-4 text-left'>Note: {{batchMessage}}</p>
    </div>
  </div>
  <!-- Start: action modal -->
  <div id='approve-invoice-modal' class='modal' tabindex='-1' aria-hidden='true'>
    <div class='modal-dialog modal-lg'>
      <div class='modal-content'>
        <!-- BEGIN: Modal Header -->
        <div class='modal-header'>
          <h2 class='font-medium text-base mr-auto'> Approve Invoice </h2>
        </div>
        <!-- END: Modal Header -->
        <div class='modal-body mx-8'>
          <div class='grid grid-cols-2 grid-flow-row gap-4'>
            <div class='self-center'>Batch Number</div>
            <div class='self-center'>{{batchDetails.batchNumber}}</div>
            <div class='self-center'>Invoice Uploaded Date</div>
            <div class='self-center'>{{moment(batchDetails.batchInformation.uploadDate).format(dateFormat)}}</div>
            <div class='self-center'>Invoice Amount</div>
            <div class='self-center'>{{batchDetails.currencyCode}} {{$h.formatCurrency(batchDetails.batchInformation.totalAmount)}}</div>
            <div class='self-center'>Payment Due Date</div>
            <div class='self-center'>{{moment(batchDetails.batchInformation.paymentDueDate).format(dateFormat)}}</div>
            <div class='self-center' v-if="batchDetails.workflowLed == 'Buyer Led'">Select Disbursement Bank Account</div>
            <div class='self-center' v-if="batchDetails.workflowLed == 'Buyer Led'">
              <select v-model="disbursableBankAccount" class="form-select">
                <option v-for="bank in bankAccounts" :key="bank.bankAccountId" :value="bank.bankAccountId">
                  {{bank.accountNumber}} ({{bank.bankName}})
                </option>
              </select>
            </div>
            <div class='self-center'>Remark</div>
            <div class='self-center'>
              <textarea v-model='remark' class='border-2 w-full form-control' rows='3' />
            </div>
          </div>
          <SignaturePad v-model="signature"/>
        </div>
        <div class='modal-footer text-right'>
          <button type='button' class='btn btn-primary w-24 mr-1' @click='approveAcknowledge' :disabled='modalLoading'>
            Approve
            <LoadingIcon v-if='modalLoading' icon='oval' color='white' class='w-4 h-4 ml-2' />
          </button>
          <button type='button' data-dismiss='modal' class='btn btn-outline-secondary w-20'> Cancel </button>
        </div> <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
  <div id='decline-invoice-modal' class='modal' tabindex='-1' aria-hidden='true'>
    <div class='modal-dialog modal-lg'>
      <div class='modal-content'>
        <!-- BEGIN: Modal Header -->
        <div class='modal-header'>
          <h2 class='font-medium text-base mr-auto'> Decline Invoice </h2>
        </div>
        <!-- END: Modal Header -->
        <div class='modal-body mx-8'>
          <div class='grid grid-cols-2 grid-flow-row gap-4'>
            <div class='self-center'>Batch Number</div>
            <div class='self-center'>{{batchDetails.batchNumber}}</div>
            <div class='self-center'>Invoice Uploaded Date</div>
            <div class='self-center'>{{moment(batchDetails.batchInformation.uploadDate).format(dateFormat)}}</div>
            <div class='self-center'>Invoice Amount</div>
            <div class='self-center'>{{batchDetails.currencyCode}} {{$h.formatCurrency(batchDetails.batchInformation.totalAmount)}}</div>
            <div class='self-center'>Payment Due Date</div>
            <div class='self-center'>{{moment(batchDetails.batchInformation.paymentDueDate).format(dateFormat)}}</div>
            <div class='self-center'>Remark</div>
            <div class='self-center'>
              <textarea v-model='remark' class='border-2 w-full form-control' rows='3' />
            </div>
          </div>
        </div>
        <div class='modal-footer text-right'>
          <button type='button' class='btn btn-primary w-20 mr-1' @click='declineAcknowledge'> Decline </button>
          <button type='button' data-dismiss='modal' class='btn btn-outline-secondary w-20'> Cancel </button>
        </div> <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
  <div id='submit-proposal-modal' class='modal' tabindex='-1' aria-hidden='true'>
    <div class='modal-dialog modal-lg'>
      <div class='modal-content'>
        <!-- BEGIN: Modal Header -->
        <div class='modal-header'>
          <h2 class='font-medium text-base mr-auto'> Approve Transaction </h2>
        </div>
        <!-- END: Modal Header -->
        <div class='modal-body mx-8'>
          <div class='mt-5'>
            <span>Formular</span>
            <table class='table mt-2'>
              <tr class='hover:bg-gray-200'>
                <td class='border'>Batch Number</td>
                <td class='border'>{{batchDetails.batchNumber}}</td>
              </tr>
              <tr class='hover:bg-gray-200'>
                <td class='border'>Total Invoice Amount</td>
                <td class='border'>{{batchDetails.currencyCode}} {{$h.formatCurrency(batchDetails.totalAmount)}}</td>
              </tr>
              <tr class='hover:bg-gray-200'>
                <td class='border'>Value Date</td>
                <td class='border'>
                  <Litepicker v-if="getLockDaysState"
                    v-model='valueDate'
                    :options='{
                      autoApply: false,
                      showWeekNumbers: true,
                      zIndex: 10001,
                      minDate: Date(),
                      maxDate: batchDetail.paymentDueDate,
                      dropdowns: {
                        minYear: 1990,
                        maxYear: null,
                        months: true,
                        years: true
                      },
                      callback: getEstimateCalc,
                      lockDays: lockDays
                    }'
                    class='form-control'
                  />
                </td>
              </tr>
              <tr class='hover:bg-gray-200'>
                <td class='border'>Invoice Due Date</td>
                <td class='border'>{{moment(batchDetails.paymentDueDate).format(dateFormat)}}</td>
              </tr>
              <tr class='hover:bg-gray-200'>
                <td class='border'>Payment Due Date</td>
                <td class='border'>{{moment(batchDetails.paymentDueDate).format(dateFormat)}}</td>
              </tr>
              <tr class='hover:bg-gray-200'>
                <td class='border'>Numbers of Days</td>
                <td class='border'>{{batchDetails.numberOfDays}}</td>
              </tr>
              <tr class='hover:bg-gray-200'>
                <td class='border'>Interest Rate(%)</td>
                <td class='border'>
                  <input type='text' v-model='bidValue' @change='getEstimateCalc' class='form-control'/>
                  <select v-model="interestRateDuration" @change='getEstimateCalc' class="form-select">
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </td>
              </tr>
              <tr class='hover:bg-gray-200'>
                <td class='border'>Repayment Bank Account</td>
                <td class='border'>
                  <select v-model="repaymentBankAccount" class="form-select">
                    <option v-for="bank in bankAccounts" :key="bank.bankAccountId" :value="bank.bankAccountId">
                      {{bank.accountNumber}} ({{bank.bankName}})
                    </option>
                  </select>
                </td>
              </tr>
              <tr class='hover:bg-gray-200'>
                <td class='border'>Interest Earn</td>
                <td class='border'>{{batchDetails.currencyCode}} {{$h.formatCurrency(batchDetails.formula.interestAmount)}}</td>
              </tr>
              <tr class='hover:bg-gray-200'>
                <td class='border'>Platform Fee Amount</td>
                <td class='border'>{{batchDetails.currencyCode}} {{$h.formatCurrency(batchDetails.formula.platformFeeAmount)}}</td>
              </tr>
              <tr class='hover:bg-gray-200'>
                <td class='border'>Disbursement Amount Financed Less Platform Fee</td>
                <td class='border'>
                  {{batchDetails.currencyCode}} {{$h.formatCurrency(batchDetails.formula.disbursableAmount1)}}
                </td>
              </tr>
              <tr class='hover:bg-gray-200' v-if="batchDetails.workflowLed === 'Seller Led'">
                <td class='border'>Balance Settlement Amount to Seller Less Interest Amount</td>
                <td class='border'>{{batchDetails.currencyCode}} {{$h.formatCurrency(batchDetails.formula.disbursableAmount2)}}</td>
              </tr>
              <tr class='hover:bg-gray-200'>
                <td class='border'>Repayment Amount To Funder</td>
                <td class='border'>{{batchDetails.currencyCode}} {{$h.formatCurrency(batchDetails.formula.repaymentAmountToFunder)}}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class='modal-footer text-right'>
          <button type='button' class='btn btn-primary w-24 mr-1' @click='submitProposal' :disabled='modalLoading'>
            Approve
            <LoadingIcon v-if='modalLoading' icon='oval' color='white' class='w-4 h-4 ml-2' />
          </button>
          <button type='button' data-dismiss='modal' class='btn btn-outline-secondary w-20'> Cancel </button>
        </div> <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
  <div id='reject-proposal-modal' class='modal' tabindex='-1' aria-hidden='true'>
    <div class='modal-dialog modal-lg'>
      <div class='modal-content'>
        <!-- BEGIN: Modal Header -->
        <div class='modal-header'>
          <h2 class='font-medium text-base mr-auto'> Reject Transaction </h2>
        </div>
        <!-- END: Modal Header -->
        <div class='modal-body mx-8'>
          <div class='grid grid-cols-2 grid-flow-row gap-4'>
            <div class='self-center'>Remark</div>
            <div class='self-center'>
              <textarea v-model='remark' class='border-2 w-full form-control' rows='3' />
            </div>
          </div>
        </div>
        <div class='modal-footer text-right'>
          <button type='button' class='btn btn-primary w-24 mr-1' @click='rejectProposal' :disabled='modalLoading'>
            Reject
            <LoadingIcon v-if='modalLoading' icon='oval' color='white' class='w-4 h-4 ml-2' />
          </button>
          <button type='button' data-dismiss='modal' class='btn btn-outline-secondary w-20'> Cancel </button>
        </div> <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
  <div id='submit-disbursment-modal' class='modal' tabindex='-1' aria-hidden='true'>
    <div class='modal-dialog modal-lg'>
      <div class='modal-content'>
        <!-- BEGIN: Modal Header -->
        <div class='modal-header'>
          <h2 class='font-medium text-base mr-auto'> Upload fund disbursment payment advice </h2>
        </div>
        <!-- END: Modal Header -->
        <div class='modal-body mx-8'>
          <div>Payment Advice File Upload</div>
          <div v-bind='getRootProps()' class='flex mb-3 justify-center border-red-400 border-dashed border-2 rounded-lg cursor-pointer'>
            <div class='text-center py-5'>
              <template v-if='!files'>
                <input v-bind='getInputProps()' >
                <UploadCloudIcon class='w-24 h-20 text-red-400' />
                <div class='text-lg font-medium text-gray-600'>
                  Drag and drop here<br>or
                </div>
                <div class='text-red-400'>browse</div>
              </template>
              <template v-else>
                <div class='relative'>
                  <div class='absolute top-0 right-1'>
                    <XCircleIcon @click='removeFile' class='w-6 h-6' />
                  </div>
                  <FileTextIcon class='w-24 h-24'/>
                </div>
                {{files[0].name}}
              </template>
            </div>
          </div>
          <div class='grid grid-cols-2 grid-flow-row gap-4'>
            <div class='self-center'>Payment Advice Number</div>
            <div class='self-center'>
              <input type='text' v-model='disbursementData.paymentAdviceNumber' class='form-control'/>
            </div>
            <div class='self-center'>Payment Advice Amount</div>
            <div class='self-center'>
              <input type='text' v-model='disbursementData.paymentAdviceAmount' class='form-control'/>
            </div>
            <div class='self-center'>Currency Code</div>
            <div class='dropdown inline-block' data-placement='bottom'>
              <button class='dropdown-toggle btn btn-primary mr-1' aria-expanded='false'> {{disbursementData.currencyCode}} </button>
              <div class='dropdown-menu' id='currencyCodeDropDown' style='z-index: 10001;'>
                <div class='dropdown-menu__content box dark:bg-dark-1 p-2'>

                  <a v-for='(currency, index) in currencies' :key='index'
                    href='javascript:;'
                    class='block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md'
                    @click='setDisbursmentCurrencyCode(currency.currencyCode)'
                  >
                    {{currency.currencyCode}}
                  </a>
                </div>
              </div>
            </div>
            <div class='self-center'>Payment Advice Date</div>
            <div class='self-center'>
              <Litepicker
                v-model='disbursementData.paymentAdviceDate'
                :options='{
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
                }'
                class='form-control'
              />
            </div>
          </div>
        </div>
        <div class='modal-footer text-right'>
          <button type='button' class='btn btn-primary w-24 mr-1' @click='submitDisbursmentAdvice' :disabled='modalLoading'>
            Submit
            <LoadingIcon v-if='modalLoading' icon='oval' color='white' class='w-4 h-4 ml-2' />
          </button>
          <button type='button' data-dismiss='modal' class='btn btn-outline-secondary w-24'> Cancel </button>
        </div> <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
  <div id='seller-acknowledge-of-receive-disbursement' class='modal' tabindex='-1' aria-hidden='true'>
    <div class='modal-dialog modal-lg' v-if='confirmAbleDisbursementData'>
      <div class='modal-content'>
        <!-- BEGIN: Modal Header -->
        <div class='modal-header'>
          <h2 class='font-medium text-base mr-auto'> Acknowledge receive of disbursement </h2>
        </div>
        <!-- END: Modal Header -->
        <div class='modal-body mx-8'>
          <div class='grid grid-cols-2 grid-flow-row gap-4'>
            <div class='self-center'>Payment Advice Number</div>
            <div class='self-center'>{{confirmAbleDisbursementData.paymentAdviceNumber}}</div>
            <div class='self-center'>Payment Advice File</div>
            <div class='self-center'><a @click="openFileViewer(confirmAbleDisbursementData.paymentAdviceUri)" class="cursor-pointer underline text-blue-500">open file</a></div>
            <div class='self-center'>Payment Advice Amount</div>
            <div class='self-center'>{{confirmAbleDisbursementData.paymentAdviceAmount + ' ' + confirmAbleDisbursementData.currencyCode}}</div>
            <div class='self-center'>Payment Advice Date</div>
            <div class='self-center'>{{moment(confirmAbleDisbursementData.paymentAdviceDate).format(dateFormat)}}</div>
            <div class='self-center'>Remark</div>
            <div class='self-center'>
              <textarea v-model='remark' class='border-2 border w-full form-control' rows='3' />
            </div>
          </div>
          <SignaturePad v-model="signature"/>
        </div>
        <div class='modal-footer text-right'>
          <button type='button' class='btn btn-primary w-24 mr-1' @click='sellerAcknowledgeOfReceiveDisbursement' :disabled='modalLoading'>
            Confirm
            <LoadingIcon v-if='modalLoading' icon='oval' color='white' class='w-4 h-4 ml-2' />
          </button>
          <button type='button' data-dismiss='modal' class='btn btn-outline-secondary w-20'> Cancel </button>
        </div> <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
  <div id='buyer-upload-repayment-advice' class='modal' tabindex='-1' aria-hidden='true'>
    <div class='modal-dialog modal-lg'>
      <div class='modal-content'>
        <!-- BEGIN: Modal Header -->
        <div class='modal-header'>
          <h2 class='font-medium text-base mr-auto'> Upload Repayment Advice </h2>
        </div>
        <!-- END: Modal Header -->
        <div class='modal-body mx-8'>
          <div>Payment Advice File Upload</div>
          <div v-bind='getRootProps()' class='flex mb-3 justify-center border-red-400 border-dashed border-2 rounded-lg cursor-pointer'>
            <div class='text-center py-5'>
              <template v-if='!files'>
                <input v-bind='getInputProps()' >
                <UploadCloudIcon class='w-24 h-20 text-red-400' />
                <div class='text-lg font-medium text-gray-600'>
                  Drag and drop here<br>or
                </div>
                <div class='text-red-400'>browse</div>
              </template>
              <template v-else>
                <div class='relative'>
                  <div class='absolute top-0 right-1'>
                    <XCircleIcon @click='removeFile' class='w-6 h-6' />
                  </div>
                  <FileTextIcon class='w-24 h-24'/>
                </div>
                {{files[0].name}}
              </template>
            </div>
          </div>
          <div class='grid grid-cols-2 grid-flow-row gap-4'>
            <div class='self-center'>Payment Advice Number</div>
            <div class='self-center'>
              <input type='text' v-model='disbursementData.paymentAdviceNumber' class='form-control'/>
            </div>
            <div class='self-center'>Payment Advice Amount</div>
            <div class='self-center'>
              <input type='text' v-model='disbursementData.paymentAdviceAmount' class='form-control'/>
            </div>
            <div class='self-center'>Currency Code</div>
            <div class='dropdown inline-block' data-placement='bottom'>
              <button class='dropdown-toggle btn btn-primary mr-1' aria-expanded='false'> {{disbursementData.currencyCode}} </button>
              <div class='dropdown-menu' id='currencyCodeDropDown' style='z-index: 10001;'>
                <div class='dropdown-menu__content box dark:bg-dark-1 p-2'>
                  <a v-for='(currency, index) in currencies' :key='index'
                    href='javascript:;'
                    class='block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md'
                    @click='setDisbursmentCurrencyCode(currency.currencyCode)'
                  >
                    {{currency.currencyCode}}
                  </a>
                </div>
              </div>
            </div>
            <div class='self-center'>Payment Advice Date</div>
            <div class='self-center'>
              <Litepicker
                v-model='disbursementData.paymentAdviceDate'
                :options='{
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
                }'
                class='form-control'
              />
            </div>
          </div>
        </div>
        <div class='modal-footer text-right'>
          <button type='button' class='btn btn-primary w-24 mr-1' @click='BuyerUploadRepaymentAdvice' :disabled='modalLoading'>
            Submit
            <LoadingIcon v-if='modalLoading' icon='oval' color='white' class='w-4 h-4 ml-2' />
          </button>
          <button type='button' data-dismiss='modal' class='btn btn-outline-secondary w-24'> Cancel </button>
        </div> <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
  <div id='funder-acknowledge-upload-repayment-advice' class='modal' tabindex='-1' aria-hidden='true'>
    <div class='modal-dialog modal-lg' v-if='confirmFunderAcknowledgeReceiveOfRepaymentData'>
      <div class='modal-content'>
        <!-- BEGIN: Modal Header -->
        <div class='modal-header'>
          <h2 class='font-medium text-base mr-auto'> Acknowledge Receive of Repayment </h2>
        </div>
        <!-- END: Modal Header -->
        <div class='modal-body mx-8'>
          <div class='grid grid-cols-2 grid-flow-row gap-4'>
            <div class='self-center'>Payment Advice Number</div>
            <div class='self-center'>{{confirmFunderAcknowledgeReceiveOfRepaymentData.paymentAdviceNumber}}</div>
            <div class='self-center'>Payment Advice File</div>
            <div class='self-center'><a @click="openFileViewer(confirmFunderAcknowledgeReceiveOfRepaymentData.paymentAdviceUri)" class="cursor-pointer underline text-blue-500">open file</a></div>
            <div class='self-center'>Payment Advice Amount</div>
            <div class='self-center'>{{confirmFunderAcknowledgeReceiveOfRepaymentData.paymentAdviceAmount + ' ' + confirmFunderAcknowledgeReceiveOfRepaymentData.currencyCode}}</div>
            <div class='self-center'>Payment Advice Date</div>
            <div class='self-center'>{{moment(confirmFunderAcknowledgeReceiveOfRepaymentData.paymentAdviceDate).format(dateFormat)}}</div>
            <div class='self-center'>Remark</div>
            <div class='self-center'>
              <textarea v-model='remark' class='border-2 border w-full form-control' rows='3' />
            </div>
          </div>
          <SignaturePad v-model="signature"/>
        </div>
        <div class='modal-footer text-right'>
          <button type='button' class='btn btn-primary w-24 mr-1' @click='funderAcknowledgeOfRepaymentComfirm' :disabled='modalLoading'> Confirm </button>
          <button type='button' class='btn btn-danger w-24 mr-1' @click='funderAcknowledgeOfRepaymentDecline'> Decline </button>
          <button type='button' data-dismiss='modal' class='btn btn-outline-secondary w-20'> Cancel </button>
        </div> <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
  <!-- End: action modal -->
  <!-- Start: pdf file show -->
  <div id="show-pdf-file-viewer" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <embed type="application/pdf" :src="openFileUrl" width="1000" height="1500">
      </div>
    </div>
  </div>
  <!-- End: pdf file show -->
  <!-- Start: xlsx file show -->
  <div id="show-xlsx-file-viewer" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-body mx-8 xlsx-viewer">
          <xlsx-read :file="xlsx.file">
            <xlsx-table />
          </xlsx-read>
        </div>
      </div>
    </div>
  </div>
  <!-- End: xlsx file show -->
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { useDropzone } from 'vue3-dropzone'
import _ from 'lodash'
import moment from 'moment'
import { XlsxRead, XlsxTable } from "vue3-xlsx"
import SignaturePad from './SignaturePad.vue'
import toast from '@/utils/toast'

import { sysAxios, appAxios } from '@/plugins/axios'

export default {
  props: {
    workflowExecutionReferenceId: {
      type: String,
      required: true
    },
    batchDetail: {
      type: Object,
      required: true
    },
    adminCompany: {
      type: String,
      required: true
    }
  },
  components: {
    SignaturePad,
    XlsxRead,
    XlsxTable,
  },
  setup(props) {
    const store = useStore()
    const user = store.state.auth
    const xlsx = ref({
      file: null,
      selectedSheet: null,
      sheetName: null,
      sheets: null,
      collection: null
    });
    const openFileUrl = ref('');
    const dateFormat = process.env.VUE_APP_DATE_FORMAT
    const dateTimeFormat = process.env.VUE_APP_DATETIME_FORMAT
    const getLockDaysState = ref(false);
    const batchDetails = ref(props.batchDetail)
    console.log("batchDetails: ", batchDetails.value)
    const provenance = ref([])
    const lastWorkStatus = ref()
    const currencies = ref(null)
    const lockDays = ref([])
    const currentCompanyRole = ref('')
    const visibleWorkflowActions = ref({
      visibleApproveButton: false,
      visibleSubmitProposal: false,
      visibleSubmitDisbursmentAdvice: false,
      visibleSellerAcknowledgeOfReceiveDisbursement: false,
      visibleBuyerUploadRepaymentAdvice: false,
      visibleFunderAcknowledgeRepaymentAdvice: false,
    })
    const bankAccounts = ref([])
    const disbursableBankAccount = ref('')
    const repaymentBankAccount = ref('')
    const batchMessage = ref('')
    const adminCompany = ref(props.adminCompany)
    const signature = ref(null)

    const initComponent = ref(false)
    const modalLoading = ref(false)
    const uploadErrorMessage = ref()
    const remark = ref(null)
    const valueDate = ref()
    const bidValue = ref(null)
    const interestRateDuration = ref('monthly')
    const files = ref()

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

    const onDrop = (acceptFiles, rejectReasons) => {
      if(acceptFiles.length) {
        files.value = acceptFiles
      }
      if(rejectReasons.length) {
        rejectReasons.forEach(reason => {
          var content = reason.errors[0].message
          var title = 'Can not upload ' + reason.file.name + ' file'
          toast({status: 'error', title: title, content: content})
        })
      }
    }

    const options = reactive({
      multiple: true,
      onDrop,
      accept: '.jpg, .csv, .xlsx, .pdf',
    })

    const { getRootProps, getInputProps, ...rest } = useDropzone(options)

    const getProvenanceHistory = () => {
      var currentWorkflowStatusesApi = '/workflow/v2/statustransition/retrieve/byreferenceids?visibility=true'
      appAxios.post(currentWorkflowStatusesApi, [props.workflowExecutionReferenceId]).then(async res => {
        _.map(res.data[0].workflows, (item) => {
          let subProvenance = item.statusTransitions
          subProvenance = subProvenance.sort((a, b) => {
            if(a.order === b.order) return 0
            else if(a.order > b.order) return 1
            else return -1
          })
          provenance.value.push(...subProvenance)
        })

        return {provenance: provenance.value}
      })
    }

    const getCompanyBankAccounts = async () => {
      bankAccounts.value = await appAxios.get(`company/v1/${store.state.account.company_uuid}/bankaccounts`).then(res => {
        return res.data
      })

      return new Promise((resolve) => {
        resolve(bankAccounts.value)
      })
    }

    const getLastWorkflowStatus = async () => {
      const api = '/workflow/v2/statustransition/retrieve/byreferenceids/limittolaststatustransition'
      await appAxios.post(api, [props.workflowExecutionReferenceId]).then(res => {
        console.log('limittolaststatustransition = ', res.data)
        lastWorkStatus.value = res.data[0].workflow.lastStatusTransition
      })

      return new Promise(resolve => resolve('get last workflow status done'))
    }

    const getCurrencyCode = async () => {
      const companyProfileSystemConfig = 'configuration/v1/Company Profile'
      await sysAxios.get(companyProfileSystemConfig).then(res => {
				currencies.value = JSON.parse(_.find(res.data[0].configurations, {name: 'currencies'}).value)
			})

      return new Promise(resolve => resolve(currencies.value))
    }

    const getLockDays = async () => {
      await appAxios.get(`/company/v1/${batchDetails.value.buyerCompanyId}/holidays`).then(res => {
        res.data.forEach(item => {
          if(!lockDays.value.includes(new Date(item.date))) lockDays.value.push(item.date)
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

      return new Promise(resolve => {
        getLockDaysState.value = true;
        return resolve(lockDays.value)
      })
    }

    const invoiceDetailApi = async () => {
      return new Promise((resolve) => {
        const processingFeeApi = `/ledger/v1/paymentinstruction/byworkflowexecutionreferenceid/${props.workflowExecutionReferenceId}`
        appAxios.get(processingFeeApi).then(res => {
          //calculate interest amount
          let dueDt = moment(batchDetails.value.paymentDueDate)
          let valueDt = moment(batchDetails.value.valueDate)
          let noOfDays = dueDt.diff(valueDt,'days')
          batchDetails.value.numberOfDays = noOfDays
          var interestAmount1 = _.find(res.data, {label:'InterestAmount'})
          batchDetails.value.formula.interestAmount = interestAmount1?.amountBeforeTax.toFixed(2)

          var tax1 = _.find(res.data, {fromCompanyId: batchDetails.value.funderCompanyId, toCompanyId: batchDetails.value.sellerCompanyId, label:'FirstDisbursableAmount'})
          batchDetails.value.formula.disbursableAmount1 = tax1?.amountBeforeTax.toFixed(2)
          batchDetails.value.formula.disburableAmount1DueDate = moment.utc(tax1?.dueDate).format(dateFormat)

          var tax2 = _.find(res.data, {fromCompanyId: batchDetails.value.funderCompanyId, toCompanyId: batchDetails.value.sellerCompanyId, label:'FinalDisbursableAmount'})
          batchDetails.value.formula.disbursableAmount2 = tax2?.amountBeforeTax.toFixed(2)
          batchDetails.value.formula.disburableAmount2DueDate = moment.utc(tax2?.dueDate).format(dateFormat)

          var platformFee = _.find(res.data, {fromCompanyId: batchDetails.value.funderCompanyId, toCompanyId: adminCompany.value})
          batchDetails.value.formula.platformFeeAmount = platformFee?.amountBeforeTax
          batchDetails.value.formula.platformFeeDate = platformFee?.dueDate

          resolve({
            numberOfDays: noOfDays,
            interestAmount: batchDetails.value.formula.interestAmount,
            disbursableAmount1: batchDetails.value.formula.disbursableAmount1,
            disburableAmount1DueDate: batchDetails.value.formula.disburableAmount1DueDate,
            disbursableAmount2: batchDetails.value.formula.disbursableAmount2,
            disburableAmount2DueDate: batchDetails.value.formula.disburableAmount2DueDate,
            platformFeeAmount: batchDetails.value.formula.platformFeeAmount,
            platformFeeDate: batchDetails.value.formula.platformFeeDate
          })
        })
      })
    }

    const saveSignature = async () => {
      const fileUploadApi = 'uploads/v1/acknowledgement_signature'
      return new Promise(resolve => {
        let formData = new FormData()
        if(signature.value === null) resolve(null)
        else {
          formData.append('file', signature.value.file)
          sysAxios.post(fileUploadApi, formData, {
            headers: { 'Content-Type': 'multipart/form-data'}
          }).then(res => {
            resolve(`${process.env.VUE_APP_SYSTEM_API_URL}/uploads/v1/${res.data}`)
          })
        }
      })
    }

    const setDisbursmentCurrencyCode = (currencyCode) => {
      disbursementData.value.currencyCode = currencyCode
    }

    const uploadFile = async () => {
      const fileUploadApi = 'uploads/v1/payment_advice'
      let formData = new FormData()
      formData.append('file', files.value[0])
      let res = await sysAxios.post(fileUploadApi, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
      })
      disbursementData.value.paymentAdviceUri = process.env.VUE_APP_SYSTEM_API_URL + '/uploads/v1/' + res.data
    }

    const removeFile = () => files.value = null

    const openFileViewer = async (url) => {
      const api = url
      const fileResponse = await sysAxios.get(api, {responseType: 'blob'})
      const externalLinkContentType = ['image/jpeg', 'image/png', 'text/plain']
      if(externalLinkContentType.includes(fileResponse.headers['content-type'])) {
        const file = new Blob([fileResponse.data], {type: fileResponse.headers['content-type']});
        const fileURL = URL.createObjectURL(file);
        // openFileUrl.value = fileURL
        // cash("#show-pdf-file-viewer").modal("show")
        window.open(fileURL);
      } else if (fileResponse.headers['content-type'] === 'application/pdf') {
        const file = new Blob([fileResponse.data], {type: 'application/pdf'});

        const fileURL = URL.createObjectURL(file);
        openFileUrl.value = fileURL
        cash('#show-pdf-file-viewer').modal("show")
      } else if (fileResponse.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const file = new Blob([fileResponse.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        xlsx.value.file = file

        cash("#show-xlsx-file-viewer").modal("show")
      }
    }

    const openSellerAcknowledgeOfReceiveDisbursementModel = async () => {
      var paymentInstructionId
      if(batchDetails.value.workflowLed === 'Buyer Led') paymentInstructionId = await getpaymentInstructionId('DisbursableAmount')
      else if(batchDetails.value.workflowLed === 'Seller Led' && lastWorkStatus.value.statusName === 'FIRST_FUND_DISBURSEMENT_NOTIFICATION_SENT_TO_SELLER') paymentInstructionId = await getpaymentInstructionId('FirstDisbursableAmount')
      else if(batchDetails.value.workflowLed === 'Seller Led' && lastWorkStatus.value.statusName === 'FINAL_FUND_DISBURSEMENT_NOTIFICATION_SENT_TO_SELLER') paymentInstructionId = await getpaymentInstructionId('FinalDisbursableAmount')

      const api = `/ledger/v1/paymentadvice/byworkflowexecutionreferenceid/${props.workflowExecutionReferenceId}`
      const resData = await appAxios.get(api)
      confirmAbleDisbursementData.value = {..._.find(resData.data, {paymentInstructionId: paymentInstructionId}) }

      cash('#seller-acknowledge-of-receive-disbursement').modal('show')
    }

    const openFunderAcknowledgeUploadRepaymentAdviceModel = async () => {
      const paymentInstructionId = await getpaymentInstructionId('RepaymentAmount')
      const api = `/ledger/v1/paymentadvice/byworkflowexecutionreferenceid/${props.workflowExecutionReferenceId}`
      const resData = await appAxios.get(api)
      confirmFunderAcknowledgeReceiveOfRepaymentData.value = {..._.find(resData.data, {paymentInstructionId: paymentInstructionId}) }
      cash('#funder-acknowledge-upload-repayment-advice').modal('show')
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
      const signatureUrl = await saveSignature()
      var requestBody = null
      if(signatureUrl) {
        let api = ''
        if(batchDetails.value.workflowLed === 'Seller Led') {
          api = '/workflow/v2/seller-led-invoice-financing-workflow-1/buyer-acknowledge-the-transaction-branch/0'
          requestBody = {
            externalReferenceId: props.workflowExecutionReferenceId,
            remark: remark.value,
            signatureUri: signatureUrl,
          }
        } else {
          api = '/workflow/v2/buyer-led-invoice-financing-workflow-0/seller-acknowledge-the-transaction-branch/0'
          requestBody = {
            externalReferenceId: props.workflowExecutionReferenceId,
            remark: remark.value,
            signatureUri: signatureUrl,
            disbursableBankAccount: _.find(bankAccounts.value, {bankAccountId: disbursableBankAccount.value})
          }
        }

        await appAxios.post(api, requestBody).then(res => {
          modalLoading.value = false
          if(res.status === 200) {
            cash('#approve-invoice-modal').modal('hide')
            visibleWorkflowActions.value.visibleApproveButton = false
          }
          updateProvenanceApi()
        })
      }
      else {
        toast({status: 'error', title: 'Bid Failed', content: 'Your signature is required!'})
        modalLoading.value = false
      }
    }

    const declineAcknowledge = async () => {
      var api = ''
      if(batchDetails.value.workflowLed === 'Buyer Led') api = '/workflow/v2/buyer-led-invoice-financing-workflow-0/seller-not-acknowledge-the-transaction-branch/0'
      else api = '/workflow/v2/seller-led-invoice-financing-workflow-1/buyer-not-acknowledge-the-transaction-branch/0'
      appAxios.post(api, {
        externalReferenceId: props.workflowExecutionReferenceId,
        remarks: remark.value,
      }).then(res => {
        if(res.status === 200) {
          visibleWorkflowActions.value.visibleApproveButton = false
          cash('#decline-invoice-modal').modal('hide')
          updateProvenanceApi()
        }
      })
    }

    const getEstimateCalc = async () => {
      if(valueDate.value != '' && valueDate.value != null && valueDate.value != undefined){
        batchDetails.value.valueDate = valueDate.value
        let dueDt = moment(batchDetails.value.paymentDueDate)
        let valueDt = moment(valueDate.value)
        let noOfDays = dueDt.diff(valueDt,'days')
        batchDetails.value.numberOfDays = noOfDays
      }
      if(bidValue.value != ''
        && bidValue.value != null && bidValue.value != undefined
        && valueDate.value != ''
        && valueDate.value != null && valueDate.value != undefined
      ) {
        let apiUrl = ''
        if(batchDetails.value.workflowLed === 'Buyer Led'){
          apiUrl = `/workflow/v2/buyer-led-invoice-financing-workflow-0/estimates?what=PayableAmounts&refId=${props.workflowExecutionReferenceId}&interestRate=${bidValue.value}&interestRateDuration=${interestRateDuration.value}&valueDate=${valueDate.value}`
          //started by buyer
        }
        else{
          apiUrl = `/workflow/v2/seller-led-invoice-financing-workflow-1/estimates?what=PayableAmounts&refId=${props.workflowExecutionReferenceId}&interestRate=${bidValue.value}&interestRateDuration=${interestRateDuration.value}&valueDate=${valueDate.value}`
          //started by seller
        }
        await appAxios.get(apiUrl).then(res => {
          let data = res.data
          batchDetails.value.formula.disburableAmount1DueDate = moment(data.disburableAmount1DueDate).format(dateFormat)
          batchDetails.value.formula.disburableAmount2DueDate = moment(data.disburableAmount2DueDate).format(dateFormat)
          if(batchDetails.value.workflowLed === 'Seller Led') {
            batchDetails.value.formula.disbursableAmount1 = data.disbursableAmount1.toFixed(2)
            batchDetails.value.formula.disbursableAmount2 = data.disbursableAmount2.toFixed(2)
          } else {
            batchDetails.value.formula.disbursableAmount1 = data.disbursableAmount.toFixed(2)
          }

          batchDetails.value.formula.interestAmount = data.interestAmount.toFixed(2)
          batchDetails.value.formula.platformFeeAmount = data.platformFeeAmount.toFixed(2)
          batchDetails.value.formula.platformFeeAmountDueDate = moment(data.platformFeeAmountDueDate).format(dateFormat)
          batchDetails.value.formula.repaymentAmount = data.repaymentAmount.toFixed(2)
          batchDetails.value.formula.repaymentAmountDueDate = moment(data.repaymentAmountDueDate).format(dateFormat)
        })
      }
    }

    const getFormulaFee = async () => {
      return new Promise(async (resolve) => {
        if(batchDetails.value.interestRate) {
          var apiUrl = ''
          if(batchDetails.value.workflowLed === 'Buyer Led'){
          apiUrl = `/workflow/v2/buyer-led-invoice-financing-workflow-0/estimates?what=PayableAmounts&refId=${props.workflowExecutionReferenceId}&interestRate=${batchDetails.value.interestRate}&interestRateDuration=${batchDetails.value.interestRateDuration}&valueDate=${batchDetails.value.valueDate}`
          //started by buyer
          }
          else{
            apiUrl = `/workflow/v2/seller-led-invoice-financing-workflow-1/estimates?what=PayableAmounts&refId=${props.workflowExecutionReferenceId}&interestRate=${batchDetails.value.interestRate}&interestRateDuration=${batchDetails.value.interestRateDuration}&valueDate=${batchDetails.value.valueDate}`
            //started by seller
          }
          await appAxios.get(apiUrl).then(res => {
            let data = res.data

            batchDetails.value.formula.disburableAmount1DueDate = moment(data.disburableAmount1DueDate).format(dateFormat)
            batchDetails.value.formula.disburableAmount2DueDate = moment(data.disburableAmount2DueDate).format(dateFormat)
            if(batchDetails.value.workflowLed === 'Seller Led') {
              batchDetails.value.formula.disbursableAmount1 = data.disbursableAmount1.toFixed(2)
              batchDetails.value.formula.disbursableAmount2 = data.disbursableAmount2.toFixed(2)
            } else {
              batchDetails.value.formula.disbursableAmount1 = data.disbursableAmount.toFixed(2)
            }

            batchDetails.value.formula.interestAmount = data.interestAmount.toFixed(2)
            batchDetails.value.formula.platformFeeAmount = data.platformFeeAmount.toFixed(2)
            batchDetails.value.formula.platformFeeAmountDueDate = moment(data.platformFeeAmountDueDate).format(dateFormat)
            batchDetails.value.formula.repaymentAmount = data.repaymentAmount.toFixed(2)
            batchDetails.value.formula.repaymentAmountDueDate = moment(data.repaymentAmountDueDate).format(dateFormat)
          })
        }

        resolve('get formula fee')
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
          interestRateDuration: interestRateDuration.value,
          repaymentAccount: _.find(bankAccounts.value, {bankAccountId: repaymentBankAccount.value})
        }
      }).then(res => {
        modalLoading.value = false
        if(res.status === 201) {
          cash('#submit-proposal-modal').modal('hide')
          visibleWorkflowActions.value.visibleSubmitProposal = false
          updateProvenanceApi()
        }
      })
    }

    const rejectProposal = async () => {
      modalLoading.value = true
      const api = `/bidding/v1/${batchDetails.value.workflowExecutionReferenceId}/reject`
      appAxios.put(api, {
        reject: {
          companyId: store.state.account.company_uuid,
          remark: remark.value
        }
      }).then(res => {
        modalLoading.value = false
        if(res.status === 201) {
          cash('#reject-proposal-modal').modal('hide')
          visibleWorkflowActions.value.visibleRejectProposal = false
          updateProvenanceApi()
        }
      })
    }

    const submitDisbursmentAdvice = async () => {
      modalLoading.value = true
      await uploadFile()
      var api = ''
      if(batchDetails.value.workflowLed === 'Buyer Led') {
        disbursementData.value.paymentInstructionId = await getpaymentInstructionId('DisbursableAmount')
        api = '/workflow/v2/buyer-led-invoice-financing-workflow-0/funder-identified-after-bidding-branch/20'
      }
      else if(batchDetails.value.workflowLed === 'Seller Led' && lastWorkStatus.value.statusName === 'FIRST_FUND_DISBURSEMENT_INSTRUCTION_SENT_TO_FUNDER') {
        disbursementData.value.paymentInstructionId = await getpaymentInstructionId('FirstDisbursableAmount')
        api = '/workflow/v2/seller-led-invoice-financing-workflow-1/funder-identified-after-bidding-branch/20'
      } else if(batchDetails.value.workflowLed === 'Seller Led' && lastWorkStatus.value.statusName === 'FINAL_FUND_DISBURSEMENT_INSTRUCTION_SENT_TO_FUNDER') {
        disbursementData.value.paymentInstructionId = await getpaymentInstructionId('FinalDisbursableAmount')
        api = '/workflow/v2/seller-led-invoice-financing-workflow-1/funder-acknowledge-received-of-repayment-branch/20'
      }
      const requestBody = {
        externalReferenceId: batchDetails.value.workflowExecutionReferenceId,
        paymentInstructionId: disbursementData.value.paymentInstructionId,
        paymentAdviceNumber: disbursementData.value.paymentAdviceNumber,
        paymentAdviceFileName: files.value[0].name,
        paymentAdviceUri: disbursementData.value.paymentAdviceUri,
        paymentAdviceAmount: disbursementData.value.paymentAdviceAmount,
        currencyCode: disbursementData.value.currencyCode,
        paymentAdviceDate: moment.utc(disbursementData.value.paymentAdviceDate).format()
      }

      appAxios.post(api, requestBody).then(res => {
        modalLoading.value = false
        if(res.status == '200') {
          cash('#submit-disbursment-modal').modal('hide')
          visibleWorkflowActions.value.visibleSubmitDisbursmentAdvice = false
          updateProvenanceApi()
        }
      })
    }

    const sellerAcknowledgeOfReceiveDisbursement = async () => {
     modalLoading.value = true
      const signatureUrl = await saveSignature()
      if(signatureUrl) {
        var api = ''
        if(batchDetails.value.workflowLed === 'Buyer Led') api = '/workflow/v2/buyer-led-invoice-financing-workflow-0/seller-acknowledged-receive-of-disbursement-branch/0'
        else if(batchDetails.value.workflowLed === 'Seller Led' && lastWorkStatus.value.statusName === 'FIRST_FUND_DISBURSEMENT_NOTIFICATION_SENT_TO_SELLER') api = '/workflow/v2/seller-led-invoice-financing-workflow-1/seller-acknowledged-receive-of-first-disbursement-branch/0'
        else if(batchDetails.value.workflowLed === 'Seller Led' && lastWorkStatus.value.statusName === 'FINAL_FUND_DISBURSEMENT_NOTIFICATION_SENT_TO_SELLER') api = '/workflow/v2/seller-led-invoice-financing-workflow-1/seller-acknowledged-receive-of-final-disbursement-branch/0'

        const request = {
          externalReferenceId: props.workflowExecutionReferenceId,
          signatureUri: signatureUrl,
          remarks: remark.value
        }
        await appAxios.post(api, request).then(res => {
          modalLoading.value = false
          if(res.status === 200) {
            cash('#seller-acknowledge-of-receive-disbursement').modal('hide')
            visibleWorkflowActions.value.visibleSellerAcknowledgeOfReceiveDisbursement = false
            updateProvenanceApi()
          }
        })
      }
      else {
        toast({status: 'error', title: 'Acknowledge Failed', content: 'Your signature is required!'})
        modalLoading.value = false
      }
    }

    const BuyerUploadRepaymentAdvice = async () => {
      modalLoading.value = true
      await uploadFile()
      var api = ''
      if(batchDetails.value.workflowLed === 'Buyer Led') api = '/workflow/v2/buyer-led-invoice-financing-workflow-0/seller-acknowledged-receive-of-disbursement-branch/20'
      if(batchDetails.value.workflowLed === 'Seller Led') api = '/workflow/v2/seller-led-invoice-financing-workflow-1/seller-acknowledged-receive-of-first-disbursement-branch/20'
      disbursementData.value.paymentInstructionId = await getpaymentInstructionId('RepaymentAmount')
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
        if(res.status === 200) {
         visibleWorkflowActions.value.visibleBuyerUploadRepaymentAdvice = false
         cash('#buyer-upload-repayment-advice').modal('hide')
        }

        updateProvenanceApi()
      })
    }

    const funderAcknowledgeOfRepaymentComfirm = async () => {
      modalLoading.value = true
      const signatureUrl = await saveSignature()
      if(signatureUrl) {
        var api = ''
        if(batchDetails.value.workflowLed === 'Buyer Led') api = '/workflow/v2/buyer-led-invoice-financing-workflow-0/funder-acknowledge-received-of-repayment-branch/0'
        if(batchDetails.value.workflowLed === 'Seller Led') api = '/workflow/v2/seller-led-invoice-financing-workflow-1/funder-acknowledge-received-of-repayment-branch/0'
        const request = {
          externalReferenceId: props.workflowExecutionReferenceId,
          signatureUri: signatureUrl,
          remarks: remark.value
        }
        await appAxios.post(api, request).then(res => {
          modalLoading.value = false
          if(res.status === 200){
            cash('#funder-acknowledge-upload-repayment-advice').modal('hide')
            updateProvenanceApi()
            visibleWorkflowActions.value.visibleFunderAcknowledgeRepaymentAdvice = false
          }
        })
      }
      else {
        toast({status: 'error', title: 'Funder Acknowledge Failed', content: 'Your signature is required!'})
        modalLoading.value = false
      }
    }

    const funderAcknowledgeOfRepaymentDecline = async () => {
      if(batchDetails.value.workflowLed === 'Buyer Led') api = '/workflow/v2/buyer-led-invoice-financing-workflow-0/funder-not-acknowledged-receive-of-repayment-branch/0'
      if(batchDetails.value.workflowLed === 'Seller Led') api = '/workflow/v2/seller-led-invoice-financing-workflow-1/funder-not-acknowledged-receive-of-repayment-branch/0'
      const request = {
        externalReferenceId: props.workflowExecutionReferenceId,
        remarks: remark.value
      }
      await appAxios.post(api, request).then(res => {
        cash('#funder-acknowledge-upload-repayment-advice').modal('hide')
        updateProvenanceApi()
        visibleWorkflowActions.value.visibleFunderAcknowledgeRepaymentAdvice = false
      })
    }

    const updateProvenanceApi =  () => {
      console.log('need to update provenance api because new action was invoked')
      store.dispatch('main/NeedUpdateProvenanceHistory')
      init()
    }

    const getValueDate = () => {
      return new Promise( async (resolve, reject) => {
        var apiUrl = ''
        if(batchDetails.value.workflowLed === 'Buyer Led') apiUrl = `/workflow/v2/buyer-led-invoice-financing-workflow-0/estimates?what=ValueDate&refId=${props.workflowExecutionReferenceId}`
        else apiUrl = `/workflow/v2/seller-led-invoice-financing-workflow-1/estimates?what=ValueDate&refId=${props.workflowExecutionReferenceId}`

        appAxios.get(apiUrl).then(res => {
          valueDate.value = moment(res.data).format('DD MMM YYYY')
          if(batchDetails.value.valueDate == '0001-01-01T00:00:00') {
            batchDetails.value.valueDate = moment(res.data).format('DD MMM YYYY')
          }
          resolve(valueDate.value)
        })
      })
    }

    const init = async () => {
      await getValueDate()
      await Promise.all([
        // getFormulaFee(),
        getCompanyBankAccounts(),
        getProvenanceHistory(),
        getLastWorkflowStatus(),
        getCurrencyCode(),
        getLockDays(),
        invoiceDetailApi(),
      ]).then(values => {
        console.log("promise all return value = ", values)
      })

      //determine current company is seller role or buyer role in this invoice
      if(batchDetails.value.workflowLed == 'Buyer Led') {
        if(batchDetails.value.initiatedByCompanyId === store.state.account.company_uuid) currentCompanyRole.value = 'Buyer Admin'
        else currentCompanyRole.value = 'Seller Admin'
      } else {
        if(batchDetails.value.initiatedByCompanyId === store.state.account.company_uuid) currentCompanyRole.value = 'Seller Admin'
        else currentCompanyRole.value = 'Buyer Admin'
      }

      console.log("last work status  = ", lastWorkStatus.value['statusName'])
      console.log("current user role = ", user.user_role)
      console.log("current company role = ", currentCompanyRole.value)
      console.log("batchdetails workflow led = ", batchDetails.value.workflowLed)

      if(batchDetails.value.batchStatus !== "Rejected") {
        //determine what action button should be showed in Batch Detail page
        if(batchDetails.value.workflowLed === 'Buyer Led') {
          if(lastWorkStatus.value['statusName'] === 'NOTIFICATION_SENT_TO_SELLER' && currentCompanyRole.value === 'Seller Admin') {
            if(new Date(batchDetails.value.paymentDueDate) < new Date() || new Date(batchDetails.value.bidEndTime) < new Date()) {
              batchMessage.value = 'This invoice has been expired. The payment Due Date is ' + moment(batchDetails.value.paymentDueDate).format(dateTimeFormat)
            } else visibleWorkflowActions.value.visibleApproveButton = true
          }
          else if(lastWorkStatus.value['statusName'] === 'INVITATION_SENT_TO_FUNDERS' && user.user_role === 'Funder Admin') {
            if(new Date(batchDetails.value.bidEndTime) < new Date()) {
              batchMessage.value = 'You cannot approve this invoice due to passed bid end time ('+moment(batchDetails.value.bidEndTime).format(dateTimeFormat) + ')'
            } else {
              const api = `bidding/v1/${props.workflowExecutionReferenceId}`
              await appAxios.get(api).then(res => {
                let hasVoted = _.findIndex(res.data[0].votes, {companyId: store.state.account.company_uuid}) >= 0
                let hasRejected = _.findIndex(res.data[0].rejections, {companyId: store.state.account.company_uuid}) >= 0
                if(!hasVoted && !hasRejected) {
                  visibleWorkflowActions.value.visibleSubmitProposal = true
                  visibleWorkflowActions.value.visibleSubmitReject = true
                }
                else {
                  visibleWorkflowActions.value.visibleSubmitProposal = false
                  visibleWorkflowActions.value.visibleSubmitReject = false
                  batchMessage.value = 'You have already responded to this bid. Please wait until the bidding is finished at '+moment(batchDetails.value.bidEndTime).format(dateTimeFormat)
                }
              })
            }
          }
          else if(lastWorkStatus.value['statusName'] === 'FUND_DISBURSEMENT_INSTRUCTION_SENT_TO_FUNDER' && user.user_role === 'Funder Admin') visibleWorkflowActions.value.visibleSubmitDisbursmentAdvice = true
          else if(lastWorkStatus.value['statusName'] === 'FUND_DISBURSEMENT_NOTIFICATION_SENT_TO_SELLER' && currentCompanyRole.value === 'Seller Admin') visibleWorkflowActions.value.visibleSellerAcknowledgeOfReceiveDisbursement = true
          else if(lastWorkStatus.value['statusName'] === 'REPAYMENT_INSTRUCTION_SENT_TO_BUYER' && currentCompanyRole.value === 'Buyer Admin') visibleWorkflowActions.value.visibleBuyerUploadRepaymentAdvice = true
          else if(lastWorkStatus.value['statusName'] === 'REPAID_BY_BUYER' && user.user_role === 'Funder Admin') visibleWorkflowActions.value.visibleFunderAcknowledgeRepaymentAdvice = true
        } else {
          if(lastWorkStatus.value['statusName'] === 'NOTIFICATION_SENT_TO_BUYER' && currentCompanyRole.value === 'Buyer Admin') {
            if(new Date(batchDetails.value.paymentDueDate) < new Date() || new Date(batchDetails.value.bidEndTime) < new Date()) {
              batchMessage.value = 'You cannot approve this invoice due to passed bid end time ('+moment(batchDetails.value.bidEndTime).format(dateTimeFormat) + ')'
            } else visibleWorkflowActions.value.visibleApproveButton = true
          }
          else if(lastWorkStatus.value['statusName'] === 'INVITATION_SENT_TO_FUNDERS' && user.user_role === 'Funder Admin') {
            if(new Date(batchDetails.value.bidEndTime) < new Date()) {
              batchMessage.value = 'You cannot approve this invoice due to passed bid end time ('+moment(batchDetails.value.bidEndTime).format(dateTimeFormat) + ')'
            } else {
              const api = `bidding/v1/${batchDetails.value.workflowExecutionReferenceId}`
              appAxios.get(api).then(res => {
                let hasVoted = _.findIndex(res.data[0].votes, {companyId: store.state.account.company_uuid}) >= 0
                let hasRejected = _.findIndex(res.data[0].rejections, {companyId: store.state.account.company_uuid}) >= 0
                if(!hasVoted && !hasRejected) {
                  visibleWorkflowActions.value.visibleSubmitProposal = true
                  visibleWorkflowActions.value.visibleSubmitReject = true
                }
                else {
                  visibleWorkflowActions.value.visibleSubmitProposal = false
                  visibleWorkflowActions.value.visibleSubmitReject = false
                  batchMessage.value = 'You have already responded to this bid. Please wait until the bidding is finished at '+moment(batchDetails.value.bidEndTime).format(dateTimeFormat)
                }
              })
            }
          }
          else if(lastWorkStatus.value['statusName'] === 'FIRST_FUND_DISBURSEMENT_INSTRUCTION_SENT_TO_FUNDER' && user.user_role === 'Funder Admin') visibleWorkflowActions.value.visibleSubmitDisbursmentAdvice = true
          else if(lastWorkStatus.value['statusName'] === 'FIRST_FUND_DISBURSEMENT_NOTIFICATION_SENT_TO_SELLER' && currentCompanyRole.value === 'Seller Admin') visibleWorkflowActions.value.visibleSellerAcknowledgeOfReceiveDisbursement = true
          else if(lastWorkStatus.value['statusName'] === 'REPAYMENT_INSTRUCTION_SENT_TO_BUYER' && currentCompanyRole.value === 'Buyer Admin') visibleWorkflowActions.value.visibleBuyerUploadRepaymentAdvice = true
          else if(lastWorkStatus.value['statusName'] === 'REPAID_BY_BUYER' && user.user_role === 'Funder Admin') visibleWorkflowActions.value.visibleFunderAcknowledgeRepaymentAdvice = true
          else if(lastWorkStatus.value['statusName'] === 'FINAL_FUND_DISBURSEMENT_INSTRUCTION_SENT_TO_FUNDER' && user.user_role === 'Funder Admin') visibleWorkflowActions.value.visibleSubmitDisbursmentAdvice = true
          else if(lastWorkStatus.value['statusName'] === 'FINAL_FUND_DISBURSEMENT_NOTIFICATION_SENT_TO_SELLER' && currentCompanyRole.value === 'Seller Admin') visibleWorkflowActions.value.visibleSellerAcknowledgeOfReceiveDisbursement = true
        }
      } else {
        batchMessage.value = batchDetails.value.remarks
        if(lastWorkStatus.value.statusName === 'INVITATION_SENT_TO_FUNDERS') {
          batchMessage.value = 'The invoice has been rejected by funders. No one approved this invoice'
        }
        console.log('lastworkstatus: ', lastWorkStatus.value)
      }

      console.log('visibleWorkflowActions = ', visibleWorkflowActions.value)
    }

    onMounted(async () => {
      await init()
      initComponent.value = true
    })

    return {
      lodash: _,
      moment,
      xlsx,
      openFileUrl,
      initComponent,
      dateFormat,
      dateTimeFormat,
      batchDetails,
      modalLoading,
      provenance,
      user,
      currentCompanyRole,
      lastWorkStatus,
      currencies,
      lockDays,
      signature,
      visibleWorkflowActions,
      batchMessage,
      approveAcknowledge,
      bankAccounts,
      disbursableBankAccount,
      repaymentBankAccount,
      declineAcknowledge,
      remark,
      valueDate,
      getEstimateCalc,
      bidValue,
      interestRateDuration,
      submitProposal,
      rejectProposal,
      getRootProps,
      getInputProps,
      uploadFile,
      removeFile,
      disbursementData,
      setDisbursmentCurrencyCode,
      files,
      uploadErrorMessage,
      submitDisbursmentAdvice,
      confirmAbleDisbursementData,
      confirmFunderAcknowledgeReceiveOfRepaymentData,
      openSellerAcknowledgeOfReceiveDisbursementModel,
      openFunderAcknowledgeUploadRepaymentAdviceModel,
      sellerAcknowledgeOfReceiveDisbursement,
      BuyerUploadRepaymentAdvice,
      funderAcknowledgeOfRepaymentComfirm,
      funderAcknowledgeOfRepaymentDecline,
      getLockDaysState,
      openFileViewer
    }
  },
}
</script>
