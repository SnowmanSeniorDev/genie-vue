<template>
  <!-- BEGIN: upload invoice modal content -->
    <div id="upload-invoice-modal" class="modal" tabindex="-1" aria-hidden="true">
     <div class="modal-dialog modal-xl" style="width: 90vw;">
        <div class="modal-content">
          <!-- BEGIN: Modal Header -->
          <div class="modal-header">
            <h2 class="font-medium text-base mr-auto"> Upload Invoice </h2>
          </div> <!-- END: Modal Header -->
          <div class="m-8 mt-4">
            <div class="flex items-center mt-2 md:mt-0">
                <div class="flex items-center mt-2  form-inline block md:flex">
                  <div v-if="documentFormats.length">
                    <button class="btn btn-outline-primary  mr-1 inline-block" @click="chooseFiles">
                      <UploadIcon class="w-4 h-4 mr-2" />
                      Upload Invoice
                    </button> 
                    <label class="pl-4 pr-2">Document Type</label>
                    <div class="dropdown inline-block" data-placement="bottom">
                      <button class="dropdown-toggle btn btn-primary w-32 mr-1" aria-expanded="false"> {{documentFormat}} </button>
                      <div class="dropdown-menu w-40">
                        <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
                          <a v-for="(document, index) in documentFormats" :key="index"
                            href="javascript:;"
                            class="block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                            @click="setDocumentFromat(document.dataSourceSystemName)"
                          >
                            {{document.dataSourceSystemName}}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <label for="bid-end-time" class="md:pl-4 pr-4">Bid End Time</label>
                  <DatePicker v-model="bidEndTime" mode="datetime" :masks="{inputDateTime: dateTimeFormat}">
                    <template v-slot="{ inputValue, inputEvents }">
                      <input
                        id="bid-end-time"
                        class="form-control w-56 block mx-auto border rounded focus:outline-none focus:border-blue-300"
                        :value="inputValue"
                        v-on="inputEvents"
                      />
                    </template>
                  </DatePicker>
                </div>
              </div>
              
            <input id="file-upload" ref="fileUpload" type="file" class="hidden" @change="fileChoosen">
            <div class="col-span-12 h-full overflow-y-auto overflow-x-invisible bg-gray-200 p-1 mt-5">
              <div v-if="loading" class="py-16 h-full flex">
                <div class="w-full h-8 px-8 self-center flex justify-center">
                  <span class="text-xl pr-2">Uploading</span>
                  <div class="h-8">
                    <LoadingIcon icon="spinning-circles" color="#9a428a" class="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div v-if="!loading" id="basic-table" class="p-5">
                <div class="preview">
                  <div class="overflow-x-auto">
                    <table class="table">
                      <thead>
                        <tr>
                          <th class="border-b-2 dark:border-dark-5 whitespace-nowrap"> Document Number </th>
                          <th class="border-b-2 dark:border-dark-5 whitespace-nowrap"> Document Type </th>
                          <th class="border-b-2 dark:border-dark-5 whitespace-nowrap"> {{companyTypeHeader}} </th>
                          <th class="border-b-2 dark:border-dark-5 whitespace-nowrap"> Document Date </th>
                          <th class="border-b-2 dark:border-dark-5 whitespace-nowrap"> Payment Due Date </th>
                          <th class="border-b-2 dark:border-dark-5 whitespace-nowrap"> Currency Code </th>
                          <th class="border-b-2 dark:border-dark-5 whitespace-nowrap"> Amount </th>
                          <th class="border-b-2 dark:border-dark-5 whitespace-nowrap"> Support Document </th>
                          <th class="border-b-2 dark:border-dark-5 whitespace-nowrap"> Action </th>
                        </tr>
                      </thead>
                      <tbody v-for="(batch, batchIndex) in invoicesBatch" :key="batchIndex">
                        <tr>
                          <td colspan="4" v-if="workflowLed == 'Seller Led'">
                            <div class="flex w-100 items-center">
                              <label class="w-32">select bank</label>
                              <select v-model="invoicesBatch[batchIndex].bankId" class="form-select">
                                <option v-for="bank in bankAccount" :key="bank.bankAccountId" :value="bank.bankAccountId">
                                  {{bank.bankName}}
                                </option>
                              </select>
                            </div>
                          </td>
                          <td colspan="4">
                            <div class="flex w-100 items-center">
                              <label class="w-24">remark</label>
                              <input type="text" v-model="invoicesBatch[batchIndex].remark" class="form-control"/>
                            </div>
                          </td>
                        </tr>
                        <tr v-for="(item, index) in batch.invoices" :key="index">
                          <td class="border-b dark:border-dark-5">
                            <input v-if="batchIndex == editRowIndex.batchIndex && index == editRowIndex.index" type="text" v-model="invoicesBatch[batchIndex].invoices[index].documentNumber"/>
                            <span v-else>{{item.documentNumber}}</span>
                          </td>
                          <td class="border-b dark:border-dark-5">
                            <input v-if="batchIndex == editRowIndex.batchIndex && index == editRowIndex.index" type="text" v-model="invoicesBatch[batchIndex].invoices[index].documentType" size="5"/>
                            <span v-else>{{item.documentType}}</span>
                          </td>
                          <td class="border-b dark:border-dark-5">                            
                            <input v-if="batchIndex == editRowIndex.batchIndex && index == editRowIndex.index && companyTypeHeader === 'Seller Name'" type="text" v-model="invoicesBatch[batchIndex].invoices[index].invoiceFromCompanyName"/>
                            <input v-else-if="batchIndex == editRowIndex.batchIndex && index == editRowIndex.index && companyTypeHeader === 'Buyer Name'" type="text" v-model="invoicesBatch[batchIndex].invoices[index].invoiceToCompanyName"/>
                            <span v-else-if="companyTypeHeader === 'Seller Name'">{{item.invoiceFromCompanyName}}</span>
                            <span v-else-if="companyTypeHeader === 'Buyer Name'">{{item.invoiceToCompanyName}}</span>
                          </td>
                          <td class="border-b dark:border-dark-5">
                            <DatePicker v-if="batchIndex == editRowIndex.batchIndex && index == editRowIndex.index" v-model="invoicesBatch[batchIndex].invoices[index].documentDate" mode="date" :masks="{input: dateFormat}">
                              <template v-slot="{ inputValue, inputEvents }">
                                <input
                                  class="block mx-auto border rounded focus:outline-none focus:border-blue-300"
                                  :value="inputValue"
                                  v-on="inputEvents"
                                  size="11"
                                />
                              </template>
                            </DatePicker>
                            <span v-else>{{moment(item.documentDate).format(dateFormat) }}</span>
                          </td>
                          <td class="border-b dark:border-dark-5">
                            <DatePicker v-if="batchIndex == editRowIndex.batchIndex && index == editRowIndex.index" v-model="invoicesBatch[batchIndex].invoices[index].paymentDueDate" mode="date" :masks="{input: dateFormat}">
                              <template v-slot="{inputValue,  inputEvents }">
                                <input
                                  class="block mx-auto border rounded focus:outline-none focus:border-blue-300"
                                  :value="inputValue"
                                  v-on="inputEvents"
                                  size="11"
                                />
                              </template>
                            </DatePicker>
                            <span v-else>{{moment(item.paymentDueDate).format(dateFormat) }}</span>
                          </td>
                          <td class="border-b dark:border-dark-5">
                            <input v-if="batchIndex == editRowIndex.batchIndex && index == editRowIndex.index" type="text" v-model="invoicesBatch[batchIndex].invoices[index].currencyCode" size="5"/>
                            <span v-else>{{item.currencyCode}}</span>
                          </td>
                          <td class="border-b dark:border-dark-5">
                            <input v-if="batchIndex == editRowIndex.batchIndex && index == editRowIndex.index" type="text" v-model="invoicesBatch[batchIndex].invoices[index].amount" size="8"/>
                            <span v-else>{{item.amount}}</span>
                          </td>
                          <td class="border-b dark:border-dark-5 fileupload-col">
                            <SupportDropzone :batchIndex="batchIndex" :index="index" :data="invoicesBatch[batchIndex].invoices[index].supportingDocuments" :addSupportDoc="addSupportDoc" :removeSupportDoc="removeSupportDoc"/>
                          </td>
                          <td class="flex">
                            <button class="btn btn-sm btn-danger" @click="removeRow(batchIndex, index)">
                              <Trash2Icon class="w-4 h-4" />
                            </button>
                            <button v-if="batchIndex == editRowIndex.batchIndex && index == editRowIndex.index" class="btn btn-sm ml-2 btn-primary" @click="saveRow(batchIndex, index)">
                              <SaveIcon class="w-4 h-4" />
                            </button>
                            <button v-else class="btn btn-sm ml-2 btn-primary" @click="editRow(batchIndex, index)">
                              <EditIcon class="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer text-right">
            <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-20 mr-1"> Cancel </button>
            <button type="button" class="btn btn-primary w-20" @click="submitInvoice"> Submit </button>
          </div> <!-- END: Modal Footer -->
        </div>
      </div>
      <div id="failed-notification-content" class="toastify-content hidden flex">
        <XCircleIcon class="text-theme-6" />
        <div class="ml-4 mr-4">
          <div class="font-medium">Upload failed!</div>
          <div class="text-gray-600 mt-1" id="error-content"></div>
        </div>
      </div>
    </div>
    <!-- END: uploading invoice modal content -->
