<template v-if="documents.length">
    <tr class="odd:bg-gray-200 font-bold" v-bind="$attrs">
      <td class="dark:border-dark-5">SUPPORTING DOCUMENTS</td>
      <td class="dark:border-dark-5">DATE UPLOADED</td>
      <td class="dark:border-dark-5">UPLOADED BY</td>
      <td class="dark:border-dark-5"></td>
      <td class="dark:border-dark-5"></td>
      <td class="dark:border-dark-5"></td>
    </tr>
    <tr v-for="(doc, index) in documents" class="odd:bg-gray-200 intro-y" :key="doc.documentURL">
      <td class="dark:border-dark-5 text-blue-500"><a @click="openFileViewer(doc)" class="cursor-pointer">{{doc.documentName}}</a></td>
      <td class="dark:border-dark-5">{{moment(doc.uploadTime).format(dateFormat)}}</td>
      <td class="dark:border-dark-5">{{doc.uploadedByUserName}}</td>
      <td class="dark:border-dark-5" v-if="documentsVerification.length">
        <div
          v-if="documentsVerification[index].verificationStatus"
          :class="'alert show flex items-center h-5 p-3 text-sm justify-center ' + ((lastWorkStatus.statusName === item.statusName)? 'text-black-700 bg-yellow-200':'text-black-700 bg-green-200' )"
          role="alert"
        >
          <ShieldIcon class="w-3 h-3 mr-3"/>
          <span class="pr-3">Verified</span>
        </div>
        <div
          v-else
          class="alert show flex items-center h-5 p-3 text-sm justify-center text-black-700 bg-red-200"
          role="alert"
        >
          <ShieldIcon class="w-3 h-3 mr-3"/>
          <span class="pr-3">Not Verified</span>
        </div>
      </td>
      <td class="dark:border-dark-5"></td>
      <td class="dark:border-dark-5"></td>
    </tr>
    <div :id="`show-pdf-file-viewer-${journalBatchEntryId}`" class="modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <embed type="application/pdf" :src="openFileUrl" width="1000" height="1500">
        </div>
      </div>
    </div>
    <div :id="`show-xlsx-file-viewer-${journalBatchEntryId}`" class="modal" tabindex="-1" aria-hidden="true">
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
</template>

<script>
import { ref, onMounted } from 'vue'
import { appAxios, sysAxios } from '@/plugins/axios'
import moment from 'moment'
import { XlsxRead, XlsxTable } from "vue3-xlsx"

