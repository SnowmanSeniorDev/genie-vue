<template>
	<div class="px-5 sm:px-20 mt-10 pt-10 border-t border-gray-200 dark:border-dark-5">
		<div class="font-medium text-base">Bank Information</div>
		<div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="input-wizard-3-bank-name" class="form-label">Bank Name</label>
				<select id="input-wizard-3-bank-name" class="form-select">
          <option>Please select Bank</option>
          <option>Singapore Bank</option>
          <option>HongKong Bank</option>
          <option>China Bank</option>
          <option>Japan Bank</option>
        </select>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="input-wizard-3-bank-branch-name" class="form-label">Bank Branch Name</label>
				<input id="input-wizard-3-bank-branch-name" type="text" class="form-control" placeholder="Bank branch name"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="input-wizard-3-bank-address" class="form-label">Bank Address</label>
				<input id="input-wizard-3-bank-address" type="text" class="form-control" placeholder="Bank address"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="input-wizard-3-bank-account-number" class="form-label">Bank Account Number</label>
				<input id="input-wizard-3-bank-account-number" type="text" class="form-control" placeholder="Bank account number"/>
			</div>
			<div class="intro-y col-span-12 sm:col-span-6">
				<label for="input-wizard-3-bank-swift-code" class="form-label">Bank Swift Code</label>
				<input id="input-wizard-3-bank-swift-code" type="text" class="form-control" placeholder="Bank swift code"/>
			</div>
			<div class="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
				<button class="btn btn-secondary w-24" @click="gotoBack">Previous</button>
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
		const router = useRouter();
    const store = useStore();

    const gotoNext = () => {
      store.commit('account/SET_STEP', {step: "currency-settings"});
      router.push({path: "/account/currency-settings"})
    }
    const gotoBack = () => {
      store.commit('account/SET_STEP', {step: "company-information"});
      router.go(-1)
    }

    return {
      gotoNext,
      gotoBack
    }
	},
}
</script>
