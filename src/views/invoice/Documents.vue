<template>
    <tr class="odd:bg-gray-200 font-bold">
      <td class="dark:border-dark-5">SUPPORTING DOCUMENTS</td>
      <td class="dark:border-dark-5">DATE UPLOADED</td>
      <td class="dark:border-dark-5">UPLOADED BY</td>
      <td class="dark:border-dark-5"></td>
      <td class="dark:border-dark-5"></td>
      <td class="dark:border-dark-5"></td>
    </tr>
    <tr v-for="doc in documents" class="odd:bg-gray-200" :key="doc.documentURL  ">
      <td class="dark:border-dark-5 text-blue-500">{{doc.documentName}}</td>
      <td class="dark:border-dark-5">{{moment(doc.uploadTime).format("DD/MM/YYYY")}}</td>
      <td class="dark:border-dark-5"></td>
      <td class="dark:border-dark-5"></td>
      <td class="dark:border-dark-5"></td>
      <td class="dark:border-dark-5"></td>
    </tr>
</template>

<script>
import { ref, onMounted } from 'vue'
import { appAxios } from '@/plugins/axios'
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
    const documents = ref();
    onMounted(() => {
      const api = `/journalbatch/v1/header/${props.journalBatchHeaderId }/entry/${props.journalBatchEntryId }/supportingdocuments`;
      appAxios.get(api).then(res => {
        documents.value = res.data
      })
    })

    return {
      documents,
      moment
    }
  }
}
</script>
