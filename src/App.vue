<template>
  <Suspense>
    <router-view />
  </Suspense>
</template>

<script>
// import { initSession } from "./plugins/session-manager"

export default {
  mounted() {
    // initSession();
  }
}
</script>
