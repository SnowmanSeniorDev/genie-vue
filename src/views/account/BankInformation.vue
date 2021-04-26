<template>
	<div class="px-5 sm:px-20 mt-10 pt-10 border-t border-gray-200 dark:border-dark-5">
		<div class="font-medium text-base">
			Bank Information
			<button class="btn btn-outline-primary btn-sm ml-2" @click="addBank">
				<PlusIcon class="w-4 h-4 mr-1" />Add More
			</button>
		</div>
		<div class="grid grid-cols-2 mt-5">
			<div v-for="(item, index) in bankInfos" :key="index" class="grid grid-cols-1 m-4 p-4 rounded-md border-2 gap-2">
				<div class="intro-y col-span-12">
					<div class="flex justify-between">
						<label for="input-wizard-3-bank-name" class="flex self-end">Bank Name</label>
						<a class="flex items-center text-theme-6" href="javascript:;" @click="removeBank(index)">
							<Trash2Icon class="w-4 h-4 mr-1" /> Remove
						</a>
					</div>
					<select id="input-wizard-3-bank-name" v-model="item.bankName" class="form-select">
						<option v-for="(bank, bank_index) in banks" :key="bank_index">
							{{bank}}
						</option>
					</select>
				</div>
				<div class="intro-y col-span-12">
					<label for="input-wizard-3-bank-branch-name" class="">Bank Branch Name</label>
					<input id="input-wizard-3-bank-branch-name" v-model="item.branchName" type="text" class="form-control" placeholder="Bank branch name"/>
				</div>
				<div class="intro-y col-span-12">
					<label for="input-wizard-3-bank-address" class="">Bank Address</label>
					<input id="input-wizard-3-bank-address" v-model="item.address" type="text" class="form-control" placeholder="Bank address"/>
				</div>
				<div class="intro-y col-span-12">
					<label for="input-wizard-3-bank-account-number" class="">Bank Account Number</label>
					<input id="input-wizard-3-bank-account-number" v-model="item.accountNumber" type="text" class="form-control" placeholder="Bank account number"/>
				</div>
				<div class="intro-y col-span-12">
					<label for="input-wizard-3-bank-swift-code" class="">Bank Swift Code</label>
					<input id="input-wizard-3-bank-swift-code" v-model="item.swiftCode" type="text" class="form-control" placeholder="Bank swift code"/>
				</div>
				<div class="intro-y col-span-12">
					<label for="input-wizard-3-bank-name" class="">Bank Currency</label>
					<select id="input-wizard-3-bank-name" v-model="item.currency" class="form-select">
						<option v-for="(currency, currency_index) in currencies" :key="currency_index">
							{{currency}}
						</option>
					</select>
				</div>
			</div>
		</div>
		<div class="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
			<button class="btn btn-secondary w-24" @click="gotoBack">Previous</button>
			<button class="btn btn-primary w-24 ml-2" @click="submitBanks">Next</button>
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
import { sysAxios, appAxios } from "@/plugins/axios";
import Toastify from "toastify-js";
import _ from "lodash";
export default {
	setup() {
		const router = useRouter();
    const store = useStore();
		const banks = ref([]);
		const currencies = ref([]);
		const bankInfos = ref([
			{
				bankName: '',
				branchName: '',
				address: '',
				accountNumber: '',
				swiftCode: '',
				currency: '',
			},
		]);
		const originBankInfo = ref(null);

		onMounted(async () => {
			const companyProfileSystemConfig = 'configuration/v1/Company Profile';
			const getAccountBankInfo = `genie/company/v1/${store.state.account.company_uuid}/bankaccounts`;
			await sysAxios.get(companyProfileSystemConfig).then(res => {
				banks.value = JSON.parse(_.find(res.data[0].configurations, {name: "banks"}).value);
				currencies.value = JSON.parse(_.find(res.data[0].configurations, {name: "currencies"}).value)
			})
			await appAxios.get(getAccountBankInfo).then(res => {
				console.log(bankInfos.value.length)
				if(res.data.length !== 0) {
					console.log("11111")
					bankInfos.value = {...res.data};
					originBankInfo.value = {...res.data};
				}
			})
		})

		const addBank = () => {
			bankInfos.value.push({
				bankName: '',
				branchName: '',
				address: '',
				accountNumber: '',
				swiftCode: '',
				currency: '',
			})
		}

		const removeBank = (index) => {
			console.log(index)
			_.pullAt(bankInfos.value, [index])
		}

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

    const submitBanks = () => {
			// const bankAccountRegister = `genie/company/v1/${store.state.account.company_uuid}/bankaccount`;
			console.log(bankInfos.value)
			showNotification(false)
			// appAxios.post(bankAccountRegister, bankInfos.value).then(res => {
			// 	if(res.status === 200) {
			// 		Toastify({
      //     node: cash("#success-notification-content").clone().removeClass("hidden")[0],
			// 			duration: 3000,
			// 			newWindow: true,
			// 			close: true,
			// 			gravity: "top",
			// 			position: "right",
			// 			stopOnFocus: true
			// 		}).showToast();
			// 		gotoNext();
			// 	}
			// })
      
    }
    const gotoBack = () => {
      store.commit('account/SET_STEP', {step: "company-information"});
      router.go(-1);
    }
		const gotoNext = () => {
			store.commit('account/SET_STEP', {step: "currency-settings"});
			router.push({path: "/account/currency-settings"});
		}

    return {
      gotoNext,
      gotoBack,
			bankInfos,
			banks,
			currencies,
			addBank,
			removeBank,
			submitBanks
    }
	},
}
</script>
