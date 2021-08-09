<template>
  <div v-bind="getRootProps()" class="flex justify-center">
    <div v-if="!files.length">
      <input v-bind="getInputProps()" :id="index">
      <UploadCloudIcon v-if="!uploadingFiles" class="w-4 h-4 text-red-400" />
      <div v-if="uploadingFiles" class="w-4, h-4">
        uploading
        <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
      </div>
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
    const uploadingFiles = ref(false)
    const onDrop = async (acceptFiles, rejectReasons ) => {
      const fileUploadApi = 'uploads/v1/supporting_document';
      let formData = new FormData();
      uploadingFiles.value = true
      console.log("acceptFiles = ", acceptFiles)
      acceptFiles.forEach(async file => {
        uploadingFiles.value = true
        formData.append('file', file)
        let res = await sysAxios.post(fileUploadApi, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });
        if(res.status === 200) {
          files.value.push(file)
          uploadingFiles.value = false
          props.addSupportDoc(props.index, res.data, file.name);
        }
      })
      
    }

    const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop })

    return {
      files,
      getRootProps,
      getInputProps,
      uploadingFiles,
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