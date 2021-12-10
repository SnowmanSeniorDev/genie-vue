<template>
  <div v-bind="getRootProps()" class="flex justify-center">
    <div>
      <input v-bind="getInputProps()" :id="index">
      <UploadCloudIcon v-if="!uploadingFiles" class="w-4 h-4 text-red-400" />
      <div v-if="uploadingFiles" class="w-4, h-4 flex items-center">
        uploading
        <LoadingIcon icon="oval" color="red" class="w-3 h-3 ml-2" />
      </div>
    </div> 
  </div> 
    <div class="justify-center flex-flow" > 
        <div v-for="(item, index) in data" :key="index" >
          {{item.documentName}} <button @click="onRemove(index)" style="color:red;"><Trash2Icon class="w-3 h-3" /></button>
          <br /> 
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
    batchIndex: {
      type: Number,
      default: null
    },
    index: {
      type: Number,
      default: null
    },
    data:{
      type: Object,
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
          props.addSupportDoc(props.batchIndex, props.index, res.data, file.name);
        }
      })
      
    }
    const onRemove = async(index) => { 
      props.removeSupportDoc(props.batchIndex, props.index, index);
    }

    const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop })

    return {
      onRemove,
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