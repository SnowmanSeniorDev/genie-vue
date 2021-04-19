<template>
	<div class="px-5 sm:px-20 mt-10 pt-10 border-t border-gray-200 dark:border-dark-5">
		<div class="font-medium text-base">Bank Information</div>
		<div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="input-wizard-3-bank-name" class="form-label">Bank Name</label>
				<select id="input-wizard-3-bank-name" v-model="bankInfo.bankName" class="form-select">
					<option v-for="(bank, index) in banks" :key="index">
						{{bank}}
					</option>
        </select>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="input-wizard-3-bank-branch-name" class="form-label">Bank Branch Name</label>
				<input id="input-wizard-3-bank-branch-name" type="text" v-model="bankInfo.branchName" class="form-control" placeholder="Bank branch name"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="input-wizard-3-bank-address" class="form-label">Bank Address</label>
				<input id="input-wizard-3-bank-address" type="text" v-model="bankInfo.address" class="form-control" placeholder="Bank address"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="input-wizard-3-bank-account-number" class="form-label">Bank Account Number</label>
				<input id="input-wizard-3-bank-account-number" type="text" v-model="bankInfo.accountNumber" class="form-control" placeholder="Bank account number"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="input-wizard-3-bank-swift-code" class="form-label">Bank Swift Code</label>
				<input id="input-wizard-3-bank-swift-code" type="text" v-model="bankInfo.swiftCode" class="form-control" placeholder="Bank swift code"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="input-wizard-3-bank-name" class="form-label">Bank Currency</label>
				<select id="input-wizard-3-bank-name" v-model="bankInfo.currency" class="form-select">
					<option v-for="(currency, index) in currencies" :key="index">
						{{currency}}
					</option>
        </select>
			</div>
			<div class="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
				<button class="btn btn-secondary w-24" @click="gotoBack">Previous</button>
				<button class="btn btn-primary w-24 ml-2" @click="gotoNext">Next</button>
			</div>
		</div>
		<div id="success-notification-content" class="toastify-content hidden flex">
			<CheckCircleIcon class="text-theme-9" />
			<div class="ml-4 mr-4">
				<div class="font-medium">Successfly Added Bank Info</div>
			</div>
		</div>
		<div id="failed-notification-content" class="toastify-content hidden flex">
				<XCircleIcon class="text-theme-6" />
				<div class="ml-4 mr-4">
					<div class="font-medium">Add Bank Info was failed!</div>
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
import Toastify from "toastify-js";
import _ from "lodash";
export default {
	setup() {
		const router = useRouter();
    const store = useStore();
		const banks = ref([]);
		const currencies = ref([]);
		const bankInfo = ref({
			bankName: '',
			branchName: '',
			address: '',
			accountNumber: '',
			swiftCode: '',
			currency: '',
		})
		onMounted(() => {
			const companyProfileSystemConfig = 'configuration/v1/Company Profile';
			https.get(companyProfileSystemConfig).then(res => {
				banks.value = JSON.parse(_.find(res.data[0].configurations, {name: "banks"}).value);
				currencies.value = JSON.parse(_.find(res.data[0].configurations, {name: "currencies"}).value)
			})
		})
    const gotoNext = () => {
			const bankAccountRegister = "genie/company/v1/${company_uuid}/bankaccount";
			https.post(bankAccountRegister, bankInfo.value).then(res => {
				if(res.status === 200) {
					Toastify({
          node: cash("#failed-notification-content").clone().removeClass("hidden")[0],
						duration: 3000,
						newWindow: true,
						close: true,
						gravity: "top",
						position: "right",
						stopOnFocus: true
					}).showToast();
					store.commit('account/SET_STEP', {step: "currency-settings"}); 
					router.push({path: "/account/currency-settings"})
				}
			})
      
    }
    const gotoBack = () => {
      store.commit('account/SET_STEP', {step: "company-information"});
      router.go(-1)
    }

    return {
      gotoNext,
      gotoBack,
			bankInfo,
			banks,
			currencies
    }
	},
}
</script>
