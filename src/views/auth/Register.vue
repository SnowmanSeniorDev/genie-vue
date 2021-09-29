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
            <input
              type="text"
              v-model="formData.firstName"
              name="firstName"
              class="intro-x form-control py-3 px-4 border-gray-300 block"
              placeholder="First Name"/>
            <template v-if="$v.firstName.$error">
              <div v-for="(error, index) in $v.firstName.$errors" :key="index" class="text-theme-6 mt-2">
                {{ error.$message }}
              </div>
            </template>
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              v-model="formData.lastName"
              class="intro-x form-control py-3 px-4 border-gray-300 block"
              placeholder="Last Name"/>
            <template v-if="$v.lastName.$error">
              <div v-for="(error, index) in $v.lastName.$errors" :key="index" class="text-theme-6 mt-2">
                {{ error.$message }}
              </div>
            </template>
          </div>
          <div>
            <label>Username</label>
            <input
              type="text"
              v-model="formData.userName"
              class="intro-x form-control py-3 px-4 border-gray-300 block"
              placeholder="Username"/>
            <template v-if="$v.userName.$error">
              <div v-for="(error, index) in $v.userName.$errors" :key="index" class="text-theme-6 mt-2">
                {{ error.$message }}
              </div>
            </template>
          </div>
          <div>
            <label>Work Email</label>
            <input
              type="text"
              v-model="formData.emailAddress"
              class="intro-x form-control py-3 px-4 border-gray-300 block"
              placeholder="Work Email"/>
            <template v-if="$v.emailAddress.$error">
              <div v-for="(error, index) in $v.emailAddress.$errors" :key="index" class="text-theme-6 mt-2">
                {{ error.$message }}
              </div>
            </template>
          </div>
          <div class="col-span-2">
            <label>Display Name</label>
            <input
              type="text"
              v-model="formData.displayName"
              class="intro-x form-control py-3 px-4 border-gray-300 block"
              placeholder="Display Name"/>
            <template v-if="$v.displayName.$error">
              <div v-for="(error, index) in $v.displayName.$errors" :key="index" class="text-theme-6 mt-2">
                {{ error.$message }}
              </div>
            </template>
          </div>
          <password-strength v-model="formData.secret"/>
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              v-model="formData.confirmSecret"
              class="intro-x form-control py-3 px-4 border-gray-300 block"
              placeholder="Password Confirmation"/>
            <template v-if="$v.confirmSecret.$error">
              <div v-for="(error, index) in $v.confirmSecret.$errors" :key="index" class="text-theme-6 mt-2">
                {{ error.$message }}
              </div>
            </template>
          </div>
        </div>
        <div class="flex justify-center">
          <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left w-1/2">
            <button class="btn btn-primary py-3 px-4 w-full xl:mr-3 align-top" @click="submit" :disabled='loading'>
              Sign Up
              <LoadingIcon v-if="loading" icon="oval" color="white" class="w-4 h-4 ml-2" />
            </button>
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
import { reactive, onMounted, ref, computed } from "vue";
import {useRouter} from "vue-router"
import {appAxios} from "@/plugins/axios"
import { useStore } from "vuex"
import passwordStrength from "@/components/password-strength/Main.vue"
import { required, minLength, email, sameAs, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

export default {
  components: {passwordStrength},
  setup() {
    const store = useStore()
    const router = useRouter()
    const formData = reactive({
      userName: null,
      secret: '123',
      confirmSecret: '',
      emailAddress: null,
      firstName: null,
      lastName: null,
      displayName: null,
      applicationDomain: 'genie'
    });
    const rules = computed(() => {
      return {
        userName: { required },
        emailAddress: { required, email },
        firstName: { required },
        lastName: { required },
        displayName: { required, minLength: minLength(5) },
        secret: { required, minLength: minLength(6) },
        confirmSecret: { 
          required,
          sameAsSecret: helpers.withMessage(() => 'Confirm Password must be matched', sameAs(formData.secret)) 
        }
      }
    })
    const loading = ref(false)
    const $v = useVuelidate(rules, formData);
    const submit = () => {
      loading.value = true
      $v.value.$touch();
      if ($v.value.$invalid) {
        loading.value = false
      } else {
        console.log('else calse = ', $v.value.$invalid)
        appAxios.post("/company/v1/user", formData).then(async res => { 
          if(res.status === 201){
            await store.dispatch("auth/login", {userName: formData.userName, applicationDomain: formData.applicationDomain, secret: formData.secret})
            cash("body").removeClass("register")
            loading.value = false
          }
        })
      }
      
    }

    const gotoSignIn = () => {
      router.push({path: "login"})
    }

    onMounted(() => {
      cash("body")
        .removeClass("main")
        .removeClass("error-page")
        .removeClass("login")
        .addClass("register");
    });
    return {
      formData,
      $v,
      gotoSignIn,
      submit,
      loading
    }
  }
};
</script>
