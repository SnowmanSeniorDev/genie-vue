<template>
	<div class='dark:border-dark-5'>
		<div class='font-medium text-2xl'>KYC Documents</div>
		<div class='grid grid-cols-12 gap-4 gap-y-5 mt-5'>
			<div class='intro-y col-span-12'>
        <table class='table table--lg'>
          <thead>
            <tr class='bg-theme-2'>
              <th class='dark:border-dark-5 whitespace-nowrap w-1/5'> DOCUMENT CATEGORY </th>
              <th class='dark:border-dark-5 whitespace-nowrap w-3/5'> STATUS </th>
              <th class='dark:border-dark-5 whitespace-nowrap text-center w-1/12'> ACTIONS </th>
            </tr>
          </thead>
          <tbody>
            <tr class='odd:bg-gray-200' v-for='(item, index) in docList' :key='index'>
              <td class='dark:border-dark-5'>{{item.category}}</td>
              <td class='dark:border-dark-5'>
                <div class='alert alert-warning-soft show flex items-center justify-center h-5 p-3 text-sm' role='alert'>
                <!-- <div class='alert show flex items-center h-5 p-3 text-sm justify-center text-blue-700 bg-blue-200' role='alert'> -->
                  {{item.status}}
                </div>
              </td>
              <td class='dark:border-dark-5'>
                <div class='grid grid-cols-2'>
                  <div class='flex justify-center'>
                    <UploadIcon class='w-4 h-4' @click='openFileUploadModal(index)'/>
                  </div>
                  <div class='flex justify-center' v-if='item.corporateInfoHeaderId'>
                    <MinusCircleIcon class='w-4 h-4' @click='removeDoc(index)'/>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
			</div>
			<div class='intro-y col-span-12 flex items-center justify-center sm:justify-start mt-5'>
				<button class='btn bg-red-600 w-24 ml-2 text-white'>Save</button>
				<button class='btn bg-purple-800 w-42 ml-2 text-white' @click='submit'>Submit for Approval</button>
			</div>
		</div>
    <!-- BEGIN: File Upload Modal Content -->
    <div id='kyc-doc-file-upload' class='modal' tabindex='-1' aria-hidden='true'>
     <div class='modal-dialog modal-lg'>
        <div class='modal-content'>
          <!-- BEGIN: Modal Header -->
          <div class='modal-header'>
            <h2 class='font-medium text-base mr-auto'> File Upload </h2>
          </div> <!-- END: Modal Header -->
          <div class='m-8'>
            <div>
              <div v-bind='getRootProps()' class='flex justify-center border-red-400 border-dashed border-2 rounded-lg cursor-pointer'>
                <div class='text-center py-5'>
                  <template v-if='!files'>
                    <input v-bind='getInputProps()' >
                    <UploadCloudIcon class='w-24 h-20 text-red-400' />
                    <div class='text-lg font-medium text-gray-600'> 
                      Drag and drop here<br>or
                    </div>
                    <div class='text-red-400'>browse</div>
                  </template>
                  <template v-else>
                    <div class='relative'>
                      <div class='absolute top-0 right-1'>
                        <XCircleIcon @click='removeFile' class='w-6 h-6' />
                      </div>
                      <FileTextIcon class='w-24 h-24'/>
                    </div>
                    {{files[0].name}}
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class='modal-footer text-right'>
            <button type='button' @click='save' class='btn bg-red-400 w-full text-white' > Save </button>
          </div> <!-- END: Modal Footer   -->
        </div>
      </div>
    </div>
     <!--END: File Upload Modal Content -->
	</div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ref, onMounted, reactive } from 'vue'
import _ from 'lodash'
import { sysAxios, appAxios } from '@/plugins/axios'
import { useDropzone } from 'vue3-dropzone'

