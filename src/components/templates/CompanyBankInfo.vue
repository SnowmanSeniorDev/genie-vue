<template>
	<div class="">
		<div v-for="(item, index) in bankInfos" :key="index" class="intro-y grid grid-cols-2 gap-4 border-b border-gray-500 py-4">
			<div class="">
				<div class="flex justify-between">
					<label :for="'input-wizard-3-bank-name-' + index" class="flex self-end">Bank Name</label>
					<a class="flex items-center text-theme-6" href="javascript:;" @click="removeBank(index, item)">
						<Trash2Icon class="w-4 h-4 mr-1" /> Remove
					</a>
				</div>
				<select :id="'input-wizard-3-bank-name-' + index" v-model="bankInfos[index].bankName" class="form-select">
					<option v-for="(bank, bank_index) in banks" :key="bank_index">
						{{bank}}
					</option>
				</select>
			</div>
			<div class="">
				<label :for="'input-wizard-3-bank-branch-name-' + index" class="">Bank Branch Name</label>
				<input :id="'input-wizard-3-bank-branch-name-' + index" v-model="bankInfos[index].branchName" type="text" class="form-control" placeholder="Bank branch name"/>
			</div>
			<div class="">
				<label :for="'input-wizard-3-bank-address-' + index" class="">Bank Address</label>
				<input :id="'input-wizard-3-bank-address-' + index" v-model="bankInfos[index].address" type="text" class="form-control" placeholder="Bank address"/>
			</div>
			<div class="">
				<label :for="'input-wizard-3-bank-account-number-' + index" class="">Bank Account Number</label>
				<input :id="'input-wizard-3-bank-account-number-' + index" v-model="bankInfos[index].accountNumber" type="text" class="form-control" placeholder="Bank account number"/>
			</div>
			<div class="">
				<label :for="'input-wizard-3-bank-swift-code-' + index" class="">Bank Swift Code</label>
				<input :id="'input-wizard-3-bank-swift-code-' + index" v-model="bankInfos[index].swiftCode" type="text" class="form-control" placeholder="Bank swift code"/>
			</div>
			<div class="">
				<label :for="'input-wizard-3-bank-name-' + index" class="">Bank Currency</label>
				<select :id="'input-wizard-3-bank-name-' + index" v-model="bankInfos[index].currency" class="form-select">
					<option v-for="(currency, currency_index) in currencies" :key="currency_index">
						{{currency.currencyCode}}
					</option>
				</select>
			</div>
		</div>
		<div class="mt-4 intro-y">
			<a class="btn-sm text-primary flex hover:bg-red focus:bg-red" @click="addBank">
				<PlusCircleIcon class="w-4 h-4 mr-1" /><span class="self-center">Add More</span>
			</a>
		</div>
		<div class="intro-y col-span-12 flex items-center justify-center sm:justify-start mt-5">
			<button class="btn btn-primary w-24 ml-2" @click="submitBanks">Save</button>
		</div>
		<div id="success-notification-content" class="toastify-content hidden">
			<div class="flex">
				<CheckCircleIcon class="text-theme-9" />
				<div class="ml-4 mr-4">
					<div class="font-medium">Successfly Added Bank Info</div>
				</div>
			</div>
		</div>
		<div id="failed-notification-content" class="toastify-content hidden">
			<div class="flex">
				<XCircleIcon class="text-theme-6" />
				<div class="ml-4 mr-4">
					<div class="font-medium">Add Bank Info was failed!</div>
					<div class="text-gray-600 mt-1">Please fillin correct value of the company profile.</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { sysAxios, appAxios } from '@/plugins/axios'
import Toastify from 'toastify-js'
import _ from 'lodash'

export default {
	name: "CompanyBankInfo",
	props: {
		companyId: {
			type: String,
			required: true
		}
	},
	setup(props) {
		console.log("company id = ", props.companyId)
		const banks = ref([])
		const currencies = ref([])
		const bankInfos = ref([
			{
				bankName: '',
				branchName: '',
				address: '',
				accountNumber: '',
				swiftCode: '',
				currency: '',
			},
		])
		const deletedBank = ref([])
		const originBankInfo = ref([])
    const company_uuid = props.companyId ? props.companyId : '00000000-0000-0000-0000-000000000000'

		onMounted(async () => {
			const getBankInfo = `/company/v1/${company_uuid}/bankaccounts`
      await appAxios.get(getBankInfo).then(res => {
				if(res.data.length !== 0) bankInfos.value = [...res.data]
			})
			const companyProfileSystemConfig = 'configuration/v1/Company Profile'
			await sysAxios.get(companyProfileSystemConfig).then(res => {
				banks.value = JSON.parse(_.find(res.data[0].configurations, {name: "banks"}).value)
				currencies.value = JSON.parse(_.find(res.data[0].configurations, {name: "currencies"}).value)
			})
      if(bankInfos.value.length !== 0) {
        bankInfos.value.forEach((item) => {
          originBankInfo.value.push({...item})
        })
      }
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

		const removeBank = (index, item) => {
			if(item.bankAccountId) deletedBank.value.push(item.bankAccountId)
			_.pullAt(bankInfos.value, [index])
		}

		const showNotification = (flg) => {
			console.log(cash("#success-notification-content").clone()[0])
			Toastify({
				node: cash(flg ? "#success-notification-content" : "#failed-notification-content").clone().removeClass("hidden")[0],
				duration: 3000,
				newWindow: true,
				close: true,
				gravity: "top",
				position: "right",
				stopOnFocus: true
			}).showToast()
		}
		
		const registerBankRequest = async (banks) => {
			const registerBankApiUrl = `/company/v1/${company_uuid}/bankaccount`
			const res = await appAxios.post(registerBankApiUrl, [...banks])
			if(res.status === 201) return {result: true}
			return {result: false, response: res.data}
		}

		const updateBankRequest = async (bank) => {
			console.log(bank)
			const updateBankApiUrl = `/company/v1/${company_uuid}/bankaccount/${bank.bankAccountId}`
			delete bank['bankAccountId']
			console.log(bank)
			const res = await appAxios.put(updateBankApiUrl, bank)
			if(res.status === 200) return {result: true}
			return {result: false, response: res.data}
		}

		const deleteBankRequest = async (bankId) => {
			const deleteBankApiUrl = `/company/v1/${company_uuid}/bankaccount/${bankId}`
			const res = await appAxios.delete(deleteBankApiUrl)
			if(res.status === 200 || res.status === 204) return {result: true}
			return {result: false, response: res.data}
		}

    const submitBanks = async () => {
			showNotification(true)
			return
			if(originBankInfo.value.length === 0) {
				const status = await registerBankRequest(bankInfos.value)
				if(status.result) showNotification(true)
        else showNotification(false)
			} else {
				for (const bankId of deletedBank.value) {
					var deleteRes = await deleteBankRequest(bankId)
					if(!deleteRes.result) {
						showNotification(false)
						return
					}
				}
				
				var res = await registerBankRequest(_.filter(bankInfos.value, (item) => {if(!item.bankAccountId) return item}))
				if(!res.result) {
					showNotification(false)
					return
				}
				_.filter(bankInfos.value, async (item) => {
					if(item.bankAccountId) {
						if (JSON.stringify(_.find(originBankInfo.value, {bankAccountId: item.bankAccountId})) !== JSON.stringify(item)){
							var res = await updateBankRequest(item)
							if(!res.result) {
								showNotification(false)
								return
							}
						}
					}
				})
				showNotification(true)
			}
			
    }

		return {
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
