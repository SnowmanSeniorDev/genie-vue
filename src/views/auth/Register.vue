<template>
  <div>
    <DarkModeSwitcher />
    <div class="container sm:px-10">
      <div class="block xl:grid grid-cols-2 gap-4">
        <!-- BEGIN: Register Info -->
        <div class="hidden xl:flex flex-col min-h-screen">
          <a href="" class="-intro-x flex items-center pt-5">
            <img alt="Midone Tailwind HTML Admin Template" class="w-6" :src="require(`@/assets/images/logo.svg`)"/>
            <span class="text-white text-lg ml-3">Genie</span>
          </a>
          <div class="my-auto">
            <img alt="Midone Tailwind HTML Admin Template" class="-intro-x w-1/2 -mt-16" :src="require(`@/assets/images/illustration.svg`)"/>
            <div class="-intro-x text-white font-medium text-4xl leading-tight mt-10">
              Genie Financial Portal<br />
            </div>
            <div class="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-gray-500">
              New account registration.
            </div>
          </div>
        </div>
        <!-- END: Register Info -->
        <!-- BEGIN: Register Form -->
        <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
          <div class="my-auto mx-auto xl:ml-20 bg-white dark:bg-dark-1 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
            <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">Sign Up</h2>
            <div class="intro-x mt-2 text-gray-500 dark:text-gray-500 xl:hidden text-center">
              Genie Financial Portal <br />
              New account registration.
            </div>
            <div class="intro-x mt-8">
              <input type="text" v-model="formData.firstName" class="intro-x login__input form-control py-3 px-4 border-gray-300 block" placeholder="First Name"/>
              <input type="text" v-model="formData.lastName" class="intro-x login__input form-control py-3 px-4 border-gray-300 block mt-4" placeholder="Last Name"/>
              <input type="text" v-model="formData.userName" class="intro-x login__input form-control py-3 px-4 border-gray-300 block mt-4" placeholder="Username"/>
              <input type="text" v-model="formData.emailAddress" class="intro-x login__input form-control py-3 px-4 border-gray-300 block mt-4" placeholder="Work Email"/>
              <input type="text" v-model="formData.displayName" class="intro-x login__input form-control py-3 px-4 border-gray-300 block mt-4" placeholder="Display Name"/>
              <input type="password" v-model="formData.password" class="intro-x login__input form-control py-3 px-4 border-gray-300 block mt-4" placeholder="Password"/>
              <div class="intro-x w-full grid grid-cols-12 gap-4 h-1 mt-3">
                <div class="col-span-3 h-full rounded bg-theme-9"></div>
                <div class="col-span-3 h-full rounded bg-theme-9"></div>
                <div class="col-span-3 h-full rounded bg-theme-9"></div>
                <div class="col-span-3 h-full rounded bg-gray-200 dark:bg-dark-2"></div>
              </div>
              <a href="" class="intro-x text-gray-600 block mt-2 text-xs sm:text-sm">What is a secure password?</a>
              <input type="password" class="intro-x login__input form-control py-3 px-4 border-gray-300 block mt-4" placeholder="Password Confirmation"/>
            </div>
            <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
              <button class="btn btn-primary py-3 px-4 w-full xl:mr-3 align-top" @click="submit"> Register</button>
              <div class="intro-x flex justify-center text-gray-700 dark:text-gray-600 mt-4 text-xs sm:text-sm">
                <label class="cursor-pointer select-none" for="remember-me">Already have an account? </label>
                <a class="text-theme-1 dark:text-theme-10 ml-1" href="javascript:;" @click="gotoSignIn">Sign in instead</a>
              </div>
            </div>
          </div>
        </div>
        <!-- END: Register Form -->
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted } from "vue";
import DarkModeSwitcher from "@/components/dark-mode-switcher/Main.vue";
import {useRouter} from "vue-router"
import {sysAxios} from "@/plugins/axios"

export default {
  components: {
    DarkModeSwitcher
  },
  setup() {
    const router = useRouter()
    const formData = reactive({
      userName: null,
      secret: null,
      emailAddress: null,
      firstName: null,
      lastName: null,
      displayName: null,
      applicationDomain: null
    });

    const submit = () => {
      sysAxios.post("api/user/v1").then(res => {
        if(res.status === 201) gotoSignIn()
      })
    }

    const gotoSignIn = () => {
      router.push({path: "login"})
    }

    onMounted(() => {
      cash("body")
        .removeClass("main")
        .removeClass("error-page")
        .addClass("login");
    });
    return {
      formData,
      gotoSignIn,
      submit
    }
  },
  methods: {
    
  }
};
</script>
