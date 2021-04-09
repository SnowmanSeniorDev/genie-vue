<template>
	<div class="px-5 sm:px-20 mt-10 pt-10 border-t border-gray-200 dark:border-dark-5">
		<div class="font-medium text-base">Company Information</div>
		<div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-company-display-name" class="form-label">Company Display Name</label>
				<input id="account-1-company-display-name" type="text" class="form-control" placeholder="input company name"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-company-legal-name" class="form-label">Company Legal Name</label>
				<input id="account-1-company-legal-name" type="text" class="form-control" placeholder="Registration no"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-company-registration-no" class="form-label">Registration No</label>
				<input id="account-1-company-registration-no" type="text" class="form-control" placeholder="Registration no"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-company-tax-number" class="form-label">Tax Number</label>
				<input id="account-1-company-tax-number" type="text" class="form-control" placeholder="Tax Number"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-registered-address-1" class="form-label">Registered Address</label>
				<input id="account-1-registered-address-1" type="text" class="form-control" placeholder="Company Address Line 1"/>
				<input id="account-1-registered-address-2" type="text" class="form-control mt-3" placeholder="Company Address Line 2"/>
				<input id="account-1-registered-address-3" type="text" class="form-control mt-3" placeholder="Company Address Line 3"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-company-description-about-company" class="form-label">Description About Company</label>
				<textarea id="account-1-company-description-about-company" rows="6" class="form-control" placeholder="describe about the company"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-city" class="form-label">City</label>
				<input id="account-1-city" type="text" class="form-control" placeholder="City"/>
			</div>
      <div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-country" class="form-label">Country</label>
        <select id="account-1-country" class="form-select">
          <option>Please select Country</option>
          <option>Singapore</option>
          <option>HongKong</option>
          <option>China</option>
          <option>Japan</option>
        </select>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-phone" class="form-label">Phone</label>
				<input id="account-1-Phone" type="text" class="form-control" placeholder="Phone number"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="account-1-email" class="form-label">Primary Email</label>
				<input id="account-1-email" type="text" class="form-control" placeholder="Primary Email"/>
			</div>
			<div class="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
				<button class="btn btn-primary w-24 ml-2" @click="gotoNext">Next</button>
			</div>
		</div>
	</div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
	setup() {
    const router = useRouter()
    const store = useStore();
    const gotoNext = () => {
      store.commit('account/SET_STEP', {step: "bank-information"});
      router.push({path: "/account/bank-information"})
    }
    return {
      gotoNext,
    }
	},
}
</script>
