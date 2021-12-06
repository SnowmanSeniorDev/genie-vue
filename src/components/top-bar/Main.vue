<template>
  <!-- BEGIN: Top Bar -->
  <div class='top-bar'>
    <!-- BEGIN: Breadcrumb -->
    <div class='-intro-x breadcrumb mr-auto hidden sm:flex'>
      <a href=''>Application</a>
      <ChevronRightIcon class='breadcrumb__icon' />
      <a href='' class='breadcrumb--active'>Dashboard</a>
    </div>
    <!-- END: Breadcrumb -->
    <!-- START: Eco system select -->
    <div v-if="user.user_role !== 'Genie Admin'" class='flex justify-center mr-4'>
      <div class='dropdown'>
        <button class='dropdown-toggle btn btn-primary' aria-expanded='false'>
          {{computedDefaultEcosystem.name}}
        </button>
        <div class='dropdown-menu w-40'>
          <div class='dropdown-menu__content box dark:bg-dark-1 p-2'>
            <a
              v-for='system in ecoSystem'
              href='javascript:;'
              class='block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md'
              :key='system.ecosystemId'
              @click="updateDefaultEcosystem(system)"
            >{{system.name}}</a>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Eco system select -->
    <!-- BEGIN: Notifications -->
    <div class='intro-x dropdown mr-auto sm:mr-6'>
      <div :class="`dropdown-toggle notification cursor-pointer ${unreadAlerts ? 'notification--bullet': ''}`" role='button' aria-expanded='false'>
        <BellIcon class='notification__icon dark:text-gray-300' />
      </div>
      <div class='notification-content pt-2 dropdown-menu'>
        <div class='notification-content__box dropdown-menu__content box dark:bg-dark-6'>
          <div class='notification-content__title'>
            Alert Center
          </div>
          <hr />
          <div v-for='(alert, index) in alerts' class='cursor-pointer relative flex items-center py-2' :key='index' @click="gotoNotification(alert)">
            <div>
              <div class='w-8 mr-1 bg-pink-200 p-1 rounded-full text-center'>
                <FileTextIcon class='notification__icon dark:text-gray-300 text-pink-700 text-sm w-4' />
              </div>
            </div>
            <div class='ml-2 overflow-hidden text-left'>
              <div class='flex items-center'>
                <a href='javascript:;' class='font-medium truncate mr-5'>{{alert.title}}</a>
              </div>
              <div class='w-full truncate text-gray-600 mt-0.5 text-xs'>
                {{moment(alert.when).format(dateTimeFormat)}}
              </div>
            </div>
          </div>
          <hr /> 
          <button class='btn btn-primary w-full px-2 mt-2' @click='gotoAlertCenter'>Show All Alerts</button>
        </div>
      </div>
    </div>
    <!-- END: Notifications -->
    <!-- BEGIN: Calendar -->
    <div class='intro-x dropdown mr-auto sm:mr-6'>
      <div :class="`dropdown-toggle notification cursor-pointer ${dayDiff < 8 ? 'notification--bullet': ''}`" role='button' aria-expanded='false'>
        <CalendarIcon class='notification__icon dark:text-gray-300' />
      </div>
      <div class='notification-content pt-2 dropdown-menu'>
        <div class='notification-content__box dropdown-menu__content box dark:bg-dark-6'>
          <div class='notification-content__title'>Upcomming Holiday Calendar</div>
          <div v-for='holiday in holidays' :key='holiday.holidayCalendarEntryId' class='cursor-pointer relative flex items-center mt-2'>
            <div class='w-8 mr-1 bg-pink-200 p-1 rounded-md'>
              <CalendarIcon class='notification__icon dark:text-gray-300 text-pink-700 text-sm' />
            </div>
            <div class='ml-2 overflow-hidden'>
              <div class='flex items-center'>
                <a href='javascript:;' class='truncate mr-5'>{{moment(holiday.date).format(dateFormat)}}</a>
              </div>
              <div class='flex items-center'>
                <a href='javascript:;' class='font-medium truncate mr-5'>{{holiday.description}}</a>
              </div>
              <div class='w-full truncate text-gray-600 mt-0.5'>{{holiday.label}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Calendar -->
    <div class='pr-2'>
      <span>Hi, </span>
    </div>
    <!-- BEGIN: Account Menu -->
    <div class='intro-x dropdown h-8'>
      <div class='dropdown-toggle h-8 flex items-center text-theme-1' role='button' aria-expanded='false'>
        {{user.display_name}}
      </div>
      <div class='dropdown-menu w-56'>
        <div class='dropdown-menu__content box bg-theme-26 dark:bg-dark-6 text-white'>
          <div class='p-4 border-b border-theme-27 dark:border-dark-3'>
            <div class='font-medium'>{{ user.display_name }}</div>
            <div class='text-xs text-theme-28 mt-0.5 dark:text-gray-600'>
              {{ user.user_role }}
            </div>
          </div>
          <div class='p-2'>
            <a href='/account' class='items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md'>
              <UserIcon class='w-4 h-4 mr-2' /> Profile
            </a>
            <a href='javascript:;' class='items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md' @click='gotoUpdatePassword' >
              <LockIcon class='w-4 h-4 mr-2' /> Update Password
            </a>
          </div>
          <div class='p-2 border-t border-theme-27 dark:border-dark-3'>
            <a href='javascript:;' class='items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md' @click='logout'>
              <ToggleRightIcon class='w-4 h-4 mr-2' /> Logout
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
import { defineComponent, ref, onMounted, computed } from 'vue';
import { sysAxios, appAxios } from '@/plugins/axios';
import { useStore } from 'vuex';
import moment from 'moment';
import _ from 'lodash';
import { useRouter } from 'vue-router';


export default defineComponent({
  setup() {
    const dateTimeFormat = ref(process.env.VUE_APP_DATETIME_FORMAT);
    const dateFormat = ref(process.env.VUE_APP_DATE_FORMAT);
    const store = useStore()
    const router = useRouter()

    const user = ref(store.state.auth)
    const defaultEcosystem = ref(store.state.main.defaultEcosystem)
    const ecoSystem = ref([])

    const alerts = ref([])
    const unreadAlerts = ref(false)
    const holidays = ref([])
    const dayDiff = ref(100)

    const logout = () => {
      store.dispatch('auth/logout')
    }
    const gotoUpdatePassword = () => {
      router.push({path: '/update_password'})
    }
    const gotoAlertCenter = () => {
      router.push({path: '/alerts'})
    }
    const updateDefaultEcosystem = async (system) => {
      await store.dispatch('main/updateDefaultEcosystem', system)
    }
    const computedDefaultEcosystem = computed({
      get: () => store.state.main.defaultEcosystem
    })
    const gotoNotification = (alert) => {
      console.log(alert)
      router.push({path: '/alerts', params: {notificationId: alert.notificationId}})
    }

    onMounted(async () => {
      const company_uuid = store.state.account.company_uuid
      if(company_uuid !== '00000000-0000-0000-0000-000000000000') {
        sysAxios.get(`/communications/v1/notification/${company_uuid}`).then(res => {
          alerts.value = _.filter(res.data, {status: 'Complete'}).slice(0, 5)
          if(_.findIndex(res.data, {status: 'Complete'}) != -1) unreadAlerts.value = true
        })
        appAxios.get(`/company/v1/${company_uuid}/holidays`).then(res => {
          holidays.value = _.filter(res.data, (holiday) => {return new Date(holiday.date) > new Date()}).slice(0, 3)
          if(holidays.value.length > 0)
          {
            dayDiff.value = moment(holidays.value[0].date).diff(moment(new Date()), 'days');
          }          
        })
        ecoSystem.value = await store.dispatch('main/updateEcosystems', {company_uuid})
      }
    })

    return {
      dateFormat,
      dateTimeFormat,
      alerts,
      holidays,
      moment,
      user,
      dayDiff,
      unreadAlerts,
      ecoSystem,
      defaultEcosystem,
      computedDefaultEcosystem,
      store,
      logout,
      gotoUpdatePassword,
      gotoAlertCenter,
      updateDefaultEcosystem,
      gotoNotification
    };
  },
});
</script>
