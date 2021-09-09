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
      <td class="dark:border-dark-5 text-blue-500"><a :href="doc.documentURI.replace('authorization','fileupload') " download>{{doc.documentName}}</a></td>
      <td class="dark:border-dark-5">{{moment(doc.uploadTime).format(dateFormat)}}</td>
      <td class="dark:border-dark-5">{{doc.uploadedByUserName}}</td>
      <td class="dark:border-dark-5"></td>
      <td class="dark:border-dark-5"></td>
      <td class="dark:border-dark-5"></td>
    </tr>
</template>

<script>
import { ref, onMounted } from 'vue'
import { appAxios, sysAxios } from '@/plugins/axios'
import moment from 'moment'
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
  setup(props) {
    const dateFormat = process.env.VUE_APP_DATE_FORMAT;
    const documents = ref();
    onMounted(() => {
      const api = `/journalbatch/v1/header/${props.journalBatchHeaderId }/entry/${props.journalBatchEntryId }/supportingdocuments`;
      
      appAxios.get(api).then(res => {
        console.log(res.data,"doc data");
        documents.value = res.data 
        if(documents.value.length > 0)
        {
          for(let i=0;i<documents.value.length;i++)
          { 
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

    return {
      dateFormat,
      documents,
      moment
    }
  }  
}
</script>
