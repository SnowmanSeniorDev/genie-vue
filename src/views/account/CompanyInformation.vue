<template>
	<div class="px-5 sm:px-20 mt-10 pt-10 border-t border-gray-200 dark:border-dark-5">
		<div class="font-medium text-base">Company Information</div>
		<div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-company-display-name" class="form-label">Company Display Name</label>
				<input id="account-1-company-display-name" type="text" v-model="companyProfile.companyDisplayName" class="form-control" placeholder="input company name"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-company-legal-name" class="form-label">Company Legal Name</label>
				<input id="account-1-company-legal-name" type="text" v-model="companyProfile.companyLegalName"  class="form-control" placeholder="Registration no"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-company-registration-no" class="form-label">Registration No</label>
				<input id="account-1-company-registration-no" type="text" v-model="companyProfile.registrationNo" class="form-control" placeholder="Registration no"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-company-tax-number" class="form-label">Tax Number</label>
				<input id="account-1-company-tax-number" type="text" v-model="companyProfile.taxNumber" class="form-control" placeholder="Tax Number"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-registered-address-1" class="form-label">Registered Address</label>
				<input id="account-1-registered-address-1" type="text" v-model="companyProfile.addressLine1" class="form-control" placeholder="Company Address Line 1"/>
				<input id="account-1-registered-address-2" type="text" v-model="companyProfile.addressLine2" class="form-control mt-3" placeholder="Company Address Line 2"/>
				<input id="account-1-registered-address-3" type="text" v-model="companyProfile.addressLine3" class="form-control mt-3" placeholder="Company Address Line 3"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-company-description-about-company" class="form-label">Description About Company</label>
				<textarea id="account-1-company-description-about-company" rows="6" v-model="companyProfile.descriptionAboutCompany" class="form-control" placeholder="describe about the company"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-city" class="form-label">City</label>
				<input id="account-1-city" type="text" v-model="companyProfile.city" class="form-control" placeholder="City"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-state" class="form-label">State</label>
				<input id="account-1-state" type="text" v-model="companyProfile.state" class="form-control" placeholder="City"/>
			</div>
      <div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-country" class="form-label">Country</label>
        <select id="account-1-country" v-model="companyProfile.country" class="form-select">
					<option v-for="(country, index) in countries" :key="index">
						{{country}}
					</option>
        </select>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-phone" class="form-label">Phone</label>
				<input id="account-1-Phone" type="text" v-model="companyProfile.phone" class="form-control" placeholder="Phone number"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-email" class="form-label">Primary Email</label>
				<input id="account-1-email" type="text" v-model="companyProfile.primaryEmail" class="form-control" placeholder="Primary Email"/>
			</div>
			<div class="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
				<button class="btn btn-primary w-24 ml-2" @click="gotoNext">Next</button>
			</div>
		</div>
		<div id="success-notification-content" class="toastify-content hidden flex">
			<CheckCircleIcon class="text-theme-9" />
			<div class="ml-4 mr-4">
				<div class="font-medium">Successfly Added Company Profile!</div>
			</div>
		</div>
		<div id="failed-notification-content" class="toastify-content hidden flex">
				<XCircleIcon class="text-theme-6" />
				<div class="ml-4 mr-4">
					<div class="font-medium">Add Company profile was failed!</div>
					<div class="text-gray-600 mt-1">Please fillin correct value of the company profile.</div>
				</div>
		</div>
	</div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ref, onMounted } from "vue";
import https from "@/plugins/axios";
import axios from "axios";
import Toastify from "toastify-js";
import _ from "lodash";

export default {
	setup() {
    const router = useRouter()
    const store = useStore();
    const countries = ref([]);
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
			country: '',
			phone: '',
			primaryEmail: ''
		})
		onMounted(() => {
			const companyProfileSystemConfig = 'configuration/v1/Company Profile';
			https.get(companyProfileSystemConfig).then(res => {
				countries.value = JSON.parse(_.find(res.data[0].configurations, {name: "countries"}).value);
			})
		})

		const gotoNext = () => {
			const companyRegisterAPi = "https://companies.bsg-api.tk/api/genie/company/v1/register";
			axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('id_token')}`;
			axios.post(companyRegisterAPi, companyProfile.value).then(res => {
				if(res.status === 200) {
					console.log(res.data);
					store.commit('account/SET_COMPANYID', {company_uuid: res.data});
					Toastify({
          node: cash("#failed-notification-content").clone().removeClass("hidden")[0],
						duration: 3000,
						newWindow: true,
						close: true,
						gravity: "top",
						position: "right",
						stopOnFocus: true
					}).showToast();
					store.commit('account/SET_STEP', {step: "bank-information"});
					router.push({path: "/account/bank-information"})
				}
			})
    }

    return {
      gotoNext,
			countries,
			companyProfile
    }
	},
}
</script>
