<template>
  <div id='success-notification-content' class='toastify-content hidden'>
    <div class='flex items-center'>
      <CheckCircleIcon class='text-theme-9' />
      <div class='ml-4 mr-4'>
        <div class='font-medium notification-title'>success notification title</div>
        <div class='text-gray-600 mt-1 notification-content'>success notification content</div>
      </div>
    </div>
  </div>
  <div id='error-notification-content' class='toastify-content hidden'>
    <div class='flex items-center'>
      <XCircleIcon class='text-theme-6' />
      <div class='ml-4 mr-4'>
        <div class='font-medium notification-title'>error notification title</div>
        <div class='text-gray-600 mt-1 notification-content'>error notification content</div>
      </div>
    </div>
  </div>
  <router-view />
</template>

<script>
// import { initSession } from './plugins/session-manager'

export default {
}
</script>
