<template>
  <!-- BEGIN: Mobile Menu -->
  <div class='mobile-menu md:hidden'>
    <div class='mobile-menu-bar'>
      <a href class='flex mr-auto'>
        <img alt='Midone Tailwind HTML Admin Template' class='w-32 h-8' src='@/assets/images/logo.svg'/>
      </a>
      <BarChart2Icon class='w-8 h-8 transform -rotate-90 text-theme-1' @click='toggleMobileMenu'/>
    </div>
    <transition @enter='enter' @leave='leave'>
      <ul v-if='activeMobileMenu' class='border-t border-theme-29 py-5'>
        <!-- BEGIN: First Child -->
        <template v-for='(menu, menuKey) in formattedMenu'>
          <li v-if="menu == 'devider'" :key='menu + menuKey' class='menu__devider my-6'></li>
          <li v-else-if='menu.subMenu.length === 1' :key='menu + menuKey'>
            <a
              href='javascript:;'
              class='menu'
              :class="{ 'menu--active': menu.subMenu[0].active }"
              @click='linkTo(menu.subMenu[0], router)'
            >
              <div class='menu__icon'>
                <component :is='menu.subMenu[0].icon' />
              </div>
              <div class='menu__title'>
                {{ menu.subMenu[0].title }}
                <div
                  v-if='menu.subMenu[0].subMenu'
                  class='menu__sub-icon'
                  :class="{
                    'transform rotate-180': menu.subMenu[0].activeDropdown
                  }"
                >
                  <ChevronDownIcon />
                </div>
              </div>
            </a>
          </li>
          <li v-else :key='menu + menuKey'>
            <a
              href='javascript:;'
              class='menu'
              :class="{
                'menu--active': menu.active,
                'menu--open': menu.activeDropdown
              }"
              @click='linkTo(menu, router)'
            >
              <div class='menu__icon'>
                <component :is='menu.icon' />
              </div>
              <div class='menu__title'>
                {{ menu.title }}
                <div v-if='menu.subMenu' class='menu__sub-icon' :class="{ 'transform rotate-180': menu.activeDropdown }">
                  <ChevronDownIcon />
                </div>
              </div>
            </a>
            <!-- BEGIN: Second Child -->
            <transition @enter='enter' @leave='leave'>
              <ul v-if='menu.subMenu && menu.activeDropdown'>
                <li v-for='(subMenu, subMenuKey) in menu.subMenu' :key='subMenuKey'>
                  <a
                    href='javascript:;'
                    class='menu'
                    :class="{ 'menu--active': subMenu.active }"
                    @click='linkTo(subMenu, router)'
                  >
                    <div class='menu__icon'>
                      <ActivityIcon />
                    </div>
                    <div class='menu__title'>
                      {{ subMenu.title }}
                      <div
                        v-if='subMenu.subMenu'
                        class='menu__sub-icon'
                        :class="{
                          'transform rotate-180': subMenu.activeDropdown
                        }"
                      >
                        <ChevronDownIcon />
                      </div>
                    </div>
                  </a>
                  <!-- BEGIN: Third Child -->
                  <transition @enter='enter' @leave='leave'>
                    <ul v-if='subMenu.subMenu && subMenu.activeDropdown'>
                      <li v-for='(lastSubMenu, lastSubMenuKey) in subMenu.subMenu' :key='lastSubMenuKey'>
                        <a
                          href='javascript:;'
                          class='menu'
                          :class="{ 'menu--active': lastSubMenu.active }"
                          @click='linkTo(lastSubMenu, router)'
                        >
                          <div class='menu__icon'>
                            <ZapIcon />
                          </div>
                          <div class='menu__title'>
                            {{ lastSubMenu.title }}
                          </div>
                        </a>
                      </li>
                    </ul>
                  </transition>
                  <!-- END: Third Child -->
                </li>
              </ul>
            </transition>
            <!-- END: Second Child -->
          </li>
        </template>
        <!-- END: First Child -->
      </ul>
    </transition>
  </div>
  <!-- END: Mobile Menu -->
</template>

<script>
import { defineComponent, computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import { helper as $h } from '@/utils/helper'
import {
  activeMobileMenu,
  toggleMobileMenu,
  linkTo,
  enter,
  leave
} from './index'
import { nestedMenu } from '@/layouts'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const formattedMenu = ref([])
    const mobileMenu = computed(() => nestedMenu(store.state.main.menu, route))

    watch(
      computed(() => route.path),
      () => {
        formattedMenu.value = $h.toRaw(mobileMenu.value)
      }
    )

    onMounted(() => {
      formattedMenu.value = $h.toRaw(mobileMenu.value)
    })

    return {
      activeMobileMenu,
      toggleMobileMenu,
      formattedMenu,
      router,
      linkTo,
      enter,
      leave
    }
  }
})
</script>
