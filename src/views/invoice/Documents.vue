<template>
    <tr class="odd:bg-gray-200 font-bold" v-bind="$attrs">
      <td class="dark:border-dark-5">SUPPORTING DOCUMENTS</td>
      <td class="dark:border-dark-5">DATE UPLOADED</td>
      <td class="dark:border-dark-5">UPLOADED BY</td>
      <td class="dark:border-dark-5"></td>
      <td class="dark:border-dark-5"></td>
      <td class="dark:border-dark-5"></td>
    </tr>
    <tr v-for="doc in documents" class="odd:bg-gray-200 intro-y" :key="doc.documentURL  ">
      <td class="dark:border-dark-5 text-blue-500"><a @click="openFileViewer(doc)" class="cursor-pointer">{{doc.documentName}}</a></td>
      <td class="dark:border-dark-5">{{moment(doc.uploadTime).format(dateFormat)}}</td>
      <td class="dark:border-dark-5">{{doc.uploadedByUserName}}</td>
      <td class="dark:border-dark-5"></td>
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
import { XlsxRead, XlsxTable } from "vue3-xlsx";

export default {
  props: {
    journalBatchHeaderId: {
      type: String,
      required: true
    },
    journalBatchEntryId: {
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
    const documents = ref();
    const openFileUrl = ref('');
    const xlsx = ref({
      file: null,
      selectedSheet: null,
      sheetName: null,
      sheets: null,
      collection: null
    });
    const openFileViewer = async (doc) => {
      const api = doc.documentURI
      // const api = '/uploads/v1/eb4107db-4f31-4a8b-b66f-ec8aac941189'
      // const api = '/uploads/v1/cefcd620-ebfd-469f-9139-807b66aa2f95'
      // const api = '/uploads/v1/d75b0a3d-3506-42fd-ad8a-535efc4ac018'
      const fileResponse = await sysAxios.get(api, {responseType: 'blob'})
      console.log("file response = ", fileResponse)
      if(fileResponse.headers['content-type'] === 'image/jpeg') {
        const file = new Blob([fileResponse.data], {type: 'image/jpeg'});
        const fileURL = URL.createObjectURL(file);
        // openFileUrl.value = fileURL
        // cash("#show-pdf-file-viewer").modal("show")
        window.open(fileURL);
      } else if (fileResponse.headers['content-type'] === 'application/pdf') {
        const file = new Blob([fileResponse.data], {type: 'application/pdf'});

        const fileURL = URL.createObjectURL(file);
        console.log("file url = ", fileURL)
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
    onMounted(() => {
      const api = `/journalbatch/v1/header/${props.journalBatchHeaderId }/entry/${props.journalBatchEntryId }/supportingdocuments`;
      
      appAxios.get(api).then(res => {
        documents.value = res.data
        console.log(documents.value)
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
    });


    return {
      dateFormat,
      documents,
      moment,
      openFileUrl,
      openFileViewer,
      xlsx,
    }
  }  
}
</script>
