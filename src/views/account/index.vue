<template>
  <div>
    <div class="flex items-center mt-8">
      <h2 class="intro-y text-lg font-medium mr-auto">Account Settings</h2>
    </div>
    <!-- BEGIN: Wizard Layout -->
    <div class="intro-y box sm:py-10 mt-5 flex divide-x divide-gray-500">
			<div class="w-1/4 px-10 py-12">
				<div class="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10 pt-4">
          <button
						:class="step === `profile-information` ? `w-full h-12 btn bg-theme-2` : `w-full h-12 btn dark:bg-dark-1`"
						@click="gotoProfileInformation"
					>
						<UserIcon class="w-6 h-6 pr-2"/>
						Profile Information
					</button>
        </div>
        <div class="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10 pt-4">
          <button
						:class="step === `company-information` ? `w-full h-12 btn bg-theme-2` : `w-full h-12 btn dark:bg-dark-1`"
						@click="gotoCompanyInformation"
					>
						<HomeIcon class="w-6 h-6 pr-2"/>
						Company Information
					</button>
        </div>
        <div class="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10 pt-4">
					<button 
						:class="step === `bank-information` ? `w-full h-12 btn bg-theme-2` : `w-full h-12 btn dark:bg-dark-1`"
						@click="gotoBankInformation"
					>
						<ApertureIcon class="w-6 h-6 pr-2"/>
            Bank Information
					</button>
        </div>
        <div class="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10 pt-4">
					<button 
						:class="step === `currency-settings` ? `w-full h-12 btn bg-theme-2 btn-outline` : `outline-none w-full h-12 btn dark:bg-dark-1`"
						@click="gotoCurrencySettings"
					>
						<DollarSignIcon class="w-6 h-6 pr-2"/>
            Currency Settings
					</button>
        </div>
        <div class="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10 pt-4">
					<button 
						:class="step === `kyc` ? `w-full h-12 btn bg-theme-2` : `w-full h-12 btn dark:bg-dark-1`"
						@click="gotoKyc"
					>
						<PaperclipIcon class="w-6 h-6 pr-2"/>
            KYC Documents
					</button>
        </div>
			</div>
			<div class="w-3/4 px-10">
				<router-view></router-view>
			</div>
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
			const companyIdApi = `/company/v1/user/${store.state.auth.user_id}`;
			await appAxios.get(companyIdApi).then(res => {
				store.commit('account/SET_COMPANYID', {company_uuid: res.data});
			})
		})
		const gotoProfileInformation = () => {
			store.commit('account/SET_STEP', {step: "profile-information"});
			router.push({path: "/account/profile-information"});
		}
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
			gotoProfileInformation,
			gotoCompanyInformation,
			gotoBankInformation,
			gotoCurrencySettings,
      gotoKyc
		}
	},
}
</script>
