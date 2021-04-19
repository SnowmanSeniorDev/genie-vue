<template>
	<div class="px-5 sm:px-20 mt-10 pt-10 border-t border-gray-200 dark:border-dark-5">
		<div class="font-medium text-base">KYC Documents</div>
		<div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
			<div class="intro-y col-span-12">
        <table class="table table--lg border-l border-r border-b">
          <thead>
            <tr class="bg-gray-400">
              <th class="dark:border-dark-5 whitespace-nowrap w-1/5"> DOCUMENT CATEGORY </th>
              <th class="dark:border-dark-5 whitespace-nowrap"> DOCUMENT NAME </th>
              <th class="dark:border-dark-5 whitespace-nowrap w-1/5"> STATUS </th>
              <th class="dark:border-dark-5 whitespace-nowrap text-center w-1/12"> ACTIONS </th>
            </tr>
          </thead>
          <tbody>
            <tr class="odd:bg-gray-200">
              <td class="dark:border-dark-5">ACRA Full Profile</td>
              <td class="dark:border-dark-5">o1_ACRA.pdf</td>
              <td class="dark:border-dark-5">
                <div class="alert alert-warning-soft show flex items-center justify-center h-5 p-3 text-sm" role="alert">
                  Pending Validation
                </div>
              </td>
              <td class="dark:border-dark-5">
                <div class="grid grid-cols-2">
                  <div class="flex justify-center">
                    <UploadIcon class="w-4 h-4" @click="openFileUploadModal('acra-full-profile')"/>
                  </div>
                  <div class="flex justify-center">
                    <MinusCircleIcon class="w-4 h-4" />
                  </div>
                </div>
              </td>
            </tr>
            <tr class="odd:bg-gray-200">
              <td class="dark:border-dark-5">Director's CBS</td>
              <td class="dark:border-dark-5">Direcot's CBS</td>
              <td class="dark:border-dark-5">
                <div class="alert alert-warning-soft show flex items-center justify-center h-5 p-3 text-sm" role="alert">
                  Pending Validation
                </div>
              </td>
              <td class="dark:border-dark-5">
                <div class="grid grid-cols-2">
                  <div class="flex justify-center">
                    <UploadIcon class="w-4 h-4" @click="openFileUploadModal('cbs')"/>
                  </div>
                  <div class="flex justify-center">
                    <MinusCircleIcon class="w-4 h-4" />
                  </div>
                </div>
              </td>
            </tr>
            <tr class="odd:bg-gray-200">
              <td class="dark:border-dark-5">Director's ID/PP</td>
              <td class="dark:border-dark-5">o1_ACRA.pdf</td>
              <td class="dark:border-dark-5">
                <div class="alert show flex items-center h-5 p-3 text-sm justify-center text-blue-700 bg-blue-200" role="alert">
                  Pending Upload
                </div>
              </td>
              <td class="dark:border-dark-5">
                <div class="grid grid-cols-2">
                  <div class="flex justify-center">
                    <UploadIcon class="w-4 h-4" @click="openFileUploadModal('id/pp')"/>
                  </div>
                  <div class="flex justify-center hidden">
                    <MinusCircleIcon class="w-4 h-4" />
                  </div>
                </div>
              </td>
            </tr>
            <tr class="odd:bg-gray-200">
              <td class="dark:border-dark-5">Direcot's NDA</td>
              <td class="dark:border-dark-5"></td>
              <td class="dark:border-dark-5">
                <div class="alert show flex items-center h-5 p-3 text-sm justify-center text-blue-700 bg-blue-200" role="alert">
                  Pending Upload
                </div>
              </td>
              <td class="dark:border-dark-5">
                <div class="grid grid-cols-2">
                  <div class="flex justify-center">
                    <UploadIcon class="w-4 h-4" @click="openFileUploadModal('dna')"/>
                  </div>
                  <div class="flex justify-center hidden">
                    <MinusCircleIcon class="w-4 h-4" />
                  </div>
                </div>
              </td>
            </tr>
            <tr class="odd:bg-gray-200">
              <td class="dark:border-dark-5">GST Return for last year</td>
              <td class="dark:border-dark-5"></td>
              <td class="dark:border-dark-5">
                <div class="alert show flex items-center h-5 p-3 text-sm justify-center text-blue-700 bg-blue-200" role="alert">
                  Pending Validation
                </div>
              </td>
              <td class="dark:border-dark-5">
                <div class="grid grid-cols-2">
                  <div class="flex justify-center">
                    <UploadIcon class="w-4 h-4" @click="openFileUploadModal('gst')"/>
                  </div>
                  <div class="flex justify-center hidden">
                    <MinusCircleIcon class="w-4 h-4" />
                  </div>
                </div>
              </td>
            </tr>
            <tr class="odd:bg-gray-200">
              <td class="dark:border-dark-5">Last 2 years Fin Statement</td>
              <td class="dark:border-dark-5"></td>
              <td class="dark:border-dark-5">
                <!-- <div class="alert alert-warning-soft show flex items-center justify-center h-5 p-3 text-sm" role="alert"> -->
                <div class="alert show flex items-center h-5 p-3 text-sm justify-center text-blue-700 bg-blue-200" role="alert">
                  Pending Validation
                </div>
              </td>
              <td class="dark:border-dark-5">
                <div class="grid grid-cols-2">
                  <div class="flex justify-center">
                    <UploadIcon class="w-4 h-4" @click="openFileUploadModal('statement')"/>
                  </div>
                  <div class="flex justify-center hidden">
                    <MinusCircleIcon class="w-4 h-4" />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
			</div>
			<div class="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
				<button class="btn btn-secondary w-24" @click="gotoBack">Previous</button>
				<button class="btn bg-red-600 w-24 ml-2 text-white">Save</button>
				<button class="btn bg-purple-800 w-42 ml-2 text-white" @click="submit">Submit for Approval</button>
			</div>
		</div>
    <!-- BEGIN: File Upload Modal Content -->
    <div id="kyc-doc-file-upload" class="modal" tabindex="-1" aria-hidden="true">
     <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- BEGIN: Modal Header -->
          <div class="modal-header">
            <h2 class="font-medium text-base mr-auto"> File Upload </h2>
          </div> <!-- END: Modal Header -->
          <div class="m-8">
            <Dropzone ref-key="dropzoneSingleRef" :options="{ url: 'https://httpbin.org/post', thumbnailWidth: 150, maxFilesize: 0.5, maxFiles: 1, headers: { 'My-Awesome-Header': 'header value' } }" class="dropzone">
              <UploadCloudIcon class="w-24 h-20 text-red-400" />
              <div class="text-lg font-medium text-gray-600"> 
                Drag and drop here<br>or
              </div>
              <div class="text-red-400">browse</div>
            </Dropzone>
          </div>
          <div class="modal-footer text-right">
            <button type="button" data-dismiss="modal" class="btn bg-red-400 w-full text-white" > Save </button>
          </div> <!-- END: Modal Footer -->
        </div>
      </div>
    </div>
     <!--END: File Upload Modal Content -->
	</div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ref } from "vue";

export default {
	setup() {
		const router = useRouter();
    const store = useStore();
    const docType = ref('');

    const openFileUploadModal = (type) => {
      docType.value = type;
      cash("#kyc-doc-file-upload").modal("show");
    }

    const gotoBack = () => {
      store.commit('account/SET_STEP', {step: "currency-settings"});
      router.go(-1)
    }

    const submit = () => {
      console.log(store.getters['account/getAccount']);
    }

    return {
      gotoBack,
      submit,
      openFileUploadModal,
    }
	},
}
</script>
