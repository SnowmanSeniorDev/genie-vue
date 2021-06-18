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
            <div class="form-inline w-128">
              <label for="role-name" class="form-label">Document Type</label>
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
              <button class="btn btn-outline-primary" @click="chooseFiles">
                <UploadIcon class="w-4 h-4 mr-2" />
                Upload Invoice
              </button>
              <div id="basic-datepicker" class="p-5">
                <div class="preview">
                  <Litepicker
                    v-model="bidEndTime"
                    @change="changedDate"
                    :options="{
                      autoApply: false,
                      showWeekNumbers: true,
                      zIndex: 10001,
                      dropdowns: {
                        minYear: 1990,
                        maxYear: null,
                        months: true,
                        years: true
                      }
                    }"
                    class="form-control w-56 block mx-auto"
                  />
                </div>
              </div>
            </div>
            <input id="file-upload" ref="fileUpload" type="file" class="hidden" @change="fileChoosen">
            <div class="intro-y col-span-12 h-96 overflow-y-auto overflow-x-invisible bg-gray-200 p-1 mt-5">
              <div id="basic-table" class="p-5">
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
                        <tr>
                          <td v-for="(item, index) in tableHeader" :key="index">
                            <select :value="tableHeader[index]" class="header-Table" @change="changeHeader(index, $event)">
                              <option v-for="(header, header_index) in xlsxHeaders" :key="header_index">
                                {{header}}
                              </option>
                            </select>
                          </td>
                        </tr>
                        <tr v-for="(item, index) in jsonData" :key="index">
                          <td class="border-b dark:border-dark-5">{{item.documentNumber}}</td>
                          <td class="border-b dark:border-dark-5">{{item.documentType}}</td>
                          <td class="border-b dark:border-dark-5">{{item.sellerCompanyId}}</td>
                          <td class="border-b dark:border-dark-5">{{item.documentDate}}</td>
                          <td class="border-b dark:border-dark-5">{{item.paymentDueDate}}</td>
                          <td class="border-b dark:border-dark-5">{{item.currencyCode}}</td>
                          <td class="border-b dark:border-dark-5">{{item.amount}}</td>
                          <td class="border-b dark:border-dark-5 fileupload-col">
                            <SupportDropzone :index="index" :addSupportDoc="addSupportDoc" :removeSupportDoc="removeSupportDoc"/>
                          </td>
                          <td class="flex">
                            <button class="btn btn-sm btn-danger" @click="removeRow(index)">
                              <Trash2Icon class="w-5 h-5" />
                            </button>
                            <button class="btn btn-sm ml-2 btn-primary" @click="editRow(index)">
                              <EditIcon class="w-5 h-5" />
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

