<template>
  <div v-bind="getRootProps()" class="flex justify-center">
    <div v-if="!files.length">
      <input v-bind="getInputProps()" :id="index">
      <UploadCloudIcon class="w-4 h-4 text-red-400" />
    </div>
    <div v-else  class="dropzone-document-title">
      <input v-bind="getInputProps()" :id="index">
      <div v-for="(item, index) in files" :key="index">
        {{item.name}}
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useDropzone } from 'vue3-dropzone';
import { sysAxios } from '@/plugins/axios';

export default {
  props: {
    addSupportDoc: {
      type: Function,
      default: () => ({})
    },
    removeSupportDoc: {
      type: Function,
      default: () => ({})
    },
    index: {
      type: Number,
      default: null
    }
  },
  setup(props){
    const files = ref([]);
    const onDrop = async (acceptFiles, rejectReasons ) => {
      files.value.push(acceptFiles[0])
      const fileUploadApi = 'uploads/v1/supporting_document';
      let formData = new FormData();
      formData.append('file', acceptFiles[0])
      let res = await sysAxios.post(fileUploadApi, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
      });
      if(res.status === 200) {
        props.addSupportDoc(props.index, res.data, acceptFiles[0].name);
      }
    }

    const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop })

    return {
      files,
      getRootProps,
      getInputProps,
      ...rest
    }
  },
}
</script>

<style scoped>
.dropzone-document-title {
  display: block;
  text-align: center;
}
</style>