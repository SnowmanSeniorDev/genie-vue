<template>
  <div>
    <div class="container sm:px-10">
      <div class="block xl:grid grid-cols-2 gap-4">
        <!-- BEGIN: Login Info -->
        <div class="hidden xl:flex flex-col min-h-screen">
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
          <div class="my-auto mx-auto xl:ml-20 bg-white dark:bg-dark-1 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
            <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">Reset Password</h2>
            <div class="intro-x mt-2 text-gray-500 xl:hidden text-center">
              A few more clicks to sign in to your account. Manage all your
              e-commerce accounts in one place
            </div>
            <div class="intro-x mt-8">
              <input v-model="newPassword" type="password" class="intro-x login__input form-control py-3 px-4 border-gray-300 block mt-4" placeholder="New Password"/>
            </div>
            <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
              <button class="btn btn-primary py-3 px-4 w-full xl:mr-3 align-top" @click="resetPassword"> Reset Password </button>
              <div class="mt-2 text-center">
                <router-link to="/login" class="text-theme-1 text-center">Sign in instead</router-link>
              </div>
            </div>
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
    <!-- END: Login Form -->
    <div id="success-notification-update-password" class="toastify-content hidden flex">
      <CheckCircleIcon class="text-theme-9" />
      <div class="ml-4 mr-4">
        <div class="font-medium">Reset password successfuly</div>
        <div class="text-gray-600 mt-1">You can login with your new password</div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Toastify from "toastify-js";

import { sysAxios } from "@/plugins/axios";

export default {
  setup() {
    const route = useRoute();
    // const router = useRouter();
    const userId = ref('');
    const newPassword = ref('');
    console.log(route.params.checkValidity)
    onMounted(() => {
      cash("body").removeClass("main").removeClass("error-page").addClass("login");
      const api = `user/v1/resetpassword/${route.params.checkValidity}/checkvalidity`;
      sysAxios.post(api).then( res => {
        userId.value = res.data.userId
        sysAxios.defaults.headers.common['Authorization'] = "Bearer " + res.data.token;
      })
    });

    const resetPassword = () => {
      const api = `/user/v1/${userId.value}/updatesecret`;
      sysAxios.put(api, {newSecret: newPassword.value}).then(res => {
        if(res.status === 200){
          Toastify({
            node: cash("#success-notification-update-password").clone().removeClass("hidden")[0],
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
      newPassword,
      resetPassword
    }
  },
};
</script>
