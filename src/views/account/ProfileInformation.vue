<template>
	<div class="dark:border-dark-5">
		<div class="font-medium text-2xl">Profile Information</div>
		<div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="user-profile-user-name" class="form-label">Username</label>
				<input id="user-profile-user-name" v-model="userProfile.userName" type="text" class="form-control" placeholder="input company name"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="user-profile-display-name" class="form-label">Display name</label>
				<input id="user-profile-display-name" v-model="userProfile.displayName" type="text" class="form-control" placeholder="input company name"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="user-profile-first-name" class="form-label">First Name</label>
				<input id="user-profile-first-name" v-model="userProfile.firstName" type="text" class="form-control" placeholder="Registration no"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="user-profile-last-name" class="form-label">Last Name</label>
				<input id="user-profile-last-name" v-model="userProfile.lastName" type="text" class="form-control" placeholder="Tax Number"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="user-profile-email-address" class="form-label">Email</label>
				<input id="user-profile-email-address" v-model="userProfile.emailAddress" type="text" class="form-control" placeholder="Registration no"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="user-profile-phone-number" class="form-label">Phone Number</label>
				<div class="icon-input">
					<div class="icon">
						<PhoneIcon class="w-4 h-4"/>
					</div>
					<input id="user-profile-phone-number" value="+86 153 6099 8199" type="text" class="form-control" placeholder="City"/>
				</div>
			</div>
			<div class="intro-y col-span-12 flex items-center justify-center sm:justify-start mt-5">
				<button class="btn btn-primary w-24" @click="submitUserProfile">Save</button>
			</div>
			
		</div>
		<div class="bg-yellow-100 p-2 mt-4 intro-y">
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

		const submitUserProfile = async () => {
			const api = `/user/v1/${userProfile.value.userId}`
			const request = {
				"emailAddress": userProfile.value.emailAddress,
				"firstName": userProfile.value.firstName,
				"lastName": userProfile.value.lastName,
				"displayName": userProfile.value.displayName
			}
			sysAxios.put(api, request).then(res => {
				if(res.status === 200) showNotification(true)
				else showNotification(false)
			})
		}

    return {
			submitUserProfile,
      gotoNext,
			userProfile
    }
	},
}
</script>
