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
          <td class='border'>{{batchDetails.batchInformation.buyerCompany}}</td>
        </tr>
        <tr class='hover:bg-gray-200'>
          <td class='border'>Seller Company</td>
          <td class='border'>{{batchDetails.batchInformation.sellerCompany ? batchDetails.batchInformation.sellerCompany : 'NA'}}</td>
        </tr>
        <tr class='hover:bg-gray-200' v-if="lodash.find(provenance, {statusName: 'AWAITING_BIDDING_RESULT'})?.passed">
          <td class='border'>Funder Company</td>
          <td class='border'>{{batchDetails.batchInformation.funderCompany ? batchDetails.batchInformation.funderCompany : 'NA'}}</td>
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
        <tr class='hover:bg-gray-200' v-if="user.user_role === 'Funder Admin' || batchDetails.sellerCompanyId == currentLoginCompanyId">
          <td class='border w-1/2'>Interest Rate (Annual Rate %)</td>
          <td class='border'>{{batchDetails.formula.interestRate}}%</td>
        </tr>
        <tr class='hover:bg-gray-200' v-if="user.user_role === 'Funder Admin' || batchDetails.sellerCompanyId == currentLoginCompanyId">
          <td class='border'>Interest Earn</td>
          <td class='border'>{{batchDetails.currencyCode}} {{batchDetails.formula.interestAmount}}</td>
        </tr> 
        <tr class='hover:bg-gray-200' v-if="user.user_role === 'Funder Admin' || batchDetails.sellerCompanyId == currentLoginCompanyId">
          <td class='border'>Platform Fee Amount</td>
          <td class='border'>{{batchDetails.currencyCode}} {{$h.formatCurrency(batchDetails.formula.platformFeeAmount)}} </td>
        </tr> 
        <tr class='hover:bg-gray-200' v-if="user.user_role === 'Funder Admin' || batchDetails.sellerCompanyId == currentLoginCompanyId">
          <td class='border'>Disbursement Amount Financed Less Interest and Fees</td>
          <td class='border'>{{batchDetails.currencyCode}} {{$h.formatCurrency(batchDetails.formula.disbursableAmount1)}}</td>
        </tr>  
        <tr class='hover:bg-gray-200' v-if="user.user_role === 'Funder Admin' || batchDetails.sellerCompanyId == currentLoginCompanyId">
          <td class='border'>Balance Settlement Amount to Seller</td>
          <td class='border'>{{batchDetails.currencyCode}} {{$h.formatCurrency(batchDetails.formula.disbursableAmount2)}}</td>
        </tr>  
        <tr class='hover:bg-gray-200'>
          <td class='border'>Repayment Amount To Funder</td>
          <td class='border'>{{batchDetails.currencyCode}} {{$h.formatCurrency(batchDetails.formula.repaymentAmountToFunder)}} </td>
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
            <div class='self-center'>{{batchDetails.currencyCode}} {{batchDetails.batchInformation.totalAmount}}</div>
            <div class='self-center'>Payment Due Date</div>
            <div class='self-center'>{{moment(batchDetails.batchInformation.paymentDueDate).format(dateFormat)}}</div>
            <div class='self-center'>Remark</div>
            <div class='self-center'>
              <textarea v-model='remark' class='border-2 w-full' rows='3' />
            </div>
          </div>
          <signature-pad
            :modelValue='signatureFile'
            @input='onInput'
            :height='150'
            :customStyle="{ border: 'gray 1px solid', borderRadius: '25px', width: '100%' }"
            saveType='image/png'
            saveOutput='file'
            ref='signaturePad' />
          <div class='grid grid-cols-3 grid-flow-row gap-4 mt-2'>
            <button @click='undoSignature' class='btn btn-warning'>Undo signature</button>
            <button @click='clearSignature' class='btn btn-danger'>Clear signature</button>
          </div>
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
            <div class='self-center'>{{batchDetails.batchInformation.totalAmount}}</div>
            <div class='self-center'>Payment Due Date</div>
            <div class='self-center'>{{moment(batchDetails.batchInformation.paymentDueDate).format(dateFormat)}}</div>
            <div class='self-center'>Remark</div>
            <div class='self-center'>
              <textarea v-model='remark' class='border-2 w-full' rows='3' />
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
                <td class='border'>{{batchDetails.currencyCode}} {{batchDetails.totalAmount}}</td>
              </tr> 
              <tr class='hover:bg-gray-200'>
                <td class='border'>Value Date</td>
                <td class='border'>
                  <Litepicker
                    v-model='valueDate'
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
                      },
                      callback:getEstimateCalc(),
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
                <td class='border'>Interest Rate(Annual Rate %)</td>
                <td class='border'>
                  <input type='text' v-model='bidValue' @change='getEstimateCalc' class='form-control'/>
                </td>
              </tr>  
              <tr class='hover:bg-gray-200'>
                <td class='border'>Interest Earn</td>
                <td class='border'>{{batchDetails.currencyCode}} {{batchDetails.formula.interestAmount}}</td>
              </tr> 
              <tr class='hover:bg-gray-200'>
                <td class='border'>Platform Fee Amount</td>
                <td class='border'>{{batchDetails.currencyCode}} {{batchDetails.formula.platformFeeAmount}}</td>
              </tr> 
              <tr class='hover:bg-gray-200'>
                <td class='border'>Disbursement Amount Financed Less Interest and Fees</td>
                <td class='border'>{{batchDetails.currencyCode}} {{batchDetails.formula.disbursableAmount1}}</td>
              </tr>  
              <tr class='hover:bg-gray-200'>
                <td class='border'>Balance Settlement Amount to Seller</td>
                <td class='border'>{{batchDetails.currencyCode}} {{batchDetails.formula.disbursableAmount2}}</td>
              </tr>  
              <tr class='hover:bg-gray-200'>
                <td class='border'>Repayment Amount To Funder</td>
                <td class='border'>{{batchDetails.currencyCode}} {{batchDetails.formula.repaymentAmountToFunder}}</td>
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
            <div class='self-center'>{{confirmAbleDisbursementData.paymentAdviceNumber}}</div>
            <div class='self-center'>Payment Advice Amount</div>
            <div class='self-center'>{{confirmAbleDisbursementData.paymentAdviceAmount + ' ' + confirmAbleDisbursementData.currencyCode}}</div>
            <div class='self-center'>Payment Advice Date</div>
            <div class='self-center'>{{moment(confirmAbleDisbursementData.paymentAdviceDate).format(dateFormat)}}</div>
            <div class='self-center'>Remark</div>
            <div class='self-center'>
              <textarea v-model='remark' class='border-2 border w-full' rows='3' />
            </div>
          </div>
          <signature-pad
            :modelValue='signatureFile'
            @input='onInput'
            :height='150'
            :customStyle="{ border: 'gray 1px solid', borderRadius: '25px', width: '100%' }"
            saveType='image/png'
            saveOutput='file'
            ref='signaturePad' />
          <div class='grid grid-cols-2 grid-flow-row gap-4 mt-2'>
            <button @click='undoSignature' class='btn btn-warning'>Undo signature</button>
            <button @click='clearSignature' class='btn btn-danger'>Clear signature</button>
          </div>
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
            <div class='self-center'>{{confirmFunderAcknowledgeReceiveOfRepaymentData.paymentAdviceNumber}}</div>
            <div class='self-center'>Payment Advice Amount</div>
            <div class='self-center'>{{confirmFunderAcknowledgeReceiveOfRepaymentData.paymentAdviceAmount + ' ' + confirmFunderAcknowledgeReceiveOfRepaymentData.currencyCode}}</div>
            <div class='self-center'>Payment Advice Date</div>
            <div class='self-center'>{{moment(confirmFunderAcknowledgeReceiveOfRepaymentData.paymentAdviceDate).format(dateFormat)}}</div>
            <div class='self-center'>Remark</div>
            <div class='self-center'>
              <textarea v-model='remark' class='border-2 border w-full' rows='3' />
            </div>
          </div>
          <signature-pad
            :modelValue='signatureFile'
            @input='onInput'
            :height='150'
            :customStyle="{ border: 'gray 1px solid', borderRadius: '25px', width: '100%' }"
            saveType='image/png'
            saveOutput='file'
            ref='signaturePad' />
          <div class='grid grid-cols-2 grid-flow-row gap-4 mt-2'>
            <button @click='undoSignature' class='btn btn-warning'>Undo signature</button>
            <button @click='clearSignature' class='btn btn-danger'>Clear signature</button>
          </div>
        </div>
        <div class='modal-footer text-right'>
          <button type='button' class='btn btn-primary w-24 mr-1' @click='funderAcknowledgeOfRepaymentComfirm' :disabled='modalLoading'> Confirm </button>
          <button type='button' class='btn btn-danger w-24 mr-1' @click='funderAcknowledgeOfRepaymentDecline'> Decline </button>
          <button type='button' data-dismiss='modal' class='btn btn-outline-secondary w-20'> Cancel </button>
        </div> <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
  <div id='failed-notification-content' class='toastify-content hidden flex'>
    <XCircleIcon class='text-theme-6' />
    <div class='ml-4 mr-4'>
      <div class='font-medium'>Upload failed!</div>
      <div class='text-gray-600 mt-1' id='error-content'>{{uploadErrorMessage}}.</div>
    </div>
  </div>
  <!-- End: action modal -->
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import SignaturePad from 'vue3-signature-pad'
import Toastify from 'toastify-js'
import { useDropzone } from 'vue3-dropzone'
import _ from 'lodash'
import moment from 'moment'

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
    SignaturePad
  },
  setup(props) {
    const store = useStore()
    const user = store.state.auth 
    const dateFormat = process.env.VUE_APP_DATE_FORMAT

    const batchDetails = ref(props.batchDetail)
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
    const batchMessage = ref('')
    const adminCompany = ref(props.adminCompany)

    const initComponent = ref(false)
    const modalLoading = ref(false)
    const signatureLoading = ref(false)
    const signatureFileUrl = ref(null)
    const signatureDataURL = ref(null)
    const signatureFile = ref(null)
    const signaturePad = ref(null)
    const uploadErrorMessage = ref()
    const remark = ref(null)
    const valueDate = ref()
    const bidValue = ref(null)
    const files = ref()
    const options = reactive({
      multiple: true,
      onDrop,
      accept: '.jpg, .csv',
    })
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
      files.value = acceptFiles
    }

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

    const getLastWorkflowStatus = async() => {
      const api = '/workflow/v2/statustransition/retrieve/byreferenceids/limittolaststatustransition'
      await appAxios.post(api, [props.workflowExecutionReferenceId]).then(res => {
        console.log('limittolaststatustransition = ', res.data)
        lastWorkStatus.value = res.data[0].workflow.lastStatusTransition
      })

      return new Promise(resolve => resolve('get last workflow status done'))
    }

    const getCurrencyCode = async() => {
      const companyProfileSystemConfig = 'configuration/v1/Company Profile'
      await sysAxios.get(companyProfileSystemConfig).then(res => {
				currencies.value = JSON.parse(_.find(res.data[0].configurations, {name: 'currencies'}).value)
			})

      return new Promise(resolve => resolve(currencies.value))
    }

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

    const invoiceDetailApi = async() => {
      return Promise.all([
        new Promise((resolve) => {
          const batchBuyerApi = `/company/v1/${batchDetails.value.buyerCompanyId}`
          appAxios.get(batchBuyerApi).then(res => {
            batchDetails.value.batchInformation.buyerCompany = res.data.companyDisplayName
            resolve({buyerCompany: batchDetails.value.batchInformation.buyerCompany})
          })
        }),
        new Promise((resolve) => {
          const batchSellerApi = `/company/v1/${batchDetails.value.sellerCompanyId}`
          appAxios.get(batchSellerApi).then(res => {
            batchDetails.value.batchInformation.sellerCompany = res.data.companyDisplayName
            resolve({sellerCompany: batchDetails.value.batchInformation.sellerCompany})
          })
        }),
        new Promise((resolve) => {
          const batchFunderApi = `/company/v1/${batchDetails.value.funderCompanyId}`
          appAxios.get(batchFunderApi).then(res => {
            batchDetails.value.batchInformation.funderCompany = res.data.companyDisplayName
            resolve({funderCompany: batchDetails.value.batchInformation.funderCompany})
          })
        }),
        new Promise((resolve) => {
          const processingFeeApi = `/ledger/v1/paymentinstruction/byworkflowexecutionreferenceid/${props.workflowExecutionReferenceId}`
          appAxios.get(processingFeeApi).then(res => {
            //calculate interest amount
            let dueDt = moment(batchDetails.value.paymentDueDate)
            let valueDt = moment(batchDetails.value.valueDate) 
            let noOfDays = dueDt.diff(valueDt,'days')
            batchDetails.value.numberOfDays = noOfDays
            batchDetails.value.formula.interestAmount = (batchDetails.value.formula.interestRate * batchDetails.value.formula.repaymentAmountToFunder / 365 * noOfDays).toFixed(2)

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
      ]).then(values => {
        return values
      })
    }

    const onInput = (value) => {
      if (!value) {
        signatureDataURL.value = null
        signatureFile.value = null
      } else if (value instanceof File) {
        signatureDataURL.value = null
        signatureFile.value = value
      } else {
        signatureDataURL.value = value
        signatureFile.value = null
      }
    }

    const getSignaturePad = () => {
      if (!signaturePad.value) {
        throw new Error('No signature pad ref could be found')
      }
      return signaturePad.value
    }

    const undoSignature = () => {
      getSignaturePad().undoSignature()
    }

    const clearSignature = () => {
      getSignaturePad().clearSignature()
    }

    const saveSignature = async () => {
      signatureLoading.value = true
      const signature = getSignaturePad().saveSignature()
      const fileUploadApi = 'uploads/v1/acknowledgement_signature'
      let formData = new FormData()
      if(signature.isEmpty) {
        return new Promise(resolve => {
          resolve('Error!')
        })
      }
      else {
        formData.append('file', signature.file)
        await sysAxios.post(fileUploadApi, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          signatureFileUrl.value = `https://authorization.api-dev.xyz/api/uploads/v1/${res.data}`
          signatureLoading.value = false
        })
        return new Promise(resolve => {
          resolve(signatureFileUrl.value)
        })
      }
      
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
      disbursementData.value.paymentAdviceUri = 'https://authorization.api-dev.xyz/api/uploads/v1/' + res.data
    }

    const removeFile = () => files.value = null

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

    const getStatusUpdateHandlerAPIEndpoint = async () => {
      console.log('lastwork status = ', lastWorkStatus.value)
    }

    const approveAcknowledge = async () => { 
      modalLoading.value = true
      getStatusUpdateHandlerAPIEndpoint()
      return
      await saveSignature().then( async() => {  
        if(signatureFileUrl.value == null) {
          uploadErrorMessage.value = 'Your signature is required!'
          Toastify({
            node: cash('#failed-notification-content').clone().removeClass('hidden')[0],
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: 'top',
            position: 'right',
            stopOnFocus: true,
          }).showToast()
          modalLoading.value = false
        }
        else {
          var api = ''
          if(batchDetails.value.workflowLed === 'Seller Led') {
            api = '/workflow/v2/seller-led-invoice-financing-workflow-1/buyer-acknowledge-the-transaction-branch/0'
          } else {
            api = '/workflow/v2/buyer-led-invoice-financing-workflow-0/seller-acknowledge-the-transaction-branch/0'
          }

          await appAxios.post(api, {
            externalReferenceId: props.workflowExecutionReferenceId,
            remark: remark.value,
            signatureUri: signatureFileUrl.value
          }).then(res => {
            modalLoading.value = false
            if(res.status === 200) {
              cash('#approve-invoice-modal').modal('hide')
              visibleWorkflowActions.value.visibleApproveButton = false
            }
            updateProvenanceApi()
          })
        } 
      }) 
    }

    const declineAcknowledge = async () => { 
      if(currentCompanyRole.value === 'System Admin') api = '/workflow/v2/buyer-led-invoice-financing-workflow-0/seller-not-acknowledge-the-transaction-branch/0'
      if(currentCompanyRole.value === 'System Admin') api = '/workflow/v2/seller-led-invoice-financing-workflow-1/buyer-not-acknowledge-the-transaction-branch/0'
      appAxios.post(api, {
        externalReferenceId: props.workflowExecutionReferenceId,
        remark: remark.value,
        signatureUri: signatureFileUrl.value
      }).then(res => {
        if(res.status === 200) {
          visibleWorkflowActions.value.visibleApproveButton = false
          updateProvenanceApi()
        }
      }) 
    }

    const getEstimateCalc = async()=>{
      if(valueDate.value != '' && valueDate.value != null && valueDate.value != undefined){
        batchDetails.value.valueDate = valueDate.value 
        let dueDt = moment(batchDetails.value.paymentDueDate)
        let valueDt = moment(batchDetails.value.valueDate) 
        let noOfDays = dueDt.diff(valueDt,'days')
        batchDetails.value.numberOfDays = noOfDays
      }
      if(bidValue.value != ''
        && bidValue.value != null && bidValue.value != undefined
        && valueDate.value != ''
        && valueDate.value != null && valueDate.value != undefined
      ) {
        let apiUrl = ''
        if(batchDetails.value.initiatedByCompanyId == batchDetails.value.buyerCompanyId){
          apiUrl = `/workflow/v2/buyer-led-invoice-financing-workflow-0/estimates?refId=${props.workflowExecutionReferenceId}&interestRate=${bidValue.value}&valueDate=${valueDate.value}`
          //started by buyer
        }
        else{
          apiUrl = `/workflow/v2/seller-led-invoice-financing-workflow-1/estimates?refId=${props.workflowExecutionReferenceId}&interestRate=${bidValue.value}&valueDate=${valueDate.value}`
          //started by seller
        }
        await appAxios.get(apiUrl).then(res => {
          let data = res.data
          batchDetails.value.formula.disburableAmount1DueDate = moment(data.disburableAmount1DueDate).format(dateFormat)
          batchDetails.value.formula.disburableAmount2DueDate = moment(data.disburableAmount2DueDate).format(dateFormat)
          batchDetails.value.formula.disbursableAmount1 = data.disbursableAmount1.toFixed(2)
          batchDetails.value.formula.disbursableAmount2 = data.disbursableAmount2.toFixed(2)
          batchDetails.value.formula.interestAmount = data.interestAmount.toFixed(2)
          batchDetails.value.formula.platformFeeAmount = data.platformFeeAmount.toFixed(2)
          batchDetails.value.formula.platformFeeAmountDueDate = moment(data.platformFeeAmountDueDate).format(dateFormat)
          batchDetails.value.formula.repaymentAmount = data.repaymentAmount.toFixed(2)
          batchDetails.value.formula.repaymentAmountDueDate = moment(data.repaymentAmountDueDate).format(dateFormat)
        })
      }
    }

    const submitProposal = async () => {
      modalLoading.value = true
      const api = `/bidding/v1/${batchDetails.value.workflowExecutionReferenceId}/vote`
      appAxios.put(api, {
        vote: {
          companyId: store.state.account.company_uuid,
          bidValue: bidValue.value,
          valueDate: moment.utc(valueDate.value).format(),
           repaymentAccount: {
            bankName: 'Singapore Bank',
            branchName: '10032',
            address: 'Hong Kong Sar',
            accountNumber: '1003210189102',
            swiftCode: '1009',
            currency: 'SGD'
          }
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
          updateProvenanceApi()
        }
      })
    }

    const sellerAcknowledgeOfReceiveDisbursement = async () => {
      modalLoading.value = true
      await saveSignature().then( async()=>{ 
        if(signatureFileUrl.value == null) {
          uploadErrorMessage.value = 'Your signature is required!'
          Toastify({
            node: cash('#failed-notification-content').clone().removeClass('hidden')[0],
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: 'top',
            position: 'right',
            stopOnFocus: true,
          }).showToast()
          modalLoading.value = false
        }
        else {
          var api = ''
          if(batchDetails.value.workflowLed === 'Buyer Led') api = '/workflow/v2/buyer-led-invoice-financing-workflow-0/seller-acknowledged-receive-of-disbursement-branch/0'
          else if(batchDetails.value.workflowLed === 'Seller Led' && lastWorkStatus.value.statusName === 'FIRST_FUND_DISBURSEMENT_NOTIFICATION_SENT_TO_SELLER') api = '/workflow/v2/seller-led-invoice-financing-workflow-1/seller-acknowledged-receive-of-first-disbursement-branch/0'
          else if(batchDetails.value.workflowLed === 'Seller Led' && lastWorkStatus.value.statusName === 'FINAL_FUND_DISBURSEMENT_NOTIFICATION_SENT_TO_SELLER') api = '/workflow/v2/seller-led-invoice-financing-workflow-1/seller-acknowledged-receive-of-final-disbursement-branch/0'
          
          const request = {
            externalReferenceId: props.workflowExecutionReferenceId,
            signatureUri: signatureFileUrl.value,
            remarks: remark.value
          }
          await appAxios.post(api, request).then(res => {
            modalLoading.value = false
            if(res.status === 200) {
              cash('#seller-acknowledge-of-receive-disbursement').modal('hide')
              provenanceApi()
            }
          })
        }
      })
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
        if(res.status === 200) cash('#buyer-upload-repayment-advice').modal('hide')
        updateProvenanceApi()
      })
    }

    const funderAcknowledgeOfRepaymentComfirm = async () => {
      modalLoading.value = true
      await saveSignature().then( async()=>{ 
        if(signatureFileUrl.value == null) {
          uploadErrorMessage.value = 'Your signature is required!'
          Toastify({
            node: cash('#failed-notification-content').clone().removeClass('hidden')[0],
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: 'top',
            position: 'right',
            stopOnFocus: true,
          }).showToast()
          modalLoading.value = false
        }
        else {
          var api = ''
          if(batchDetails.value.workflowLed === 'Buyer Led') api = '/workflow/v2/buyer-led-invoice-financing-workflow-0/funder-acknowledge-received-of-repayment-branch/0'
          if(batchDetails.value.workflowLed === 'Seller Led') api = '/workflow/v2/seller-led-invoice-financing-workflow-1/funder-acknowledge-received-of-repayment-branch/0'
          const request = {
            externalReferenceId: props.workflowExecutionReferenceId,
            signatureUri: signatureFileUrl.value,
            remarks: remark.value
          }
          await appAxios.post(api, request).then(res => {
            modalLoading.value = false
            if(res.status === 200){
              cash('#funder-acknowledge-upload-repayment-advice').modal('hide')
              updateProvenanceApi()
            }
          })
        }
      })
    }

    const funderAcknowledgeOfRepaymentDecline = async () => {
      if(signatureFileUrl.value == null) {
        uploadErrorMessage.value = 'Your signature is required!'
        Toastify({
          node: cash('#failed-notification-content').clone().removeClass('hidden')[0],
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: 'top',
          position: 'right',
          stopOnFocus: true,
        }).showToast() 
      }
      else {
        await saveSignature().then( async()=>{ 
          if(batchDetails.value.workflowLed === 'Buyer Led') api = '/workflow/v2/buyer-led-invoice-financing-workflow-0/funder-not-acknowledged-receive-of-repayment-branch/0'
          if(batchDetails.value.workflowLed === 'Seller Led') api = '/workflow/v2/seller-led-invoice-financing-workflow-1/funder-not-acknowledged-receive-of-repayment-branch/0'
          const request = {
            externalReferenceId: props.workflowExecutionReferenceId,
            remarks: remark.value
          }
          await appAxios.post(api, request).then(res => {
            cash('#funder-acknowledge-upload-repayment-advice').modal('hide')
            updateProvenanceApi()
          })
        })
      }
    }

    const updateProvenanceApi = () => {
      console.log('need to update provenance api because new action was invoked')
    }

    const init = async () => {
      
      await Promise.all([
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

      //determine what action button should be showed in Batch Detail page
      if(batchDetails.value.workflowLed === 'Buyer Led') {
        if(lastWorkStatus.value['statusName'] === 'NOTIFICATION_SENT_TO_SELLER' && currentCompanyRole.value === 'Seller Admin') visibleWorkflowActions.value.visibleApproveButton = true
        else if(lastWorkStatus.value['statusName'] === 'INVITATION_SENT_TO_FUNDERS' && user.user_role === 'Funder Admin') {
          const api = `bidding/v1/${props.workflowExecutionReferenceId}`
          appAxios.get(api).then(res => {
            if(_.findIndex(res.data[0].votes, {companyId: store.state.account.company_uuid}) < 0) visibleWorkflowActions.value.visibleSubmitProposal = true
            else batchMessage.value = 'You have already bid this Batch. Please wait until the bidding is finished.'
          })
        }
        else if(lastWorkStatus.value['statusName'] === 'FUND_DISBURSEMENT_INSTRUCTION_SENT_TO_FUNDER' && user.user_role === 'Funder Admin') visibleWorkflowActions.value.visibleSubmitDisbursmentAdvice = true
        else if(lastWorkStatus.value['statusName'] === 'FUND_DISBURSEMENT_NOTIFICATION_SENT_TO_SELLER' && currentCompanyRole.value === 'Seller Admin') visibleWorkflowActions.value.visibleSellerAcknowledgeOfReceiveDisbursement = true
        else if(lastWorkStatus.value['statusName'] === 'REPAYMENT_INSTRUCTION_SENT_TO_BUYER' && currentCompanyRole.value === 'Buyer Admin') visibleWorkflowActions.value.visibleBuyerUploadRepaymentAdvice = true
        else if(lastWorkStatus.value['statusName'] === 'REPAID_BY_BUYER' && user.user_role === 'Funder Admin') visibleWorkflowActions.value.visibleFunderAcknowledgeRepaymentAdvice = true

        //for the private ecosystem action case check
      
      } else {
        if(lastWorkStatus.value['statusName'] === 'NOTIFICATION_SENT_TO_BUYER' && currentCompanyRole.value === 'Buyer Admin') visibleWorkflowActions.value.visibleApproveButton = true
        else if(lastWorkStatus.value['statusName'] === 'INVITATION_SENT_TO_FUNDERS' && user.user_role === 'Funder Admin') {
          const api = `bidding/v1/${batchDetails.value.workflowExecutionReferenceId}`
          appAxios.get(api).then(res => {
            if(_.findIndex(res.data[0].votes, {companyId: store.state.account.company_uuid}) < 0) visibleWorkflowActions.value.visibleSubmitProposal = true
            else batchMessage.value = 'You have already bid this Batch. Please wait until the bidding is finished.'
          })
        }
        else if(lastWorkStatus.value['statusName'] === 'FIRST_FUND_DISBURSEMENT_INSTRUCTION_SENT_TO_FUNDER' && user.user_role === 'Funder Admin') visibleWorkflowActions.value.visibleSubmitDisbursmentAdvice = true
        else if(lastWorkStatus.value['statusName'] === 'FIRST_FUND_DISBURSEMENT_NOTIFICATION_SENT_TO_SELLER' && currentCompanyRole.value === 'Seller Admin') visibleWorkflowActions.value.visibleSellerAcknowledgeOfReceiveDisbursement = true
        else if(lastWorkStatus.value['statusName'] === 'REPAYMENT_INSTRUCTION_SENT_TO_BUYER' && currentCompanyRole.value === 'Buyer Admin') visibleWorkflowActions.value.visibleBuyerUploadRepaymentAdvice = true
        else if(lastWorkStatus.value['statusName'] === 'REPAID_BY_BUYER' && user.user_role === 'Funder Admin') visibleWorkflowActions.value.visibleFunderAcknowledgeRepaymentAdvice = true
        else if(lastWorkStatus.value['statusName'] === 'FINAL_FUND_DISBURSEMENT_INSTRUCTION_SENT_TO_FUNDER' && user.user_role === 'Funder Admin') visibleWorkflowActions.value.visibleSubmitDisbursmentAdvice = true
        else if(lastWorkStatus.value['statusName'] === 'FINAL_FUND_DISBURSEMENT_NOTIFICATION_SENT_TO_SELLER' && currentCompanyRole.value === 'Seller Admin') visibleWorkflowActions.value.visibleSellerAcknowledgeOfReceiveDisbursement = true
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
      initComponent,
      dateFormat,
      batchDetails,
      modalLoading,
      provenance,
      user,
      lastWorkStatus,
      currencies,
      lockDays,
      visibleWorkflowActions,
      batchMessage,
      signatureFile,
      onInput,
      undoSignature,
      clearSignature,
      approveAcknowledge,
      declineAcknowledge,
      remark,
      valueDate,
      getEstimateCalc,
      bidValue,
      submitProposal,
      getRootProps,
      getInputProps,
      uploadFile,
      removeFile,
      disbursementData,
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
      funderAcknowledgeOfRepaymentDecline
    }
  },
}
</script>