<template>
  <div>
    <h2 class="intro-y text-lg font-medium mt-10">Users Layout</h2>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
        <button class="btn btn-primary shadow-md mr-2" @click="gotoCreatUser">Add New User</button>
        <div class="hidden md:block mx-auto text-gray-600">
          Showing 1 to 10 of 150 entries
        </div>
        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
          <div class="w-56 relative text-gray-700 dark:text-gray-300">
            <input
              type="text"
              class="form-control w-56 box pr-10 placeholder-theme-13"
              placeholder="Search..."
              v-model="searchKey"
            />
            <SearchIcon class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"/>
          </div>
        </div>
      </div>
      <!-- BEGIN: Users Layout -->
      <div
        v-for="user in searchedUsers.slice(pageNation.entities * (pageNation.currentPage - 1), pageNation.entities * pageNation.currentPage)"
        class="intro-y col-span-12 md:col-span-6 lg:col-span-4"
        :key="user.Id"
      >
        <div class="box">
          <div class="flex items-start px-5 pt-5">
            <div class="w-full flex flex-col lg:flex-row items-center">
              <div class="w-16 h-16 image-fit">
                <!-- <img alt="Midone Tailwind HTML Admin Template" class="rounded-full" :src="require(`@/assets/images/${faker.photos[0]}`)"/> -->
              </div>
              <div class="lg:ml-4 text-center lg:text-left mt-3 lg:mt-0">
                <a href="" class="font-medium">{{ user.firstName + ' ' + user.lastName }}</a>
                <div class="text-gray-600 text-xs mt-0.5">
                  {{ user.displayName }}
                </div>
              </div>
            </div>
            <div class="absolute right-0 top-0 mr-5 mt-3 dropdown">
              <a class="dropdown-toggle w-5 h-5 block" aria-expanded="false">
                <MoreHorizontalIcon class="w-5 h-5 text-gray-600 dark:text-gray-300"/>
              </a>
              <div class="dropdown-menu w-40">
                <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
                  <a 
                    :href="'/users/edit/' + user.userId"
                    class="items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                  >
                    <Edit2Icon class="w-4 h-4 mr-2" /> Edit
                  </a>
                  <a
                    class="items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                    @click="deleteUser(user.userId)"
                  >
                    <TrashIcon class="w-4 h-4 mr-2" /> Delete
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center lg:text-left p-5">
            <div class="flex items-center justify-center lg:justify-start text-gray-600 mt-5">
              <MailIcon class="w-3 h-3 mr-2" />
              {{ user.emailAddress }}
            </div>
            <div class="flex items-center justify-center lg:justify-start text-gray-600 mt-1">
              <InstagramIcon class="w-3 h-3 mr-2" />
              {{ user.userName }}
            </div>
          </div>
          <div class="text-center lg:text-right p-5 border-t border-gray-200 dark:border-dark-5">
            <button class="btn btn-outline-secondary py-1 px-2">Profile</button>
          </div>
        </div>
      </div>
      <!-- END: Users Layout -->
      <!-- BEGIN: Pagination -->
      <div class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
        <ul class="pagination">
          <li>
            <a
              class="pagination__link"
              :class="`${pageNation.currentPage == 1 ? 'pointer-events-none opacity-50' : ''}`"
              href=""
              @click="(e) => gotoPage(e, 1)"
            >
              <ChevronsLeftIcon class="w-4 h-4" />
            </a>
          </li>
          <li>
            <a
              class="pagination__link"
              :class="`${pageNation.currentPage == 1 ? 'pointer-events-none opacity-50' : ''}`"
              href=""
              @click="(e) => gotoPage(e, pageNation.currentPage - 1)"
            >
              <ChevronLeftIcon class="w-4 h-4" />
            </a>
          </li>
          <li>
            <a class="pagination__link" href="">...</a>
          </li>
          <li v-if="pageNation.currentPage - 2 > 0 && pageNation.currentPage == pageNation.pageSize">
            <a
              class="pagination__link"
              href=""
              @click="(e) => gotoPage(e, pageNation.currentPage - 2)"
            >
              {{pageNation.currentPage - 2}}
            </a>
          </li>
          <li v-if="pageNation.currentPage - 1 > 0">
            <a
              class="pagination__link"
              href=""
              @click="(e) => gotoPage(e, pageNation.currentPage - 1)"
            >
              {{pageNation.currentPage - 1}}
            </a>
          </li>
          <li>
            <a class="pagination__link pagination__link--active" href="">{{pageNation.currentPage}}</a>
          </li>
          <li v-if="pageNation.currentPage + 1 <= pageNation.pageSize">
            <a
              class="pagination__link"
              href=""
              @click="(e) => gotoPage(e, pageNation.currentPage + 1)"
            >
              {{pageNation.currentPage + 1}}
            </a>
          </li>
          <li v-if="pageNation.currentPage + 2 <= pageNation.pageSize && pageNation.currentPage == 1">
            <a
              class="pagination__link"
              href=""
              @click="(e) => gotoPage(e, pageNation.currentPage + 2)"
            >
              {{pageNation.currentPage + 2}}
            </a>
          </li>
          <li>
            <a class="pagination__link" href="">...</a>
          </li>
          <li>
            <a
              class="pagination__link"
              :class="`${pageNation.currentPage == pageNation.pageSize ? 'pointer-events-none opacity-50' : ''}`"
              href=""
              @click="(e) => gotoPage(e, pageNation.currentPage + 1)"
            >
              <ChevronRightIcon class="w-4 h-4" />
            </a>
          </li>
          <li>
            <a
              class="pagination__link"
              :class="`${pageNation.currentPage == pageNation.pageSize ? 'pointer-events-none opacity-50' : ''}`"
              href=""
              @click="(e) => gotoPage(e, pageNation.pageSize)"
            >
              <ChevronsRightIcon class="w-4 h-4" />
            </a>
          </li>
        </ul>
        <select class="w-20 form-select box mt-3 sm:mt-0" @change="(e) => updatePageEntities(e)">
          <option value=5>5</option>
          <option value=10>10</option>
          <option value=25>25</option>
          <option value=35>35</option>
          <option value=50>50</option>
        </select>
      </div>
      <!-- END: Pagination -->
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { sysAxios } from "@/plugins/axios";
import _ from "lodash";

