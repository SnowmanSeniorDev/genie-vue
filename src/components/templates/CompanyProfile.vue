<template>
  <div class="intro-y col-span-12">
    <div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
      <div class="input-form col-span-12 sm:col-span-6">
        <label class="form-label w-full flex flex-col sm:flex-row">
          Company Display Name
          <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
        </label>
        <input
          v-model.trim="companyProfile.companyDisplayName"
          type="text"
          class="form-control"
          placeholder="Enter company display name"
        />
      </div>
      <div class="input-form col-span-12 sm:col-span-6">
        <label class="form-label w-full flex flex-col sm:flex-row">
          Company Legal Name
          <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
        </label>
        <input
          v-model.trim="companyProfile.companyLegalName"
          type="text"
          class="form-control"
          placeholder="Enter company legal name"
        />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
      <div class="input-form col-span-12 sm:col-span-6">
        <label class="form-label w-full flex flex-col sm:flex-row">
          Registration No
          <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
        </label>
        <input
          v-model.trim="companyProfile.registrationNo"
          type="text"
          class="form-control"
          placeholder="Enter company registration number"
        />
      </div>
      <div class="input-form col-span-12 sm:col-span-6">
        <label class="form-label w-full flex flex-col sm:flex-row">
          Tax Number
          <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
        </label>
        <input
          v-model.trim="companyProfile.taxNumber"
          type="text"
          class="form-control"
          placeholder="Enter company tax number"
        />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
      <div class="input-form col-span-12 sm:col-span-6">
        <label class="form-label w-full flex flex-col sm:flex-row">
          Registered Address1
          <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
        </label>
        <input
          v-model.trim="companyProfile.addressLine1"
          type="text"
          class="form-control"
          placeholder="Enter company address 1"
        />
      </div>
      <div class="input-form col-span-12 sm:col-span-6">
        <label class="form-label w-full flex flex-col sm:flex-row">
          Registered Address2
          <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
        </label>
        <input
          v-model.trim="companyProfile.addressLine2"
          type="text"
          class="form-control"
          placeholder="Enter company address 2"
        />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
      <div class="input-form col-span-12 sm:col-span-6">
        <label class="form-label w-full flex flex-col sm:flex-row">
          Registered Address3
          <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
        </label>
        <input
          v-model.trim="companyProfile.addressLine3"
          type="text"
          class="form-control"
          placeholder="Enter company address 3"
        />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
      <div class="input-form col-span-12">
        <label class="form-label w-full flex flex-col sm:flex-row">
          Description About Company
          <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
        </label>
        <textarea
          v-model.trim="companyProfile.descriptionAboutCompany"
          type="text"
          class="form-control"
          placeholder="About company"
          rows="10"
        />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
      <div class="input-form col-span-12 sm:col-span-6">
        <label class="form-label w-full flex flex-col sm:flex-row">
          City
          <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
        </label>
        <input
          v-model.trim="companyProfile.city"
          type="text"
          class="form-control"
          placeholder="City"
        />
      </div>
      <div class="input-form col-span-12 sm:col-span-6">
        <label class="form-label w-full flex flex-col sm:flex-row">
          State
          <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
        </label>
        <input
          v-model.trim="companyProfile.state"
          type="text"
          class="form-control"
          placeholder="State"
        />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
      <div class="input-form col-span-12 sm:col-span-6">
        <label class="form-label w-full flex flex-col sm:flex-row">
          Country
          <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
        </label>
        <input
          v-model.trim="companyProfile.country"
          type="text"
          class="form-control"
          placeholder="Country"
        />
      </div>
      <div class="input-form col-span-12 sm:col-span-6">
        <label class="form-label w-full flex flex-col sm:flex-row">
          Phone
          <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
        </label>
        <input
          v-model.trim="companyProfile.phone"
          type="text"
          class="form-control"
          placeholder="Phone"
        />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
      <div class="input-form col-span-12 sm:col-span-6">
        <label class="form-label w-full flex flex-col sm:flex-row">
          Primary Email
          <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
        </label>
        <input
          v-model.trim="companyProfile.primaryEmail"
          type="email"
          class="form-control"
          placeholder="Primary email"
        />
      </div>
    </div>
    <button class="btn btn-primary mt-8 px-8" @click="save">Save</button>
    <button class="btn btn-danger mt-8 px-8 ml-2" @click="deleteCompany">Delete Company</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { appAxios } from '@/plugins/axios'
import { useRouter } from 'vue-router'
import toast from '@/utils/toast'

export default {
  props: {
    companyId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    
    const router = useRouter()
    const companyProfile = ref({
			companyDisplayName: '',
			companyLegalName: '',
			descriptionAboutCompany: '',
			registrationNo: '',
			taxNumber: '',
			addressLine1: '',
			addressLine2: '',
			addressLine3: '',
			city: '',
			state: '',
			country: null,
			phone: '',
			primaryEmail: '',
		})

    const deleteCompany = () => {
      toast({
        status: 'success',
        title: 'delete company',
        content: 'successfuly delete the company'
      })
      return
      const api = `company/v1/${companyProfile.value.companyId}`
      appAxios.delete(api).then(res => {
        if(res) {
          router.push({path: `/companies`})
        }
      })
    }

    const save = () => {
      const api = `company/v1/${companyProfile.value.companyId}`
      appAxios.put(api, companyProfile.value).then(res => {
        console.log("res = ", res.data)
      })
    }

    const init = async () => {
      const getCompanyInfo = `/company/v1/${props.companyId}`
      const res = await appAxios.get(getCompanyInfo)
      companyProfile.value = {...res.data}
    }

    onMounted(() => {
      init()
    })

    return {
      companyProfile,
      save,
      deleteCompany
    };
  },
};
</script>