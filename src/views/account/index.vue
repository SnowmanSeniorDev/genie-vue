<template>
  <div>
    <div class="flex items-center mt-8">
      <h2 class="intro-y text-lg font-medium mr-auto">Account Settings</h2>
    </div>
    <!-- BEGIN: Wizard Layout -->
    <div class="intro-y box sm:py-20 mt-5">
      <div class="wizard flex flex-col lg:flex-row justify-center px-5 sm:px-20">
        <div class="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
          <button
						:class="step === `company-information` ? `w-12 h-12 rounded-full btn btn-primary` : `w-12 h-12 rounded-full btn text-gray-600 bg-gray-200 dark:bg-dark-1`"
						@click="gotoCompanyInformation"
					>
						<HomeIcon class="w-8 h-8"/>
					</button>
          <div :class="step === `company-information` ? `font-medium text-base lg:mt-3 ml-3 lg:mx-auto` : `text-base lg:mt-3 ml-3 lg:mx-auto text-gray-700 dark:text-gray-600`">
            Company Information
          </div>
        </div>
        <div class="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
					<button 
						:class="step === `bank-information` ? `w-12 h-12 rounded-full btn btn-primary` : `w-12 h-12 rounded-full btn text-gray-600 bg-gray-200 dark:bg-dark-1`"
						@click="gotoBankInformation"
					>
						<ApertureIcon class="w-8 h-8"/>
					</button>
					<div :class="step === `bank-information` ? `font-medium text-base lg:mt-3 ml-3 lg:mx-auto` : `text-base lg:mt-3 ml-3 lg:mx-auto text-gray-700 dark:text-gray-600`">
            Bank Information
          </div>
        </div>
        <div class="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
					<button 
						:class="step === `currency-settings` ? `w-12 h-12 rounded-full btn btn-primary` : `w-12 h-12 rounded-full btn text-gray-600 bg-gray-200 dark:bg-dark-1`"
						@click="gotoCurrencySettings"
					>
						<DollarSignIcon class="w-8 h-8"/>
					</button>
					<div :class="step === `currency-settings` ? `font-medium text-base lg:mt-3 ml-3 lg:mx-auto` : `text-base lg:mt-3 ml-3 lg:mx-auto text-gray-700 dark:text-gray-600`">
            Currency Settings
          </div>
        </div>
        <div class="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
					<button 
						:class="step === `kyc` ? `w-12 h-12 rounded-full btn btn-primary` : `w-12 h-12 rounded-full btn text-gray-600 bg-gray-200 dark:bg-dark-1`"
						@click="gotoKyc"
					>
						<PaperclipIcon class="w-8 h-8"/>
					</button>
					<div :class="step === `currency-settings` ? `font-medium text-base lg:mt-3 ml-3 lg:mx-auto` : `text-base lg:mt-3 ml-3 lg:mx-auto text-gray-700 dark:text-gray-600`">
            KYC Documents
          </div>
        </div>
        <div class="wizard__line hidden lg:block w-2/3 bg-gray-200 dark:bg-dark-1 absolute mt-5"></div>
      </div>
			<router-view></router-view>
    </div>
    <!-- END: Wizard Layout -->
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { appAxios } from "@/plugins/axios";

export default {
	setup() {
		const store = useStore();
		const router = useRouter();
		const step = computed(() => store.getters['account/getStep']);

		onMounted(async () => {
			const companyIdApi = `genie/company/v1/user/${store.state.auth.user_id}`;
			await appAxios.get(companyIdApi).then(res => {
				store.commit('account/SET_COMPANYID', {company_uuid: res.data});
			})
		})

		const gotoCompanyInformation = () => {
			store.commit('account/SET_STEP', {step: "company-information"});
			router.push({path: "/account/"});
		}
		const gotoBankInformation = () => {
			store.commit('account/SET_STEP', {step: "bank-information"});
			router.push({path: "/account/bank-information"});
		}
		const gotoCurrencySettings = () => {
			store.commit('account/SET_STEP', {step: "currency-settings"});
			router.push({path: "/account/currency-settings"});
		}
    const gotoKyc = () => {
			store.commit('account/SET_STEP', {step: "kyc"});
			router.push({path: "/account/kyc"});
		}
    
		return {
			step,
			gotoCompanyInformation,
			gotoBankInformation,
			gotoCurrencySettings,
      gotoKyc
		}
	},
}
</script>
