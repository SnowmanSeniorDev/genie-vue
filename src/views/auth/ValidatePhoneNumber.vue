<template>
  <div>
    <div class="container sm:px-10">
      <div class="block xl:grid grid-cols-2 gap-4">
        <!-- BEGIN: Register Info -->
        <div class="hidden xl:flex flex-col min-h-screen">
          <a href="" class="-intro-x flex items-center pt-5">
            <img alt="Midone Tailwind HTML Admin Template" class="w-6" :src="require(`@/assets/images/logo.svg`)"/>
            <span class="text-white text-lg ml-3">Genie</span>
          </a>
          <div class="my-auto">
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
            <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">Validate Phone Number</h2>
            <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
              <div class="">
                <h4 class="text-center font-bold text-base">Enter Verification code sent to your mobile</h4>
                <PincodeInput v-model="code" placeholder="0"/>
                <h4 class="text-center">Please wait for (15) seconds <a href="javascript:;" class="text-pink-500">to request a new code</a></h4>
              </div>
              <button class="btn btn-primary py-3 px-4 w-full xl:mr-3 align-top mt-6" @click="validateMobileNumber"> Validate mobile number</button>
              <div class="intro-x flex justify-center text-gray-700 dark:text-gray-600 mt-4 text-xs sm:text-sm">
                <a class="text-theme-1 dark:text-theme-10 ml-1" href="javascript:;" @click="gotoSignUp">Back to sign up</a>
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
import { reactive, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import PincodeInput from "@/components/pincode-input/Main.vue";
export default {
  components: {
    PincodeInput
  },
  setup() {
    const router = useRouter();
    const code = ref('');
    const formData = reactive({
      confirmPassword: "",
    });

    onMounted(() => {
      cash("body").removeClass("main").removeClass("error-page").addClass("login");
    });

    const gotoSignUp = () => {
      router.push({path: "register"});
    }

    const validateMobileNumber = () => {
      console.log(code.value)
    }
    return {
      code,
      formData,
      gotoSignUp,
      validateMobileNumber
    }
  },
};
</script>
