<template>
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
      <tr class='hover:bg-gray-200' v-if="_.find(provenance, {statusName: 'AWAITING_BIDDING_RESULT'})?.passed">
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
  <div class='mt-8' v-if="_.find(provenance, {statusName: 'AWAITING_FUNDER_FIRST_DISBURSEMENT'})?.passed || _.find(provenance, {statusName: 'AWAITING_FUNDER_DISBURSEMENT'})?.passed">
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
  <div class='mt-5' v-if="_.find(provenance, {statusName: 'TRANSACTION_APPROVED_BY_FUNDER'})?.state === 'Completed'">
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
  
  <!-- <div v-if='initComponent && errorStepsMsg == '''> -->
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
  <div v-else>
    <div class='text-red-500 pt-4'>{{errorStepsMsg}}</div>
  </div>
  <div v-if="batchMessage.length" class="bg-gray-300 mt-6 text-center">
    <p class='text-gray-700 px-2 py-4 text-left'>Note: {{batchMessage}}</p>
  </div>
</template>