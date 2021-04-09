<template>
	<div class="px-5 sm:px-20 mt-10 pt-10 border-t border-gray-200 dark:border-dark-5">
		<div class="font-medium text-base">Currency Settings</div>
		<div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
			<div class="intro-y col-span-12">
        <table class="table table--lg border-l border-r">
          <thead>
            <tr class="bg-gray-400">
              <th class="dark:border-dark-5 whitespace-nowrap"> CURRENCY CODE </th>
              <th class="dark:border-dark-5 whitespace-nowrap"> CURRENCY NAME </th>
              <th class="dark:border-dark-5 whitespace-nowrap"> CURRENCY SYMBOL </th>
              <th class="dark:border-dark-5 whitespace-nowrap"> SUPPORT </th>
              <th class="dark:border-dark-5 whitespace-nowrap"> DEFAULT </th>
            </tr>
          </thead>
          <tbody>
            <tr class="odd:bg-gray-200">
              <td class="dark:border-dark-5">EUR</td>
              <td class="dark:border-dark-5">Euro</td>
              <td class="dark:border-dark-5">EUR</td>
              <td class="dark:border-dark-5"><input id="input-wizard-4-currency-eur" class="form-check-input" type="checkbox" value=""></td>
              <td class="dark:border-dark-5"><input id="input-wizard-4-currency-eur-default" class="form-check-input" type="radio" name="default-currency" value="eur"></td>
            </tr>
            <tr>
              <td class="dark:border-dark-5">MYR</td>
              <td class="dark:border-dark-5">Riggit Malaysia</td>
              <td class="dark:border-dark-5">MYR</td>
              <td class="dark:border-dark-5"><input id="input-wizard-4-currency-myr" class="form-check-input" type="checkbox" value=""></td>
              <td class="dark:border-dark-5"><input id="input-wizard-4-currency-myr-default" class="form-check-input" type="radio" name="default-currency" value="mry"></td>
            </tr>
            <tr class="odd:bg-gray-200">
              <td class="dark:border-dark-5">RM</td>
              <td class="dark:border-dark-5">Riggit Malaysia</td>
              <td class="dark:border-dark-5">RM</td>
              <td class="dark:border-dark-5"><input id="input-wizard-4-currency-eur" class="form-check-input" type="checkbox" value=""></td>
              <td class="dark:border-dark-5"><input id="input-wizard-4-currency-eur-default" class="form-check-input" type="radio" name="default-currency" value="rm"></td>
            </tr>
            <tr>
              <td class="dark:border-dark-5">SGD</td>
              <td class="dark:border-dark-5">Singapore Dollar</td>
              <td class="dark:border-dark-5">SGD</td>
              <td class="dark:border-dark-5"><input id="input-wizard-4-currency-eur" class="form-check-input" type="checkbox" value=""></td>
              <td class="dark:border-dark-5"><input id="input-wizard-4-currency-eur-default" class="form-check-input" type="radio" name="default-currency" value="sgd"></td>
            </tr>
            <tr class="odd:bg-gray-200">
              <td class="dark:border-dark-5">USD</td>
              <td class="dark:border-dark-5">United State Dollar</td>
              <td class="dark:border-dark-5">USD</td>
              <td class="dark:border-dark-5"><input id="input-wizard-4-currency-eur" class="form-check-input" type="checkbox" value=""></td>
              <td class="dark:border-dark-5"><input id="input-wizard-4-currency-eur-default" class="form-check-input" type="radio" name="default-currency" value="usd"></td>
            </tr>
          </tbody>
        </table>
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
    
    const gotoBack = () => {
      store.commit('account/SET_STEP', {step: "bank-information"});
      router.go(-1)
    }
    const gotoNext = () => {
      store.commit('account/SET_STEP', {step: "kyc"});
      router.push({path: "/account/kyc"})
    }
    return {
      gotoBack,
      gotoNext
    }
	},
}
</script>
