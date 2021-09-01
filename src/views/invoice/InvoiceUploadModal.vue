<template>
  <!-- BEGIN: upload invoice modal content -->
    <div id="upload-invoice-modal" class="modal" tabindex="-1" aria-hidden="true">
     <div class="modal-dialog modal-xl" style="width: 1350px">
        <div class="modal-content">
          <!-- BEGIN: Modal Header -->
          <div class="modal-header">
            <h2 class="font-medium text-base mr-auto"> Upload Invoice </h2>
          </div> <!-- END: Modal Header -->
          <div class="m-8">
            <div class="form-inline block md:flex">
              <div>
                <label for="role-name" class="pr-4">Document Type</label>
                <div class="dropdown inline-block" data-placement="bottom">
                  <button class="dropdown-toggle btn btn-primary w-32 mr-1" aria-expanded="false"> {{documentFormat}} </button>
                  <div class="dropdown-menu w-40">
                    <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
                      <a 
                        href="javascript:;"
                        class="block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                        @click="setDocumentFromat('RVS WMS')"
                      >
                        RVS WMS
                      </a>
                      <a
                        href="javascript:;"
                        class="block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                        @click="setDocumentFromat('Standard/TF Format')"
                      >
                        Standard/TF Format
                      </a>
                    </div>
                  </div>
                </div>
                        
              </div>
              <button class="btn btn-outline-primary mt-2 md:mt-0" @click="chooseFiles">
                <UploadIcon class="w-4 h-4 mr-2" />
                Upload Invoice
              </button>
              <div class="flex items-center mt-2 md:mt-0">
                <label for="bid-end-time" class="md:pl-4 pr-4">Bid EndTime</label>
                <DatePicker v-model="bidEndTime" mode="dateTime">
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
            <div class="col-span-12 h-96 overflow-y-auto overflow-x-invisible bg-gray-200 p-1 mt-5">
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
                          <th class="border-b-2 dark:border-dark-5 whitespace-nowrap"> Seller Name </th>
                          <th class="border-b-2 dark:border-dark-5 whitespace-nowrap"> Document Date </th>
                          <th class="border-b-2 dark:border-dark-5 whitespace-nowrap"> Payment Due Date </th>
                          <th class="border-b-2 dark:border-dark-5 whitespace-nowrap"> Currency Code </th>
                          <th class="border-b-2 dark:border-dark-5 whitespace-nowrap"> Amount </th>
                          <th class="border-b-2 dark:border-dark-5 whitespace-nowrap"> Support Document </th>
                          <th class="border-b-2 dark:border-dark-5 whitespace-nowrap"> Action </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in jsonData" :key="index">
                          <td class="border-b dark:border-dark-5">
                            <input v-if="index === editRowIndex" type="text" v-model="jsonData[index].documentNumber"/>
                            <span v-else>{{item.documentNumber}}</span>
                          </td>
                          <td class="border-b dark:border-dark-5">
                            <input v-if="index === editRowIndex" type="text" v-model="jsonData[index].documentType" size="5"/>
                            <span v-else>{{item.documentType}}</span>
                          </td>
                          <td class="border-b dark:border-dark-5">
                            <input v-if="index === editRowIndex" type="text" v-model="jsonData[index].sellerCompanyId"/>
                            <span v-else>{{item.sellerCompanyId}}</span>
                          </td>
                          <td class="border-b dark:border-dark-5">
                            <DatePicker v-if="index === editRowIndex" v-model="jsonData[index].documentDate" mode="date">
                              <template v-slot="{ inputValue, inputEvents }">
                                <input
                                  class="block mx-auto border rounded focus:outline-none focus:border-blue-300"
                                  :value="inputValue"
                                  v-on="inputEvents"
                                  size="11"
                                />
                              </template>
                            </DatePicker>
                            <span v-else>{{moment(item.documentDate).format('MM/DD/YYYY') }}</span>
                          </td>
                          <td class="border-b dark:border-dark-5">
                            <DatePicker v-if="index === editRowIndex" v-model="jsonData[index].paymentDueDate" mode="date">
                              <template v-slot="{ inputValue, inputEvents }">
                                <input
                                  class="block mx-auto border rounded focus:outline-none focus:border-blue-300"
                                  :value="inputValue"
                                  v-on="inputEvents"
                                  size="11"
                                />
                              </template>
                            </DatePicker>
                            <span v-else>{{moment(item.paymentDueDate).format('MM/DD/YYYY') }}</span>
                          </td>
                          <td class="border-b dark:border-dark-5">
                            <input v-if="index === editRowIndex" type="text" v-model="jsonData[index].currencyCode" size="5"/>
                            <span v-else>{{item.currencyCode}}</span>
                          </td>
                          <td class="border-b dark:border-dark-5">
                            <input v-if="index === editRowIndex" type="text" v-model="jsonData[index].amount" size="8"/>
                            <span v-else>{{item.amount}}</span>
                          </td>
                          <td class="border-b dark:border-dark-5 fileupload-col">
                            <SupportDropzone :index="index" :addSupportDoc="addSupportDoc" :removeSupportDoc="removeSupportDoc"/>
                          </td>
                          <td class="flex">
                            <button class="btn btn-sm btn-danger" @click="removeRow(index)">
                              <Trash2Icon class="w-4 h-4" />
                            </button>
                            <button v-if="index === editRowIndex" class="btn btn-sm ml-2 btn-primary" @click="saveRow(index)">
                              <SaveIcon class="w-4 h-4" />
                            </button>
                            <button v-else class="btn btn-sm ml-2 btn-primary" @click="editRow(index)">
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
          <div class="text-gray-600 mt-1" id="error-content">{{uploadErrorMessage}}.</div>
        </div>
      </div>
    </div>
    <!-- END: uploading invoice modal content -->
