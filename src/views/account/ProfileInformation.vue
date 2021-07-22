<template>
	<div class="dark:border-dark-5">
		<div class="font-medium text-2xl">Profile Information</div>
		<div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-company-display-name" class="form-label">Username</label>
				<input id="account-1-company-display-name" v-model="userProfile.userName" type="text" class="form-control" placeholder="input company name"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-company-legal-name" class="form-label">Email</label>
				<input id="account-1-company-legal-name" v-model="userProfile.emailAddress" type="text" class="form-control" placeholder="Registration no"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-company-registration-no" class="form-label">First Name</label>
				<input id="account-1-company-registration-no" v-model="userProfile.firstName" type="text" class="form-control" placeholder="Registration no"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-company-tax-number" class="form-label">Last Name</label>
				<input id="account-1-company-tax-number" v-model="userProfile.lastName" type="text" class="form-control" placeholder="Tax Number"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-city" class="form-label">Phone Number</label>
				<div class="icon-input">
					<div class="icon">
						<PhoneIcon class="w-4 h-4"/>
					</div>
					<!-- <input id="account-1-city" v-model="userProfile.lastName" type="text" class="form-control" placeholder="City"/> -->
					<input id="account-1-city" value="+86 153 6099 8199" type="text" class="form-control" placeholder="City"/>
				</div>
			</div>
			<div class="intro-y col-span-12 flex items-center justify-center sm:justify-start mt-5">
				<button class="btn btn-primary w-24" @click="submitCompanyProfile">Save</button>
			</div>
			
		</div>
		<div class="bg-yellow-100 p-2 mt-4">
			Your email is not confirmed. Please check your inbox.&nbsp;
			<a href="" class="underline text-theme-1">Click here to resend verification email</a>
		</div>
		

		<div id="success-notification-content" class="toastify-content hidden flex">
			<CheckCircleIcon class="text-theme-9" />
			<div class="ml-4 mr-4">
				<div class="font-medium">Successfly updated your profile!</div>
			</div>
		</div>
		<div id="failed-notification-content" class="toastify-content hidden flex">
				<XCircleIcon class="text-theme-6" />
				<div class="ml-4 mr-4">
					<div class="font-medium">Update profile was failed!</div>
					<div class="text-gray-600 mt-1">Please fillin correct value of the user profile.</div>
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
		const userProfile = ref({});

		onMounted(async () => {
			const account = `user/v1/${store.state.auth.user_id}`;
			await sysAxios.get(account).then(res => {
				console.log(res)
				userProfile.value = res.data
			})
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

		// const submitCompanyProfile = async () => {
		// 	if(_.isEqual(companyProfile.value, originalCompanyProfile.value)){
		// 		gotoNext();
		// 	}
		// 	else {
		// 		const companyRegisterAPi = "/company/v1/register";
		// 		const companyUpdateApi = `/company/v1/${store.state.account.company_uuid}`;
		// 		if(store.state.account.company_uuid === "00000000-0000-0000-0000-000000000000") {
		// 			appAxios.post(companyRegisterAPi, companyProfile.value).then(async (res) => {
		// 				if(res.status === 201) {
		// 					console.log(res.data);
		// 					store.commit('account/SET_COMPANYID', {company_uuid: res.data});
		// 					const combineUsertoCompany = `/company/v1/${res.data}/user`;
		// 					await appAxios.post(combineUsertoCompany, {userId: store.state.auth.user_id, displayPicture: companyProfile.value.companyDisplayName});
		// 					showNotification(true);
		// 					gotoNext()				
		// 				} else {
		// 					showNotification(false);
		// 				}
		// 			})
		// 		} else {
		// 			appAxios.put(companyUpdateApi, companyProfile.value).then(res => {
		// 				if(res.status === 200) {
		// 					console.log(res.data);
		// 					showNotification(true);
		// 					gotoNext()
		// 				} else {
		// 					showNotification(false);
		// 				}
		// 			})
		// 		}
		// 	}
    // }

    return {
			// submitCompanyProfile,
      gotoNext,
			userProfile
    }
	},
}
</script>
