<template>
    <!-- <tr class="odd:bg-gray-200 font-bold">
      <td class="dark:border-dark-5">SUPPORTING DOCUMENTS</td>
      <td class="dark:border-dark-5">DATE UPLOADED</td>
      <td class="dark:border-dark-5">UPLOADED BY</td>
      <td class="dark:border-dark-5"></td>
      <td class="dark:border-dark-5"></td>
      <td class="dark:border-dark-5"></td>
    </tr> -->
    <tr class="odd:bg-gray-200">
      <td class="dark:border-dark-5 text-blue-500">01_SupportDocu01.pdf</td>
      <td class="dark:border-dark-5">03/04/2021, 10:03</td>
      <td class="dark:border-dark-5">Jane Levine</td>
      <td class="dark:border-dark-5"></td>
      <td class="dark:border-dark-5"></td>
      <td class="dark:border-dark-5">
        <div class="grid grid-cols-2 gap-2">
          <div class="flex justify-end">
            <UploadIcon class="w-4 h-4"/>
          </div>
          <div class="flex justify-start">
            <MinusCircleIcon class="w-4 h-4" />
          </div>
        </div>
      </td>
    </tr>
</template>

<script>
import { ref, onMounted } from 'vue'
import { sysAxios } from "@/plugins/axios"

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
      const api = `https://journalbatch.bsg-api.tk/api/genie/journalbatch/v1/header/${props.journalBatchHeaderId }/entry/${props.journalBatchEntryId }/supportingdocuments`;
      sysAxios.get(api).then(res => {
        documents.value = res.data
        console.log(res.data)
      })
    })
  }
}
</script>
