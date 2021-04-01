<template>
  <div>
    <DarkModeSwitcher />
    <div class="container sm:px-10">
      <div class="block xl:grid grid-cols-2 gap-4">
        <!-- BEGIN: Login Info -->
        <div class="hidden xl:flex flex-col min-h-screen">
          <a href="" class="-intro-x flex items-center pt-5">
            <img alt="Midone Tailwind HTML Admin Template" class="w-6" :src="require(`@/assets/images/logo.svg`)"/>
            <span class="text-white text-lg ml-3">Mid<span class="font-medium">One</span></span>
          </a>
          <div class="my-auto">
            <img alt="Midone Tailwind HTML Admin Template" class="-intro-x w-1/2 -mt-16" :src="require(`@/assets/images/illustration.svg`)"/>
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
          <div class="my-auto mx-auto xl:ml-20 bg-white dark:bg-dark-1 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
            <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">Forgot Password</h2>
            <div class="intro-x mt-8">
              <input v-model="emailAddress" type="email" class="intro-x login__input form-control py-3 px-4 border-gray-300 block" placeholder="type email address"/>
            </div>
            <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
              <button class="btn btn-primary py-3 px-4 w-full block align-top" @click="sendPasswordResetEmail">Send password reset email</button>
            </div>
          </div>
        </div>
        <!-- END: Login Form -->
        <div id="success-notification-sent-password-reset" class="toastify-content hidden flex">
          <CheckCircleIcon class="text-theme-9" />
            <div class="ml-4 mr-4">
              <div class="font-medium">Sent reset password successfuly</div>
              <div class="text-gray-600 mt-1">Please check your e-mail for reset password link</div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import Https from "@/plugins/axios";
import Toastify from "toastify-js";
import DarkModeSwitcher from "@/components/dark-mode-switcher/Main.vue";

export default {
  components: {
    DarkModeSwitcher,
  },
  setup() {
    const emailAddress = ref('');
    const sendPasswordResetEmail = () => {
      const api = `user/v1/${emailAddress.value}/resetpassword`;
      Https.post(api).then(res => {
        if(res.status === 200) {
          if(res.status === 201){
            Toastify({
              node: cash("#success-notification-sent-password-reset").clone().removeClass("hidden")[0],
              duration: 3000,
              newWindow: true,
              close: true,
              gravity: "top",
              position: "right",
              stopOnFocus: true
            }).showToast();
          }
        }
      })
    }
    
    return {
      emailAddress,
      sendPasswordResetEmail
    }
  },
};
</script>