export default {
  props: {
    journalBatchHeaderId: {
      type: String,
      required: true
    },
    journalBatchEntryId: {
      type: String,
      required: true
    },
    traceId: {
      type: String,
      required: true
    },
    entryType: {
      type: String,
      required: true
    },
    documentNumber: {
      type: String,
      required: true
    }
  },
  components: {
    XlsxRead,
    XlsxTable,
  },
  setup(props) {
    const dateFormat = process.env.VUE_APP_DATE_FORMAT;
    const documents = ref([]);
    const openFileUrl = ref('');
    const xlsx = ref({
      file: null,
      selectedSheet: null,
      sheetName: null,
      sheets: null,
      collection: null
    });
    const documentsVerification = ref([]);
    const openFileViewer = async (doc) => {
      const api = doc.documentURI
      const fileResponse = await sysAxios.get(api, {responseType: 'blob'})
      if(fileResponse.headers['content-type'] === 'image/jpeg') {
        const file = new Blob([fileResponse.data], {type: 'image/jpeg'});
        const fileURL = URL.createObjectURL(file);
        // openFileUrl.value = fileURL
        // cash("#show-pdf-file-viewer").modal("show")
        window.open(fileURL);
      } else if (fileResponse.headers['content-type'] === 'application/pdf') {
        const file = new Blob([fileResponse.data], {type: 'application/pdf'});

        const fileURL = URL.createObjectURL(file);
        openFileUrl.value = fileURL
        cash(`#show-pdf-file-viewer-${props.journalBatchEntryId}`).modal("show")
      } else if (fileResponse.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const file = new Blob([fileResponse.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        xlsx.value.file = file
        cash(`#show-xlsx-file-viewer-${props.journalBatchEntryId}`).modal("show")
      }
    }

    const getUploadedByUserName = async (userId) => {                 

      var userName = "";
      if(userId === '00000000-0000-0000-0000-000000000000') {
        userName = "System";  
      }
      else {
        await sysAxios.get(`/user/v1/${userId}`).then(res => {
          userName = res.data.firstName + ' ' + res.data.lastName;
        });                 
      }
      return new Promise(resolve => resolve(userName))
    };

    const init = async () => {
      const api = `/journalbatch/v1/header/${props.journalBatchHeaderId }/entry/${props.journalBatchEntryId }/supportingdocuments`;
      await appAxios.get(api).then(res => {
        documents.value = res.data
        if(documents.value.length > 0){
          for(let i=0;i<documents.value.length;i++){
            const fileInfoApi = documents.value[i].documentURI + '/info';
            appAxios.get(fileInfoApi).then((res2)=>{
              documents.value[i].contentType = res2.data.contentType;
            });

            getUploadedByUserName(documents.value[i].uploadedByUserId).then((userName)=>{
              documents.value[i].uploadedByUserName = userName;
            });
          }
        }
      })
      const verifyApi = `traceability/v2/verify/journalbatch/${props.traceId}/${props.journalBatchEntryId}/supportingdocument`
      const requestBody = [
        {
          entryId: props.documentNumber,
          entryType: props.entryType,
          supportingDocument: []
        }
      ]
      //example of request body for the document verification
      // [
      //   {
      //     "entryId": "INV-0003T",
      //     "entryType": "Inv",
      //     "supportingDocument": [
      //       {
      //         "supportingdocumentcategory": "Supporting Document",
      //         "supportingdocumentname": "RVS WMS format - Aged Payables (For Developer Testing).xlsx",
      //         "identity": "bee71658-10e6-4056-89aa-08d981c6e223",
      //         "datetimeutc": 1633066141405,
      //         "dataHash": {
      //           "value": "a96c6cb9aef7084f90b6e58f8edeb822a2aab4e038571e518082364a8602595d",
      //           "algorithm": "SHA256"
      //         }
      //       }
      //     ]
      //   }
      // ]

      //request body of current version.
      // {
      //   "entryId": "d2e69284-3804-4d7f-d342-08d9849c57d0",
      //   "entryType": "Inv",
      //   "supportingDocument": [
      //     {
      //       "supportingdocumentcategory": "Supporting Document",
      //       "supportingdocumentname": "RVS WMS format - Aged Payables (For Developer Testing).xlsx",
      //       "identity": "55c51527-0c78-4067-8c5b-08d9849c57f2",
      //       "datetimeutc": 1633094927490,
      //       "dataHash": {
      //         "value": "a96c6cb9aef7084f90b6e58f8edeb822a2aab4e038571e518082364a8602595d",
      //         "algorithm": "SHA256"
      //       }
      //     }
      //   ]
      // }
      await Promise.all(
        documents.value.map(async document => {
          const dataHash = await appAxios.get(`${document.documentURI}/info`).then(res => res.data.dataHash)
          requestBody[0].supportingDocument.push({
            supportingdocumentcategory: "Supporting Document",
            supportingdocumentname: document.documentName,
            identity: document.supportingDocumentId,
            datetimeutc: moment.utc(document.uploadTime).valueOf(),
            dataHash
          })
        })
      )
      documentsVerification.value = await sysAxios.post(verifyApi, requestBody).then(res => {
        return res.data[0].supportingDocument
      })

      return new Promise(resolve => {
        resolve('init done')
      })
    }
    onMounted(() => {
      init()
    });


    return {
      dateFormat,
      documents,
      documentsVerification,
      moment,
      openFileUrl,
      openFileViewer,
      xlsx,
    }
  }  
}
</script>
