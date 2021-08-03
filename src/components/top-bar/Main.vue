<template>
  <!-- BEGIN: Top Bar -->
  <div class="top-bar">
    <!-- BEGIN: Breadcrumb -->
    <div class="-intro-x breadcrumb mr-auto hidden sm:flex">
      <a href="">Application</a>
      <ChevronRightIcon class="breadcrumb__icon" />
      <a href="" class="breadcrumb--active">Dashboard</a>
    </div>
    <!-- END: Breadcrumb -->
    <!-- BEGIN: Notifications -->
    <div class="intro-x dropdown mr-auto sm:mr-6">
      <div class="dropdown-toggle notification notification--bullet cursor-pointer" role="button" aria-expanded="false">
        <BellIcon class="notification__icon dark:text-gray-300" />
      </div>
      <div class="notification-content pt-2 dropdown-menu">
        <div class="notification-content__box dropdown-menu__content box dark:bg-dark-6">
          <div class="notification-content__title">
            Alters Center
          </div>
          <hr />
          <div v-for="(alert, index) in alerts" class="cursor-pointer relative flex items-center py-2" :key="index">
            <div class="w-12 mr-1">
              <div class="w-8 mr-1 bg-pink-200 p-1 rounded-full text-center">
                <FileTextIcon class="notification__icon dark:text-gray-300 text-pink-700 text-sm w-4" />
              </div>
            </div>
            <div class="ml-2 overflow-hidden">
              <div class="flex items-center">
                <a href="javascript:;" class="font-medium truncate mr-5">{{alert.title}}</a>
              </div>
              <div class="w-full truncate text-gray-600 mt-0.5 text-xs">
                {{alert.when}}
              </div>
            </div>
          </div>
          <hr />
          <!-- <div class="cursor-pointer relative flex items-center py-2">
            <div class="w-12 mr-1">
              <div class="w-8 mr-1 bg-blue-200 p-1 rounded-full text-center">
                <UserIcon class="notification__icon dark:text-gray-300 text-blue-700 text-sm w-4" />
              </div>
            </div>
            <div class="ml-2 overflow-hidden">
              <div class="flex items-center">
                <a href="javascript:;" class="font-medium truncate mr-5">Seller Onboarded</a>
              </div>
              <div class="w-full truncate text-gray-600 mt-0.5 text-xs">
                12 April 2021 09:26 
              </div>
            </div>
          </div>
          <hr />
          <div class="cursor-pointer relative flex items-center py-2">
            <div class="w-12 mr-1">
              <div class="w-8 mr-1 bg-yellow-200 p-1 rounded-full text-center">
                <MapPinIcon class="notification__icon dark:text-gray-300 text-yellow-700 text-sm w-4" />
              </div>
            </div>
            <div class="ml-2 overflow-hidden">
              <div class="flex items-center">
                <a href="javascript:;" class="font-medium truncate mr-5">Seler Acknowledgement Status Change</a>
              </div>
              <div class="w-full truncate text-gray-600 mt-0.5 text-xs">
                10 April 2021 02:30PM 
              </div>
            </div>
          </div>
          <hr />
          <div class="cursor-pointer relative flex items-center py-2">
            <div class="w-12 mr-1">
              <div class="w-8 mr-1 bg-yellow-200 p-1 rounded-full text-center">
                <FileTextIcon class="notification__icon dark:text-gray-300 text-yellow-700 text-sm w-4" />
              </div>
            </div>
            <div class="ml-2 overflow-hidden">
              <div class="flex items-center">
                <a href="javascript:;" class="font-medium truncate mr-5">Seller Validation status Change</a>
              </div>
              <div class="w-full truncate text-gray-600 mt-0.5 text-xs">
                05 April 2021 10:10AM
              </div>
            </div>
          </div>
          <hr /> -->
          <button class="btn btn-primary w-full px-2 mt-2" @click="gotoAlertCenter">Show All Alerts</button>
        </div>
      </div>
    </div>
    <!-- END: Notifications -->
    <!-- BEGIN: Calendar -->
    <div class="intro-x dropdown mr-auto sm:mr-6">
      <div class="dropdown-toggle notification notification--bullet cursor-pointer" role="button" aria-expanded="false">
        <CalendarIcon class="notification__icon dark:text-gray-300" />
      </div>
      <div class="notification-content pt-2 dropdown-menu">
        <div class="notification-content__box dropdown-menu__content box dark:bg-dark-6">
          <div class="notification-content__title">Upcomming Holiday Calendar</div>
          <div
            v-for="(faker, fakerKey) in $_.take($f(), 3)"
            :key="fakerKey"
            class="cursor-pointer relative flex items-center"
            :class="{ 'mt-5': fakerKey }"
          >
            <div class="w-8 mr-1 bg-pink-200 p-1 rounded-md">
              <CalendarIcon class="notification__icon dark:text-gray-300 text-pink-700 text-sm" />
            </div>
            <div class="ml-2 overflow-hidden">
              <div class="flex items-center">
                <a href="javascript:;" class="truncate mr-5">31 May 2021, Monday</a>
              </div>
              <div class="flex items-center">
                <a href="javascript:;" class="font-medium truncate mr-5">Memorial Day</a>
              </div>
              <div class="w-full truncate text-gray-600 mt-0.5">
                Public Holiday applicable to Japan
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Calendar -->
    <!-- BEGIN: Account Menu -->
    <div class="intro-x dropdown w-8 h-8">
      <div class="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in" role="button" aria-expanded="false">
        <img alt="Midone Tailwind HTML Admin Template" :src="require(`@/assets/images/${$f()[9].photos[0]}`)"/>
      </div>
      <div class="dropdown-menu w-56">
        <div class="dropdown-menu__content box bg-theme-26 dark:bg-dark-6 text-white">
          <div class="p-4 border-b border-theme-27 dark:border-dark-3">
            <div class="font-medium">{{ $f()[0].users[0].name }}</div>
            <div class="text-xs text-theme-28 mt-0.5 dark:text-gray-600">
              {{ $f()[0].jobs[0] }}
            </div>
          </div>
          <div class="p-2">
            <a href="javascript:;" class="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md">
              <UserIcon class="w-4 h-4 mr-2" /> Profile
            </a>
            <a href="javascript:;" class="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md">
              <EditIcon class="w-4 h-4 mr-2" /> Add Account
            </a>
            <a href="javascript:;" class="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md" @click="gotoUpdatePassword" >
              <LockIcon class="w-4 h-4 mr-2" /> Update Password
            </a>
            <a href="javascript:;" class="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md">
              <HelpCircleIcon class="w-4 h-4 mr-2" /> Help
            </a>
          </div>
          <div class="p-2 border-t border-theme-27 dark:border-dark-3">
            <a href="javascript:;" class="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md" @click="logout">
              <ToggleRightIcon class="w-4 h-4 mr-2" /> Logout
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Account Menu -->
  </div>
  <!-- END: Top Bar -->
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { mapActions } from "vuex";
import { sysAxios } from "@/plugins/axios";
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore()
    const alerts = ref([])
    
    onMounted(async () => {
      const api = `/communications/v1/notification/${store.state.account.company_uuid}`
      if(company_uuid !== "00000000-0000-0000-0000-000000000000") {
        await sysAxios.get(api).then(res => {
          console.log("alerts top bar = ", res.data)
          alerts.value = res.data
        })
      }
    })
    return {
      alerts
    };
  },
  methods: {
    ...mapActions({
      logout: "auth/logout"
    }),
    gotoUpdatePassword() {
      this.$router.push({path: "/update_password"});
    },
    gotoAlertCenter() {
      this.$router.push({path: "/alerts"})
    }
  }
});
</script>
