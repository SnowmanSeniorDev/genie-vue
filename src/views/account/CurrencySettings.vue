<template>
  <div class="dark:border-dark-5">
    <div class="font-medium text-2xl">Currency Information</div>
		<div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
			<div class="intro-y col-span-12">
        <table class="table table--lg">
          <thead>
            <tr class="bg-theme-2">
              <th class="dark:border-dark-5 whitespace-nowrap"> CURRENCY CODE </th>
              <th class="dark:border-dark-5 whitespace-nowrap"> CURRENCY NAME </th>
              <th class="dark:border-dark-5 whitespace-nowrap"> CURRENCY SYMBOL </th>
              <th class="dark:border-dark-5 whitespace-nowrap"> SUPPORT </th>
              <th class="dark:border-dark-5 whitespace-nowrap"> DEFAULT </th>
            </tr>
          </thead>
          <tbody>
            <tr class="odd:bg-gray-200" v-for="(currency, index) in currencies" :key="index">
              <td class="dark:border-dark-5">{{currency.currencyCode}}</td>
              <td class="dark:border-dark-5">{{currency.currencyName}}</td>
              <td class="dark:border-dark-5">{{currency.currencySymbol}}</td>
              <td class="dark:border-dark-5">
                <input id="input-wizard-4-currency-eur"
                  v-model="support"
                  type="checkbox"
                  class="form-check-input"
                  :value="currency.currencyCode" />
              </td>
              <td class="dark:border-dark-5">
                <input id="input-wizard-4-currency-eur-default"
                  v-model="defaultCurrency"
                  type="radio"
                  class="form-check-input"
                  name="default-currency"
                  :value="currency.currencyCode" />
              </td>
            </tr>
          </tbody>
        </table>
			</div>
			<div class="intro-y col-span-12 flex items-center justify-center sm:justify-start mt-5">
				<button class="btn btn-primary w-24" @click="gotoNext">Save</button>
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
import { ref, onMounted } from "vue";
import _ from "lodash";
import Toastify from "toastify-js";
import { sysAxios, appAxios } from "@/plugins/axios";


export default {
	setup() {
		const router = useRouter();
    const store = useStore();
    const currencyInfo = ref([]);
    const support = ref([]);
    const currencies = ref(null);
    const defaultCurrency = ref(null);
    const requestMethod = ref('post');

    onMounted(async () => {
			const companyProfileSystemConfig = 'configuration/v1/Company Profile';
      const getCompanyCurrencies = `/company/v1/${store.state.account.company_uuid}/currencies`;
      await sysAxios.get(companyProfileSystemConfig).then(res => {
				currencies.value = JSON.parse(_.find(res.data[0].configurations, {name: "currencies"}).value)
			})
      await appAxios.get(getCompanyCurrencies).then(res => {
        if(res.data.length) {
          requestMethod.value = 'put';
          res.data.forEach(item => {
            if(item.isDefault) defaultCurrency.value = item.currencyCode;
            support.value.push(item.currencyCode);
          });
          currencies.value = {...res.data, ...currencies.value}
        }
        
      })
    })
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
      console.log(currencyInfo.value)
			const currencyRegister = `/company/v1/${store.state.account.company_uuid}/currencies`;
			appAxios[requestMethod.value](currencyRegister, currencyInfo.value).then(res => {
        if(res.status === 201 || res.status === 200) {
					Toastify({
          node: cash("#success-notification-content").clone().removeClass("hidden")[0],
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
          node: cash("#failed-notification-content").clone().removeClass("hidden")[0],
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
      currencyInfo,
    }
	},
}
</script>
