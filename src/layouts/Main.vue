<template>
  <div>
    <MobileMenu />
    <div class="flex">
      <!-- BEGIN: Side Menu -->
      <nav class="side-nav">
        <!-- BEGIN: Logo -->
        <router-link :to="{ name: 'GENIE_DASHBOARD' }" tag="a" class="intro-x items-center pt-4 flex justify-center">
          <img alt="Midone Tailwind HTML Admin Template" class="hidden xl:block w-24" src="@/assets/images/logo.svg"/>
          <img alt="Midone Tailwind HTML Admin Template" class="xl:hidden w-24" src="@/assets/images/logo-lines.svg"/>
        </router-link>
        <!-- END: Logo -->
        <div class="my-6"></div>
        <ul>
          <!-- BEGIN: First Child -->
          <template v-for="(menu, menuKey) in formattedMenu">
            <li v-if="menu == 'devider'" :key="menu + menuKey" class="side-nav__devider my-6"></li>
            <li v-else-if="menu.subMenu.length === 1" :key="menu + menuKey">
              <SideMenuTooltip
                tag="a"
                :content="menu.subMenu[0].title"
                href="javascript:;"
                class="side-menu"
                :class="{ 'side-menu--active': menu.subMenu[0].active }"
                @click="linkTo(menu.subMenu[0], router)"
              >
                <div class="side-menu__icon">
                  <component :is="menu.subMenu[0].icon" />
                </div>
                <div class="side-menu__title">
                  {{ menu.subMenu[0].title }}
                  <div v-if="menu.subMenu[0].subMenu" class="side-menu__sub-icon" :class="{'transform rotate-180': menu.subMenu[0].activeDropdown}">
                    <ChevronDownIcon />
                  </div>
                </div>
              </SideMenuTooltip>
            </li>
            <li v-else :key="menu + menuKey">
              <SideMenuTooltip
                tag="a"
                :content="menu.title"
                href="javascript:;"
                class="side-menu"
                :class="{
                  'side-menu--active': menu.active,
                  'side-menu--open': menu.activeDropdown
                }"
                @click="linkTo(menu, router)"
              >
                <div class="side-menu__icon">
                  <component :is="menu.icon" />
                </div>
                <div class="side-menu__title">
                  {{ menu.title }}
                  <div v-if="menu.subMenu" class="side-menu__sub-icon" :class="{ 'transform rotate-180': menu.activeDropdown }">
                    <ChevronDownIcon />
                  </div>
                </div>
              </SideMenuTooltip>
              <!-- BEGIN: Second Child -->
              <transition @enter="enter" @leave="leave">
                <ul v-if="menu.subMenu && menu.activeDropdown">
                  <li v-for="(subMenu, subMenuKey) in menu.subMenu" :key="subMenuKey">
                    <SideMenuTooltip
                      tag="a"
                      :content="subMenu.title"
                      href="javascript:;"
                      class="side-menu"
                      :class="{ 'side-menu--active': subMenu.active }"
                      @click="linkTo(subMenu, router)"
                    >
                      <div class="side-menu__icon">
                        <component :is="subMenu.icon" />
                      </div>
                      <div class="side-menu__title">
                        {{ subMenu.title }}
                        <div v-if="subMenu.subMenu" class="side-menu__sub-icon" :class="{'transform rotate-180': subMenu.activeDropdown}">
                          <ChevronDownIcon />
                        </div>
                      </div>
                    </SideMenuTooltip>
                  </li>
                </ul>
              </transition>
              <!-- END: Second Child -->
            </li>
          </template>
          <!-- END: First Child -->
        </ul>
      </nav>
      <!-- END: Side Menu -->
      <!-- BEGIN: Content -->
      <div class="content">
        <TopBar />
        <router-view />
      </div>
      <!-- END: Content -->
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store";
import { helper as $h } from "@/utils/helper";
import TopBar from "@/components/top-bar/Main.vue";
import MobileMenu from "@/components/mobile-menu/Main.vue";
import DarkModeSwitcher from "@/components/dark-mode-switcher/Main.vue";
import SideMenuTooltip from "@/components/side-menu-tooltip/Main.vue";
import { linkTo, nestedMenu, enter, leave } from "./index";
// import { sysAxios } from "@/plugins/axios";
// import { mapActions } from "vuex"


export default defineComponent({
  components: {
    TopBar,
    MobileMenu,
    DarkModeSwitcher,
    SideMenuTooltip
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const formattedMenu = ref([]);
    const sideMenu = computed(() => nestedMenu(store.state.main.menu, route));

    watch(
      computed(() => route.path),
      () => {
        formattedMenu.value = $h.toRaw(sideMenu.value);
      }
    );

    onMounted(() => {
      cash("body")
        .removeClass("error-page")
        .removeClass("login")
        .addClass("main");
      formattedMenu.value = $h.toRaw(sideMenu.value);
    });

    return {
      formattedMenu,
      router,
      linkTo,
      enter,
      leave
    };
  }
});
</script>