</template>

<script>
import { ref } from "vue";
import { useStore } from 'vuex';
import xlsx from "xlsx";
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
    const store = useStore();
    const xlsxRows = ref();
    const xlsxHeaders = ref();
    const jsonData = ref([]);
    const fileUpload = ref(null);
    const documentFormat = ref("RVS WMS");
    const bidEndTime = ref(new Date());
    const loading = ref(false);
    const editRowIndex = ref(null);
    const uploadErrorMessage = ref('')

    const setDocumentFromat = (format) => {
      documentFormat.value = format
      cash(".dropdown-menu").dropdown("hide");
    }
    
    const removeRow = (index) => {
      jsonData.value.splice(index, 1)
      xlsxRows.value.splice(index, 1)
    }

    const editRow = (index) => editRowIndex.value = index

    const saveRow = () => editRowIndex.value = null

    const addSupportDoc = (index, documentId, documentName) => {
      jsonData.value[index].supportingDocuments.push({
          documentName: documentName,
          documentURI: process.env.VUE_APP_SYSTEM_API_URL + "/uploads/v1/" + documentId,
        });
    }

    const removeSupportDoc = (index, data) => {
      console.log(index, data)
    }

    const chooseFiles = () => {
      document.getElementById("file-upload").click()
    }
    
    const getCompanyIdByCompanyName = (companyName) => {
      const api = `/company/v1/${companyName}`;
      return new Promise( resolve => {
        appAxios.get(api).then(res => {
          resolve(res.data.companyId)
        })
      })
    }

    const submitInvoice = async () => {
      loading.value = !loading.value
      if(store.state.auth.user_role === 'Buyer Admin') {
        const api = "/workflow/v1/buyer-led-invoice-financing-workflow-0/0"
        let journalBatchEntries = [];
        await Promise.all(
          jsonData.value.map(async item => {
            const companyId = await getCompanyIdByCompanyName(item.sellerCompanyId);
            journalBatchEntries.push({
              ...item,
              sellerCompanyId: companyId,
              documentDate: moment.utc(item.documentDate).format(),
              paymentDueDate: moment.utc(item.paymentDueDate).format()
            });
          })
        )
        appAxios.post(api, {
          buyerCompanyId: store.state.account.company_uuid,
          journalBatchEntries: journalBatchEntries,
          bidEndTime: moment(bidEndTime.value).format()
        }).then(res => {
          console.log('res = ', res)
          loading.value = !loading.value
          if(res.status === 'error') {
            uploadErrorMessage.value = res.error.response.data
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
          } else {
            cash("#upload-invoice-modal").modal("hide");
            props.callback()
          }
        })      
      } else {
        const api = "/workflow/v1/seller-led-invoice-financing-workflow-1/0"
        let journalBatchEntries = [];
        await Promise.all(
          jsonData.value.map(async item => {
            const companyId = await getCompanyIdByCompanyName(item.sellerCompanyId);
            journalBatchEntries.push({
              ...item,
              buyerCompanyId: companyId,
              documentDate: moment.utc(item.documentDate).format(),
              paymentDueDate: moment.utc(item.paymentDueDate).format()
            });
          })
        )
        appAxios.post(api, {
          sellerCompanyId: store.state.account.company_uuid,
          journalBatchEntries: journalBatchEntries,
          bidEndTime: moment(bidEndTime.value).format()
        }).then(res => {
          console.log(res)
          loading.value = !loading.value;
          if(res.status === 'error') {
            uploadErrorMessage.value = res.error.response.data
            cash("#error-content").text(res.error.response.data)
            Toastify({
              node: cash("#failed-notification-content").clone().removeClass("hidden")[0],
              duration: 3000,
              newWindow: true,
              close: true,
              gravity: "top",
              position: "right",
              stopOnFocus: true,
              text: res.error.response.data
            }).showToast();
          } else {
            cash("#upload-invoice-modal").modal("hide");
            props.callback()
          }
        })
      }   
    }
    
    const fileChoosen = async (event) => {
      console.log(event.target.files)
      const fileUploadApi = 'uploads/v1/invoice_batch';
      // var reader = new FileReader();
      let formData = new FormData();
      formData.append('file', event.target.files[0])
      let res = await sysAxios.post(fileUploadApi, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("res = ", res)
      if(res.status === 200) {}
      return;
      reader.onload = function (e) {
        var data = new Uint8Array(e.target.result);
        var workbook = xlsx.read(data, { type: "array" });
        let sheetName = workbook.SheetNames[0];
        xlsxHeaders.value = [];
        jsonData.value = [];
        xlsxRows.value = [];
        /* DO SOMETHING WITH workbook HERE */
        let worksheet = workbook.Sheets[sheetName];
        xlsxRows.value = xlsx.utils.sheet_to_json(worksheet);
        console.log('xlsxrows = ', xlsxRows.value)
        let sellerCompanyId = ''
        let dueDate = 0
        let currencyCode = ''
        xlsxRows.value.forEach((row) => {
          if(Object.values(row)[0] === 'INV') {
            jsonData.value.push({
              documentNumber: row['__EMPTY'].toString(),
              documentType: Object.values(row)[0],
              sellerCompanyId: sellerCompanyId,
              documentDate: moment(row['__EMPTY_2'], 'DD/MM/YYYY'),
              paymentDueDate: moment(row['__EMPTY_2'], 'DD/MM/YYYY').add(dueDate, 'days'),
              currencyCode: currencyCode,
              amount: row['__EMPTY_9'].replace(',', ''),
              supportingDocuments: []
            })
          }
          else if(Object.values(row)[0] === 'CURRENCY') {
            currencyCode = row['__EMPTY']
          } else {
            sellerCompanyId = row['__EMPTY']
            if(row['__EMPTY_1']) dueDate = row['__EMPTY_1'].split(' ')[0]
          }
        })
        /**
         * for the test will add the fixed to jsonData 
        */
       /**
        * end of fillin testing data
        */
      };
      reader.readAsArrayBuffer(event.target.files[0]);
    }
    return {
      loading,
      jsonData,
      fileUpload,
      documentFormat,
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
      uploadErrorMessage
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