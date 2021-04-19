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
              <td class="dark:border-dark-5">
                <input id="input-wizard-4-currency-eur"
                  v-model="support"
                  type="checkbox"
                  class="form-check-input"
                  value="EUR" />
              </td>
              <td class="dark:border-dark-5">
                <input id="input-wizard-4-currency-eur-default"
                  v-model="defaultCurrency"
                  type="radio"
                  class="form-check-input"
                  name="default-currency"
                  value="EUR" />
              </td>
            </tr>
            <tr>
              <td class="dark:border-dark-5">MYR</td>
              <td class="dark:border-dark-5">Riggit Malaysia</td>
              <td class="dark:border-dark-5">MYR</td>
              <td class="dark:border-dark-5">
                <input id="input-wizard-4-currency-myr"
                  v-model="support"
                  type="checkbox"
                  class="form-check-input"
                  value="MYR" />
              </td>
              <td class="dark:border-dark-5">
                <input id="input-wizard-4-currency-myr-default"
                  v-model="defaultCurrency"
                  type="radio"
                  class="form-check-input"
                  name="default-currency"
                  value="MYR" />
              </td>
            </tr>
            <tr class="odd:bg-gray-200">
              <td class="dark:border-dark-5">RM</td>
              <td class="dark:border-dark-5">Riggit Malaysia</td>
              <td class="dark:border-dark-5">RM</td>
              <td class="dark:border-dark-5">
                <input id="input-wizard-4-currency-eur"
                  v-model="support"
                  type="checkbox"
                  class="form-check-input"
                  value="RM" />
              </td>
              <td class="dark:border-dark-5">
                <input id="input-wizard-4-currency-eur-default"
                  v-model="defaultCurrency"
                  type="radio"
                  class="form-check-input"
                  name="default-currency"
                  value="RM" />
              </td>
            </tr>
            <tr>
              <td class="dark:border-dark-5">SGD</td>
              <td class="dark:border-dark-5">Singapore Dollar</td>
              <td class="dark:border-dark-5">SGD</td>
              <td class="dark:border-dark-5">
                <input id="input-wizard-4-currency-eur"
                  v-model="support"
                  type="checkbox"
                  class="form-check-input"
                  value="SGD" />
              </td>
              <td class="dark:border-dark-5">
                <input id="input-wizard-4-currency-eur-default"
                  v-model="defaultCurrency"
                  type="radio"
                  class="form-check-input"
                  name="default-currency"
                  value="SGD" />
              </td>
            </tr>
            <tr class="odd:bg-gray-200">
              <td class="dark:border-dark-5">USD</td>
              <td class="dark:border-dark-5">United State Dollar</td>
              <td class="dark:border-dark-5">USD</td>
              <td class="dark:border-dark-5">
                <input id="input-wizard-4-currency-eur"
                  v-model="support"
                  type="checkbox"
                  class="form-check-input"
                  value="USD" />
              </td>
              <td class="dark:border-dark-5">
                <input id="input-wizard-4-currency-eur-default"
                 v-model="defaultCurrency"
                 type="radio"
                 class="form-check-input"
                 name="default-currency"
                 value="USD" />
              </td>
            </tr>
          </tbody>
        </table>
			</div>
			<div class="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
				<button class="btn btn-secondary w-24" @click="gotoBack">Previous</button>
				<button class="btn btn-primary w-24 ml-2" @click="gotoNext">Next</button>
			</div>
		</div>
    <div id="success-notification-content" class="toastify-content hidden flex">
			<CheckCircleIcon class="text-theme-9" />
			<div class="ml-4 mr-4">
				<div class="font-medium">Successfly Set Currencies!</div>
			</div>
		</div>
		<div id="failed-notification-content" class="toastify-content hidden flex">
				<XCircleIcon class="text-theme-6" />
				<div class="ml-4 mr-4">
					<div class="font-medium">Setting Currencies was failed!</div>
					<div class="text-gray-600 mt-1">Please fillin correct value of the company profile.</div>
				</div>
		</div>
	</div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ref } from "vue";
import _ from "lodash";
import Toastify from "toastify-js";
import axios from "axios";

export default {
	setup() {
		const router = useRouter();
    const store = useStore();
    const currencyInfo = ref([]);
    const support = ref([]);
    const currencies = ref([
      {
        currencyCode: 'EUR',
        currencyName: 'Euro',
        currencySymbol: 'E$',
        isDefault: false
      }, {
        currencyCode: 'MYR',
        currencyName: 'Riggit Malaysia',
        currencySymbol: 'm$',
        isDefault: false
      }, {
        currencyCode: 'RM',
        currencyName: 'Riggit Malaysia',
        currencySymbol: 'r$',
        isDefault: false
      }, {
        currencyCode: 'SGD',
        currencyName: 'Singapore Dollar',
        currencySymbol: 'S$',
        isDefault: false
      }, {
        currencyCode: 'USD',
        currencyName: 'United State Dollar',
        currencySymbol: '$',
        isDefault: false
      }
    ]);
    const defaultCurrency = ref(null);

    const gotoBack = () => {
      store.commit('account/SET_STEP', {step: "bank-information"});
      router.go(-1)
    }
    const gotoNext = () => {
      currencyInfo.value = _.filter(currencies.value, (currency) => {
        if(currency.currencyCode === defaultCurrency.value) currency.isDefault = true;
        else currency.isDefault = false;
        return support.value.includes(currency.currencyCode);
      })
			const currencyRegister = "https://companies.bsg-api.tk/api/genie/company/v1/register";
			axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('id_token')}`;
			axios.post(currencyRegister, currencyInfo.value).then(res => {
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
          store.commit('account/SET_STEP', {step: "kyc"});
          router.push({path: "/account/kyc"})
        } else {
          Toastify({
          node: cash("#success-notification-content").clone().removeClass("hidden")[0],
						duration: 3000,
						newWindow: true,
						close: true,
						gravity: "top",
						position: "right",
						stopOnFocus: true
					}).showToast();
        }
      })
    }
    return {
      gotoBack,
      gotoNext,
      currencies,
      support,
      defaultCurrency,
      currencyInfo
    }
	},
}
</script>
