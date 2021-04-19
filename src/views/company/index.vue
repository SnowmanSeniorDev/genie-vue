<template>
  <div class="intro-y col-span-12 mt-5">
    <div class="intro-y box p-8 pt-3">
      <h2 class="text-lg font-medium mr-auto">Company Onboard</h2>
      <form class="validate-form pt-6 grid grid-cols-7 gap-4" @submit.prevent="invite">
        <div class="input-form col-span-1">
          <label for="select-role" class="form-label w-full flex flex-col sm:flex-row">
            I want to onboard
          </label>
          <select id="select-role" class="form-select">
            <option>Seller</option>
            <option>Buyer</option>
          </select>
        </div>
        <div class="input-form col-span-2">
          <label for="vender-code" class="form-label w-full flex flex-col sm:flex-row">
            Vender Code
            <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
          </label>
          <input id="vender-code" type="text" class="form-control" placeholder="Vendor Code"/>
        </div>
        <div class="input-form col-span-3">
          <label for="seller-email" class="form-label w-full flex flex-col sm:flex-row">
            Seller's Email
            <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
          </label>
          <input id="seller-email" type="text" class="form-control" placeholder="seller@email.com"/>
        </div>
        <div class="col-span-1 items-end flex">
          <button type="submit" class="btn btn-primary w-full mx-5">Invite</button>
        </div>
      </form>
    </div>

    <div class="intro-y col-span-12 mt-10">
      <table class="table table--lg border-l border-r">
        <thead>
          <tr class="bg-gray-400">
            <th class="dark:border-dark-5 whitespace-nowrap w-1/7"> ROLE </th>
            <th class="dark:border-dark-5 whitespace-nowrap w-3/7"> EMAIL </th>
            <th class="dark:border-dark-5 whitespace-nowrap w-1/7"> VENDOR CODE </th>
            <th class="dark:border-dark-5 whitespace-nowrap w-1/7"> STATUS </th>
            <th class="dark:border-dark-5 whitespace-nowrap w-1/7 text-center"> ACTIONS </th>
          </tr>
        </thead>
        <tbody>
          <tr class="odd:bg-gray-200">
            <td class="dark:border-dark-5">Seller</td>
            <td class="dark:border-dark-5">john.smith@happytech.com</td>
            <td class="dark:border-dark-5">GS-HGM8U</td>
            <td class="dark:border-dark-5">
              <div class="alert show flex items-center h-5 p-3 text-sm justify-center text-yellow-700 bg-yellow-200" role="alert">
                Pending
              </div>
            </td>
            <td class="dark:border-dark-5"></td>
          </tr>
          <tr>
            <td class="dark:border-dark-5">Seller</td>
            <td class="dark:border-dark-5">Jacksonw@mediaus.com</td>
            <td class="dark:border-dark-5">KH-Y8LK1</td>
            <td class="dark:border-dark-5">
              <div class="alert show flex items-center h-5 p-3 text-sm justify-center text-red-700 bg-red-200" role="alert">
                Expired
              </div>
            </td>
            <td class="dark:border-dark-5 flex justify-center">
              <button class="btn btn-outline-primary w-24 inline-block"> Reinvite </button>
            </td>
          </tr>
          <tr class="odd:bg-gray-200">
            <td class="dark:border-dark-5">Seller</td>
            <td class="dark:border-dark-5">Michelle.Leah@popsmedia.com</td>
            <td class="dark:border-dark-5">SG-LAJ83</td>
            <td class="dark:border-dark-5">
              <div class="alert show flex items-center h-5 p-3 text-sm justify-center text-green-700 bg-green-200" role="alert">
                Active
              </div>
            </td>
            <td class="dark:border-dark-5"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: 'CompanyOnboard',
  setup() {
    const invitePayload = ref({
      userType: '',
      venderCode: '',
      sellerEmail: ''
    });
    const invite = () => {

    }

    return {
      invitePayload,
      invite
    }
  }
}
</script>
