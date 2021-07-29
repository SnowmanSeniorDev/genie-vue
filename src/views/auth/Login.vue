<template>
  <div>
    <div class="container sm:px-10">
      <div class="block xl:grid grid-cols-2 gap-4">
        <!-- BEGIN: Login Info -->
        <div class="hidden xl:flex flex-col min-h-screen"></div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
          <div class="my-auto mx-auto xl:ml-20 bg-white dark:bg-dark-1 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
            <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">Genie Financial Portal</h2>
            <div class="intro-x mt-2 text-center">
              Welcome back! Please enter your username and password to login into your account.
            </div>
            <div class="intro-x mt-8">
              <div>
                <label>Username</label>
                <input v-model="userName" type="text" class="intro-x login__input form-control py-3 px-4 border-gray-300 block" placeholder="Enter your username"/>
              </div>
              <div class="mt-6">
                <div class="flex justify-between">
                  <label>Password</label>
                  <a @click="gotoForgotPassword" class="text-theme-1 cursor-pointer">Forgot Password?</a>
                </div>
                <input v-model="password" type="password" class="intro-x login__input form-control py-3 px-4 border-gray-300 block" placeholder="Enter your password"/>
              </div>
            </div>
            <div class="intro-x flex text-gray-700 dark:text-gray-600 text-xs sm:text-sm mt-4">
              <div class="flex items-center mr-auto">
                <input id="remember-me" type="checkbox" class="form-check-input border mr-2"/>
                <label class="cursor-pointer select-none" for="remember-me">Remember me</label>
              </div>
            </div>
            <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
              <button class="btn btn-primary w-full" :disabled='loading' @click="login({userName: userName, applicationDomain: 'genie', secret: password})">
                {{ $t('auth.login') }}
                <LoadingIcon v-if="loading" icon="oval" color="white" class="w-4 h-4 ml-2" />
              </button>
            </div>
            <div class="flex justify-center mt-4 intro-x">
              <label>New on our platform?&nbsp;</label><a @click="gotoSignUp" class="text-theme-1 cursor-pointer">Register an account</a>
            </div>
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useStore } from "vuex"
// import { useRecaptcha } from "vue-recaptcha-v3";

export default {
  setup() {
    // const { executeRecaptcha, recaptchaLoaded } = useRecaptcha();
    const store = useStore()
    const loading = ref(false)

    const recaptcha = async () => {
      // (optional) Wait until recaptcha has been loaded.
      // await recaptchaLoaded()
 
      // // Execute reCAPTCHA with action "login".
      // const token = await executeRecaptcha('login')
      // console.log(token)
      // Do stuff with the received token.
    }
 
    const login = (userName, applicationDomain, secret) => {
      loading.value = !loading.value
      store.dispatch("auth/login", userName, applicationDomain, secret)
    }
    onMounted(() => {
      cash("body")
        .removeClass("main")
        .removeClass("error-page")
        .removeClass("register")
        .addClass("login");
    });
    return {
      recaptcha,
      loading,
      login
    }
  },
  data() {
    return {
      userName: '',
      password: '',
      recaptchSiteKey: process.env.VUE_APP_RECAPTCHA_SITE_KEY
    }
  },
  methods: {
    gotoSignUp() {
      this.$router.push({path: 'register'})
    },
    gotoForgotPassword() {
      this.$router.push({path: 'forgot_password'})
    }
  }
};
</script>