export default {
  components: {
    SupportDropzone
  },
  setup(){
    const store = useStore();
    const xlsxRows = ref();
    const xlsxHeaders = ref();
    const jsonData = ref([]);
    const fileUpload = ref(null);
    const tableHeader = ref([]);
    const documentFormat = ref("RVS WMS");
    const jsonHeaders = ref([
      'documentNumber', 'documentType', 'vendorDocumentReferenceNumber', 'postingDate', 'dueDate', 'currencyCode', 'amount'
    ]);
    const bidEndTime = ref(moment(new Date()).format("D MMM, YYYY"))
    console.log(store.state.account.company_uuid)

    const changedDate = (evt) => {
      console.log(evt)
    }

    const setDocumentFromat = (format) => {
      documentFormat.value = format
      cash(".dropdown-menu").dropdown("hide");
    }
    
    const changeHeader = (index, event) => {
      tableHeader.value[index] = event.target.value;
      for(var i = 0; i < jsonData.value.length; i++) {
        jsonData.value[i][jsonHeaders.value[index]] = xlsxRows.value[i][event.target.value]
      }
    }

    const removeRow = (index) => {
      jsonData.value.splice(index, 1)
      xlsxRows.value.splice(index, 1)
      console.log(jsonData.value)
      console.log(xlsxRows.value)
    }

    const addSupportDoc = (index, documentId, documentName) => {
      jsonData.value[index].supportingDocuments.push({
          documentName: documentName,
          documentURI: "https://fileupload.bsg-api.tk/api/uploads/v1/" + documentId,
        });
    }

    const removeSupportDoc = (index, data) => {
      console.log(index, data)
    }

    const chooseFiles = () => {
      document.getElementById("file-upload").click()
    }
    
    const getSellerCompanyId = (companyName) => {
      const api = `https://companies.bsg-api.tk/api/genie/company/v1/${companyName}`;
      return new Promise( resolve => {
        sysAxios.get(api).then(res => {
          resolve(res.data.companyId)
        })
      })
    }
    const submitInvoice = async () => {
      const api = "https://workflow.bsg-api.tk/api/genie/workflow/v1/buyer-led-invoice-financing-workflow-0/0"
      
      let journalBatchEntries = [];
      await Promise.all(
        jsonData.value.map(async item => {
          const sellerCompanyId = await getSellerCompanyId("Signet");
          console.log(moment(item.documentDate).format());
          journalBatchEntries.push({
            ...item,
            sellerCompanyId: sellerCompanyId,
            documentDate: moment(item.documentDate).format(),
            paymentDueDate: moment(item.paymentDueDate).format()
          });
        })
      )
      

      appAxios.post(api, {
        buyerCompanyId: store.state.account.company_uuid,
        journalBatchEntries: journalBatchEntries,
        bidEndTime: moment(bidEndTime.value).format()
      }).then(res => {
        cash("#upload-invoice-modal").modal("hide");
      })      
    }
    
    const fileChoosen = (event) => {
      var reader = new FileReader();
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
        console.log(xlsx.utils.sheet_to_json(worksheet));
        var xlsxData = []
        xlsxRows.value.map((row) => {
          xlsxHeaders.value = _.union(Object.keys(row), xlsxHeaders.value);
          if(Object.keys(row).length >= jsonHeaders.value.length){
            var jsonRow = {};
            for(var i = 0; i < jsonHeaders.value.length; i++)  {
              jsonRow[jsonHeaders.value[i]] = Object.values(row)[i];
            }
            jsonData.value.push(jsonRow);
            xlsxData.push(row);
          }
        })
        /**
         * for the test will add the fixed to jsonData 
        */
       jsonData.value = [
        {
          documentNumber: "INV-UATZ10001",
          documentType: "INV",
          sellerCompanyId: "MonsterInc01",
          documentDate: "11/01/2021",
          paymentDueDate: "02/03/2021",
          currencyCode: "USD",
          amount: 300.00,
          supportingDocuments: []
        }, {
          documentNumber: "INV-UATZ10002",
          documentType: "INV",
          sellerCompanyId: "MonsterInc01",
          documentDate: "11/01/2021",
          paymentDueDate: "02/03/2021",
          currencyCode: "USD",
          amount: 862.00,
          supportingDocuments: []
        }, {
          documentNumber: "INV-UATZ10003",
          documentType: "INV",
          sellerCompanyId: "MonsterInc01",
          documentDate: "11/01/2021",
          paymentDueDate: "12/03/2021",
          currencyCode: "USD",
          amount: 4325.00,
          supportingDocuments: []
        }, {
          documentNumber: "INV-UATZ10004",
          documentType: "INV",
          sellerCompanyId: "MonsterInc01",
          documentDate: "11/01/2021",
          paymentDueDate: "12/03/2021",
          currencyCode: "USD",
          amount: 4575.00,
          supportingDocuments: []
        },
       ]
       /**
        * end of fillin testing data
        */
        xlsxRows.value = xlsxData;
        tableHeader.value = xlsxHeaders.value.slice(0, jsonHeaders.value.length)
      };
      reader.readAsArrayBuffer(event.target.files[0]);
    }

    return {
      xlsxRows,
      xlsxHeaders,
      jsonData,
      fileUpload,
      tableHeader,
      documentFormat,
      jsonHeaders,
      setDocumentFromat,
      changeHeader,
      removeRow,
      chooseFiles,
      submitInvoice,
      fileChoosen,
      addSupportDoc,
      removeSupportDoc,
      bidEndTime,
      changedDate
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