export default {
  setup() {
    const users = ref([])
    const searchedUsers = ref([])
    const searchKey = ref("")
    const pageNation = ref({
      entities: 5,
      pageSize: 1,
      currentPage: 1
    })

    const updatePageNation = () => {
      pageNation.value.pageSize = Math.max(1, Math.ceil(searchedUsers.value.length / pageNation.value.entities))
      if(pageNation.value.pageSize < pageNation.value.currentPage) {
        pageNation.value.currentPage = pageNation.value.pageSize
      }
    }
    const search = (key) => {
      if(key.length) {
        searchedUsers.value = users.value.filter(user => {
          return Object.values(user).join("").toLowerCase().includes(key)
        })
        updatePageNation()
      } else {
        searchedUsers.value = users.value
        updatePageNation()
      }
    }

    const gotoPage = (e, page) => {
      e.preventDefault()
      pageNation.value.currentPage = page
    }

    const updatePageEntities = (e) => {
      pageNation.value.entities = e.target.value
      updatePageNation()
    }

    const init = async () => {
      const api = "user/v1/"
      users.value = await sysAxios.get(api).then(res => res.data)
      searchedUsers.value = users.value
      updatePageNation()
    }

    watch(searchKey, (newValue, oldValue) => {
      search(newValue.trim())
    })

    onMounted(() => {
      init()
    })

    return {
      users,
      searchedUsers,
      searchKey,
      pageNation,
      gotoPage,
      updatePageEntities
    }
  },
  methods: {
    gotoCreatUser() {
      this.$router.push({path: '/users/creat'})
    },
    gotoEdit(id) {
      this.$router.push({path: `/users/edit/${id}`})
    },
    deleteUser(userId) {
      const api = `user/v1/${userId}`;
      console.log(api);
      sysAxios.delete(api).then(res => {
        if(res.status === 200) {
          _.remove(this.users, {userId: userId});
          console.log(this.users);
        }
      })
    }
  },
}
</script>
