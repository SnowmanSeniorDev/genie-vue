<template>
  <div>
    <DarkModeSwitcher />
    <div class="container">
      <!-- BEGIN: Error Page -->
      <div class="error-page flex flex-col lg:flex-row items-center justify-center h-screen text-center lg:text-left">
        <div class="-intro-x lg:mr-20">
          <img alt="Midone Tailwind HTML Admin Template" class="h-48 lg:h-auto" :src="require(`@/assets/images/error-illustration.svg`)"/>
        </div>
        <div class="text-white mt-10 lg:mt-0">
          <div class="intro-x text-8xl font-medium">403</div>
          <div class="intro-x text-xl lg:text-3xl font-medium mt-5">
            Oops. You have no access to this Page.
          </div>
          <div class="intro-x text-lg mt-3">
            You may have mistyped the address, so access this page please require access require to super admin.
          </div>
          <button class="intro-x btn py-3 px-4 text-white border-white dark:border-dark-5 dark:text-gray-300 mt-10">
            Back to Home
          </button>
        </div>
      </div>
      <!-- END: Error Page -->
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import DarkModeSwitcher from "@/components/dark-mode-switcher/Main.vue";

export default defineComponent({
  components: {
    DarkModeSwitcher
  },
  setup() {
    onMounted(() => {
      cash("body")
        .removeClass("main")
        .removeClass("login")
        .addClass("error-page");
    });
  }
});
</script>