export default {
	setup() {
		const router = useRouter()
    const store = useStore()
    const setDocIndex = ref()
    const docList = ref([])
    const files = ref()

    const onDrop = (acceptFiles, rejectReasons) => {
      files.value = acceptFiles
    }

    const options = reactive({
      multiple: true,
      onDrop,
      accept: '.jpg, .csv, .txt, .pdf, .docx, .xlsx',
    })

    const { getRootProps, getInputProps, ...rest } = useDropzone(options)

    onMounted(async () => {
			const companyProfileSystemConfig = 'configuration/v1/Company Profile'
      const getCompanyCoporateInfoApi = `/company/v1/${store.state.account.company_uuid}/corporateinfo`
      await sysAxios.get(companyProfileSystemConfig).then(res => {
        JSON.parse(_.find(res.data[0].configurations, {name: 'kyc_dument_category'}).value).forEach(item => {
          docList.value.push({
            corporateInfoHeaderId: '',
            category: item,
            status: 'waiting for document upload',
          })
        })
      })
      await appAxios.get(getCompanyCoporateInfoApi).then(res => {
        for(let index in res.data){
          docList.value[_.findIndex(docList.value, {category: res.data[index].corporateInfoDocumentCategoryName})] = {
            corporateInfoHeaderId: res.data[index].corporateInfoHeaderId,
            category: res.data[index].corporateInfoDocumentCategoryName,
            status: res.data[index].approvalStatus
          }
        }
      })
    })

    const openFileUploadModal = (index) => {
      setDocIndex.value = index
      cash('#kyc-doc-file-upload').modal('show')
    }

    const gotoBack = () => {
      store.commit('account/SET_STEP', {step: 'currency-settings'})
      router.go(-1)
    }

    const submit = () => {
      const api = `/company/v1/register/${store.state.account.company_uuid}?step=approval`
      console.log(store.getters['account/getAccount'])
      appAxios.post(api, {
        userId: store.state.auth.user_id,
        displayPicture: 'I do not know'
      })
    }

    const removeFile = () => {
      files.value = null
    }

    const save = async () => {
      const fileUploadApi = 'uploads/v1/kyc'
      const corporateinfoApi = `/company/v1/${store.state.account.company_uuid}/corporateinfo`
      let formData = new FormData()
      formData.append('file', files.value[0])
      let res = await sysAxios.post(fileUploadApi, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
      })

      if(res.status === 200) {
        if(docList.value[setDocIndex.value].corporateInfoHeaderId){
          appAxios.put(`${corporateinfoApi}/${docList.value[setDocIndex.value].corporateInfoHeaderId}`, {
              corporateInfoFile: {
                fileURI: process.env.VUE_APP_SERVICE_API_URL + 'uploads/v1/' + res.data
              }
            }
          ).then(() => {
            files.value = null
            cash('#kyc-doc-file-upload').modal('hide')
          })
        } else {
          appAxios.post(corporateinfoApi, [{
              corporateInfoDocumentCategoryName: docList.value[setDocIndex.value].category,
              corporateInfoFile: {
                fileURI: process.env.VUE_APP_SERVICE_API_URL + 'uploads/v1/' + res.data
              }
            }
          ]).then((res) => {
            files.value = null
            docList.value[setDocIndex.value].corporateInfoHeaderId = res.data[0]
            docList.value[setDocIndex.value].status = 'Pending'
            cash('#kyc-doc-file-upload').modal('hide')
          })
        }
      }
    }

    const removeDoc = (index) => {
      const corporateinfoApi = `/company/v1/${store.state.account.company_uuid}/corporateinfo/${docList.value[index].corporateInfoHeaderId}`
      appAxios.delete(corporateinfoApi).then(() => {
        docList.value[index].corporateInfoHeaderId = ''
        docList.value[index].status = 'waiting for document upload'
      })
    }

    return {
      gotoBack,
      submit,
      openFileUploadModal,
      docList,
      save,
      removeDoc,
      getRootProps,
      getInputProps,
      files,
      removeFile,
      ...rest,
    }
	},
}
</script>