</template>

<script>
import { ref, onMounted, onErrorCaptured } from "vue";
import { useStore } from 'vuex';
import moment from "moment";
import _ from "lodash";
import { appAxios, sysAxios } from "@/plugins/axios";
import SupportDropzone from "./SupportFileDropzone";
import Toastify from "toastify-js";

export default {
  components: {
    SupportDropzone
  },
  props: {
    callback: {
      type: Function,
    }
  },
  setup(props){
    const dateFormat = ref(process.env.VUE_APP_DATE_FORMAT); 
    const dateTimeFormat = ref(process.env.VUE_APP_DATETIME_FORMAT);
    const store = useStore();
    const company_uuid = store.state.account.company_uuid;
    const bankAccount = ref([]);
    const jsonData = ref([]);
    const fileUpload = ref(null);
    const documentFormat = ref("Select");
    const companyTypeHeader = ref("Company Name");
    const documentFormats = ref([])
    const bidEndTime = ref(new Date());
    const loading = ref(false);
    const editRowIndex = ref({
      batchIndex: null,
      index: null
    });
    const uploadedFileId = ref('');
    const workflowLed = ref('');
    const invoiceFromCompanyName = ref('');
    const invoiceToCompanyName = ref('');
    const requestValide = ref(true);
    const invoicesBatch = ref([]);

    const setDocumentFromat = (format) => {
      documentFormat.value = format
      sysAxios.get(`/uploads/v1/${uploadedFileId.value}/extractdata/${format}`).then(res => {
        console.log(res.data)
        workflowLed.value = res.data.workflow;
        res.data.invoices.forEach((entity) => {
          entity['supportingDocuments'] = []
        })
        jsonData.value = res.data.invoices
        //group the invoices to batch by payment due date and company name
        let paymentDueDate = jsonData.value[0].paymentDueDate
        let companyName = jsonData.value[0].invoiceFromCompanyName ? jsonData.value[0].invoiceFromCompanyName : jsonData.value[0].invoiceToCompanyName
        let batch = [];
        invoicesBatch.value = []
        for(var i = 0; i < jsonData.value.length; i++) {
          if( jsonData.value[i].paymentDueDate == paymentDueDate  && jsonData.value[i].invoiceFromCompanyName == companyName ||
            jsonData.value[i].paymentDueDate == paymentDueDate && jsonData.value[i].invoiceToCompanyName == companyName
          ) {
            batch.push({...jsonData.value[i]})
          } else {
            invoicesBatch.value.push({bankId: '', remark: '', invoices: batch})
            batch = []
            batch.push({...jsonData.value[i]})
            paymentDueDate = jsonData.value[i].paymentDueDate
            companyName = jsonData.value[i].invoiceFromCompanyName ? jsonData.value[0].invoiceFromCompanyName : jsonData.value[0].invoiceToCompanyName
            if(i == jsonData.value.length - 1) invoicesBatch.value.push({bankId: '', remark: '', invoices: batch})
          }
        }

        //identify the invoice detail show table header and it will use to determine current invoice is seller led or buyer led
        console.log("workflow led = ", res.data.workflow)
        if(res.data.workflow === 'Buyer Led') {
          companyTypeHeader.value = "Seller Name";
          invoiceToCompanyName.value = res.data.invoiceToCompanyName;
        }
        else {
          companyTypeHeader.value = "Buyer Name";
          invoiceFromCompanyName.value = res.data.invoiceFromCompanyName;
        }
      })
      cash(".dropdown-menu").dropdown("hide");
    }
    
    const removeRow = (batchIndex, index) => {
      invoicesBatch.value[batchIndex].invoices.splice(index, 1)
      if(!invoicesBatch.value[batchIndex].invoices.length) {
        invoicesBatch.value.splice(batchIndex, 1)
      }
    }

    const editRow = (batchIndex, index) => {
      editRowIndex.value.batchIndex = batchIndex;
      editRowIndex.value.index = index;
    }

    const saveRow = (batchIndex, index) => {
      editRowIndex.value.batchIndex = null;
      editRowIndex.value.index = null;
      var companyName = invoicesBatch.value[batchIndex].invoices[index].invoiceFromCompanyName ? invoicesBatch.value[batchIndex].invoices[index].invoiceFromCompanyName : invoicesBatch.value[batchIndex].invoices[index].invoiceToCompanyName
      var paymentDueDate = invoicesBatch.value[batchIndex].invoices[index].paymentDueDate
  
      for(var i = 0; i < invoicesBatch.value.length; i++) {
        for(var j = 0; j < invoicesBatch.value[i].invoices.length; j++) {
          var compareCompanyName = invoicesBatch.value[i].invoices[j].invoiceFromCompanyName ? invoicesBatch.value[i].invoices[j].invoiceFromCompanyName : invoicesBatch.value[i].invoices[j].invoiceToCompanyName
          var comparePaymentDuedate = invoicesBatch.value[i].invoices[j].paymentDueDate
          var paymentDueDateDayDiff = moment(paymentDueDate).diff(moment(comparePaymentDuedate), 'days') 
          if(i == batchIndex && j == index) continue;
          if(i == batchIndex) {
            if(companyName != compareCompanyName || paymentDueDateDayDiff) {
              invoicesBatch.value.push({bankId: invoicesBatch.value[batchIndex].bankId, remark: invoicesBatch.value[batchIndex].remark, invoices: [{...invoicesBatch.value[batchIndex].invoices[index]}]})
              invoicesBatch.value[batchIndex].invoices.splice(index, 1)
              batchIndex = invoicesBatch.value.length
              index = i = j = 0;
              if(invoicesBatch.value[batchIndex].invoices.length == 0) invoicesBatch.value.splice(batchIndex, 1);
              continue;
            }
          }
          if(companyName == compareCompanyName && paymentDueDateDayDiff == 0) {
            invoicesBatch.value[i].invoices.push(invoicesBatch.value[batchIndex].invoices[index]);
            invoicesBatch.value[batchIndex].invoices.splice(index, 1);
            if(invoicesBatch.value[batchIndex].invoices.length == 0) invoicesBatch.value.splice(batchIndex, 1);
            break;
          }
        }
      }
    } 

    const addSupportDoc = (batchIndex, index, documentId, documentName) => {
      invoicesBatch.value[batchIndex].invoices[index].supportingDocuments.push({
        documentName: documentName,
        documentURI: process.env.VUE_APP_SYSTEM_API_URL + "/uploads/v1/" + documentId
      })
    }

    const removeSupportDoc = (batchIndex, index, documentIndex) => {
      invoicesBatch.value[batchIndex].invoices[index].supportingDocuments.splice(documentIndex, 1)
    }

    const chooseFiles = () => {
      document.getElementById("file-upload").click();
    }
    
    const getCompanyIdByCompanyName = (companyName) => {
      const api = `/company/v1/${companyName}`;
      return new Promise( resolve => {
        appAxios.get(api).then(res => {
          resolve(res.data.companyId)
        })
      })
    }

    const getCompanyBankAccounts = async () => {
      bankAccount.value = await appAxios.get(`company/v1/${company_uuid}/bankaccounts`).then(res => {
        return res.data
      })

      return new Promise((resolve) => {
        resolve(bankAccount.value)
      })
    }

    const submitInvoice = async () => {
      var api = ''
      var buyerCompanyId = '';
      var sellerCompanyId = '';
      var requestBodys = [];
      
      for(var i = 0; i < invoicesBatch.value.length; i++) {
        for(var j = 0; j < invoicesBatch.value[i].invoices.length; j++) {
          invoicesBatch.value[i].invoices[j].documentDate = moment.utc(invoicesBatch.value[i].invoices[j].documentDate).format()
          invoicesBatch.value[i].invoices[j].paymentDueDate = moment.utc(invoicesBatch.value[i].invoices[j].paymentDueDate).format()
        }
      }
      //preparing invoice upload request body
      if(workflowLed.value === 'Buyer Led') {
        api = "/workflow/v1/buyer-led-invoice-financing-workflow-0/0"
        buyerCompanyId = await getCompanyIdByCompanyName(invoiceToCompanyName.value)
        await Promise.all(
          invoicesBatch.value.map(async batch => {
            var journalBatchEntries = []
            await Promise.all(
              batch.invoices.map( async invoice => {
                const companyId = await getCompanyIdByCompanyName(invoice.invoiceFromCompanyName)
                journalBatchEntries.push({
                  ...invoice,
                  sellerCompanyId: companyId
                })
              })
            )  
            requestBodys.push({
              buyerCompanyId: buyerCompanyId,
              journalBatchEntries,
              bidEndTime: moment(bidEndTime.value).format(),
              remark: batch.remark
            })
          })
        )
      } else {
        api = "/workflow/v1/seller-led-invoice-financing-workflow-1/0"
        sellerCompanyId = await getCompanyIdByCompanyName(invoiceFromCompanyName.value)

        await Promise.all(
          invoicesBatch.value.map(async batch => {
            var journalBatchEntries = []
            await Promise.all(
              batch.invoices.map(async invoice => {
                const companyId = await getCompanyIdByCompanyName(invoice.invoiceToCompanyName)
                journalBatchEntries.push({
                  ...invoice,
                  buyerCompanyId: companyId
                })
              })
            )
            const bank = _.find(bankAccount.value, {bankAccountId: batch.bankId})
            requestBodys.push({
              sellerCompanyId: sellerCompanyId,
              journalBatchEntries,
              bidEndTime: moment(bidEndTime.value).format(),
              disbursableBankAccount: {
                ..._.find(bankAccount.value, {bankAccountId: batch.bankId})
              },
              remarks: batch.remark
            })
          })
        )
      }
      //verification request body.
      if(sellerCompanyId === '00000000-0000-0000-0000-000000000000') {
        requestValide.value = false;
        showValidationError(-1, `can not find seller company with ${invoiceFromCompanyName.value}`)
        return;
      }
      else if(buyerCompanyId === '00000000-0000-0000-0000-000000000000') {
        requestValide.value = false;
        showValidationError(-1, `Can not find buyer company with ${invoiceToCompanyName.value}`);
        return;
      }
      // else if(_.find(journalBatchEntries, {buyerCompanyId: '00000000-0000-0000-0000-000000000000'})) {
      //   requestValide.value = false;
      //   const index = _.findIndex(journalBatchEntries, {buyerCompanyId: '00000000-0000-0000-0000-000000000000'});
      //   showValidationError(index, `Can not fild buyer company with ${journalBatchEntries[index].invoiceToCompanyName}`);
      //   return;
      // }
      // else if(_.find(journalBatchEntries, {sellerCompanyId: '00000000-0000-0000-0000-000000000000'})) {
      //   requestValide.value = false;
      //   const index = _.findIndex(journalBatchEntries, {sellerCompanyId: '00000000-0000-0000-0000-000000000000'});
      //   showValidationError(index, `Can not fild seller company with ${journalBatchEntries[index].invoiceFromCompanyName}`);
      //   return;
      // }
      
      //upload invoice
      loading.value = !loading.value
      var noError = true
      await Promise.all(
        requestBodys.map( async requestBody => {
          var invoiceUploadResponse = await appAxios.post(api, requestBody)
          //notify to show invoice upload result
          if(invoiceUploadResponse.status === 'error') {
            noError = false
            cash("#error-content").text(invoiceUploadResponse.error.response.data)
            Toastify({
              node: cash("#failed-notification-content").clone().removeClass("hidden")[0],
              duration: 5000,
              newWindow: true,
              close: true,
              gravity: "top",
              position: "center",
              stopOnFocus: true,
            }).showToast()
          }
        })
      )
      if(noError) {
        cash("#upload-invoice-modal").modal("hide");
        props.callback()
      }
      loading.value = !loading.value;
    }

    const showValidationError = (index, errorMessage) => {
      cash("#error-content").text(errorMessage);
      Toastify({
        node: cash("#failed-notification-content").clone().removeClass("hidden")[0],
        duration: 5000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
      }).showToast();
    }
    
    const fileChoosen = async (event) => {
      const fileUploadApi = 'uploads/v1/invoice_batch';
      let formData = new FormData();
      // if(!event.target.files.length) return;
      if(event.target.files.length) {
        formData.append('file', event.target.files[0])
        uploadedFileId.value = await sysAxios.post(fileUploadApi, formData, {
          headers: {'Content-Type': 'multipart/form-data'}
        }).then(res => {return res.data});
        return;
      }
    }

    const init = async () => {
      await getCompanyBankAccounts()
      documentFormats.value = await appAxios.get(`/company/v1/${store.state.account.company_uuid}/datasourcesystem`).then(res => {
        return res.data
      })
      loading.value = false
    }
    onMounted(() => {
      init()
    })
    return {
      dateFormat,
      dateTimeFormat,
      loading,
      jsonData,
      fileUpload,
      documentFormat,
      companyTypeHeader,
      workflowLed,
      documentFormats,
      bankAccount,
      setDocumentFromat,
      removeRow,
      editRow,
      saveRow,
      chooseFiles,
      submitInvoice,
      fileChoosen,
      addSupportDoc,
      removeSupportDoc,
      bidEndTime,
      editRowIndex,
      moment,
      invoicesBatch
    }
  }
}
</script>

<style scoped>
.header-Table {
  width: 110px;
  border: 1px solid rosybrown;
  border-radius: 7px;
  padding: 3px 2px;
  outline: none;
}
.fileupload-col {
  padding: 0px;
}
.fileupload-col > div {
  border: 2px dashed #e295c5;
  border-radius: 5px;
}
</style>