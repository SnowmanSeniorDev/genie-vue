<template>
	<div class="dark:border-dark-5">
		<div class="font-medium text-2xl">Company Information</div>
		<div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-company-display-name" class="form-label">Company Display Name</label>
				<input id="account-1-company-display-name" v-model="companyProfile.companyDisplayName" type="text" class="form-control" placeholder="input company name"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-company-legal-name" class="form-label">Company Legal Name</label>
				<input id="account-1-company-legal-name" v-model="companyProfile.companyLegalName" type="text" class="form-control" placeholder="Registration no"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-company-registration-no" class="form-label">Registration No</label>
				<input id="account-1-company-registration-no" v-model="companyProfile.registrationNo" type="text" class="form-control" placeholder="Registration no"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-company-tax-number" class="form-label">Tax Number</label>
				<input id="account-1-company-tax-number" v-model="companyProfile.taxNumber" type="text" class="form-control" placeholder="Tax Number"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-registered-address-1" class="form-label">Registered Address</label>
				<input id="account-1-registered-address-1" v-model="companyProfile.addressLine1" type="text" class="form-control" placeholder="Company Address Line 1"/>
				<input id="account-1-registered-address-2" v-model="companyProfile.addressLine2" type="text" class="form-control mt-3" placeholder="Company Address Line 2"/>
				<input id="account-1-registered-address-3" v-model="companyProfile.addressLine3" type="text" class="form-control mt-3" placeholder="Company Address Line 3"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-company-description-about-company" class="form-label">Description About Company</label>
				<textarea id="account-1-company-description-about-company" v-model="companyProfile.descriptionAboutCompany" rows="6" class="form-control" placeholder="describe about the company"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-city" class="form-label">City</label>
				<input id="account-1-city" v-model="companyProfile.city" type="text" class="form-control" placeholder="City"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-state" class="form-label">State</label>
				<input id="account-1-state" v-model="companyProfile.state" type="text" class="form-control" placeholder="City"/>
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
				<input id="account-1-Phone" v-model="companyProfile.phone" type="text" class="form-control" placeholder="Phone number"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-email" class="form-label">Primary Email</label>
				<input id="account-1-email" v-model="companyProfile.primaryEmail" type="text" class="form-control" placeholder="Primary Email"/>
			</div>
			<div class="intro-y col-span-12 flex items-center justify-center sm:justify-start mt-5">
				<button class="btn btn-primary w-24" @click="submitCompanyProfile">Save</button>
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
import { appAxios, sysAxios } from "@/plugins/axios";
import Toastify from "toastify-js";
import _ from "lodash";

export default {
	setup() {
    const router = useRouter();
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
			country: null,
			phone: '',
			primaryEmail: '',
		});

		const originalCompanyProfile = ref(null);

		onMounted(async () => {
			const companyProfileSystemConfig = "configuration/v1/Company Profile";
			await sysAxios.get(companyProfileSystemConfig).then(res => {
				countries.value = JSON.parse(_.find(res.data[0].configurations, {name: "countries"}).value);
			})
			if(store.state.account.company_uuid !== "00000000-0000-0000-0000-000000000000") {
				const getCompanyInfo = `/company/v1/${store.state.account.company_uuid}`;
				const res = await appAxios.get(getCompanyInfo);
				originalCompanyProfile.value = {...res.data};
				companyProfile.value = {...res.data};
			}
		})

		const showNotification = (flg) => {
			Toastify({
				node: cash(flg ? "#success-notification-content" : "#failed-notification-content").clone().removeClass("hidden")[0],
				duration: 3000,
				newWindow: true,
				close: true,
				gravity: "top",
				position: "right",
				stopOnFocus: true
			}).showToast();
		}

		const gotoNext = () => {
			store.commit('account/SET_STEP', {step: "bank-information"});
			router.push({path: "/account/bank-information"});
		}

		const submitCompanyProfile = async () => {
			if(_.isEqual(companyProfile.value, originalCompanyProfile.value)){
				gotoNext();
			}
			else {
				const companyRegisterAPi = "/company/v1/register";
				const companyUpdateApi = `/company/v1/${store.state.account.company_uuid}`;
				if(store.state.account.company_uuid === "00000000-0000-0000-0000-000000000000") {
					appAxios.post(companyRegisterAPi, companyProfile.value).then(async (res) => {
						if(res.status === 201) {
							console.log(res.data);
							store.commit('account/SET_COMPANYID', {company_uuid: res.data});
							const combineUsertoCompany = `/company/v1/${res.data}/user`;
							await appAxios.post(combineUsertoCompany, {userId: store.state.auth.user_id, displayPicture: companyProfile.value.companyDisplayName});
							showNotification(true);
							gotoNext()				
						} else {
							showNotification(false);
						}
					})
				} else {
					appAxios.put(companyUpdateApi, companyProfile.value).then(res => {
						if(res.status === 200) {
							console.log(res.data);
							showNotification(true);
							gotoNext()
						} else {
							showNotification(false);
						}
					})
				}
			}
    }

    return {
			submitCompanyProfile,
      gotoNext,
			countries,
			companyProfile
    }
	},
}
</script>
