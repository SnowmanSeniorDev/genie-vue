<template>
  <div class="flex items-center h-full">
    <div class="flex grid grid-cols-6 gap-4 w-full">
      <!-- BEGIN: Register Form -->
      <div></div>
      <div class="box intro-x col-span-4 self-center px-8 py-12">
        <img class="" :src="require(`@/assets/images/logo.svg`)"/>
        <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left pt-4">Genie Financial Portal</h2>
        <div class="intro-x mt-2 dark:text-gray-500">
          New account registration
        </div>
        <div class="intro-x mt-8 grid grid-cols-2 gap-4">
          <div>
            <label>First Name</label>
            <input type="text" v-model="formData.firstName" class="intro-x login__input form-control py-3 px-4 border-gray-300 block" placeholder="First Name"/>
          </div>
          <div>
            <label>Last Name</label>
            <input type="text" v-model="formData.lastName" class="intro-x login__input form-control py-3 px-4 border-gray-300 block" placeholder="Last Name"/>
          </div>
          <div>
            <label>Username</label>
            <input type="text" v-model="formData.userName" class="intro-x login__input form-control py-3 px-4 border-gray-300 block" placeholder="Username"/>
          </div>
          <div>
            <label>Work Email</label>
            <input type="text" v-model="formData.emailAddress" class="intro-x login__input form-control py-3 px-4 border-gray-300 block" placeholder="Work Email"/>
          </div>
          <div>
            <label>Display Name</label>
            <input type="text" v-model="formData.displayName" class="intro-x login__input form-control py-3 px-4 border-gray-300 block" placeholder="Display Name"/>
          </div>
          <div>
            <label>Password</label>
            <input type="password" v-model="formData.secret" class="intro-x login__input form-control py-3 px-4 border-gray-300 block" placeholder="Password"/>
          </div>
          <div>
            <label>Confirm Password</label>
            <input type="password" class="intro-x login__input form-control py-3 px-4 border-gray-300 block mt-4" placeholder="Password Confirmation"/>
          </div>
        </div>
        <div class="flex justify-center">
          <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left w-1/2">
            <button class="btn btn-primary py-3 px-4 w-full xl:mr-3 align-top" @click="submit">Sign Up</button>
            <div class="intro-x flex justify-center text-gray-700 dark:text-gray-600 mt-4 text-xs sm:text-sm">
              <label class="cursor-pointer select-none" for="remember-me">Already have an account? </label>
              <a class="text-theme-1 dark:text-theme-10 ml-1" href="javascript:;" @click="gotoSignIn">Sign in instead</a>
            </div>
          </div>
        </div>
      </div>
      <div></div>
      <!-- END: Register Form -->
    </div>
  </div>
</template>

<script>
import { reactive, onMounted } from "vue";
import {useRouter} from "vue-router"
import {sysAxios, appAxios} from "@/plugins/axios"

export default {
  setup() {
    const router = useRouter()
    const formData = reactive({
      userName: null,
      secret: null,
      emailAddress: null,
      firstName: null,
      lastName: null,
      displayName: null,
      applicationDomain: 'genie'
    });

    const submit = () => {
      appAxios.post("/company/v1/user", formData).then(res => {
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
        .removeClass("login")
        .addClass("register")
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
