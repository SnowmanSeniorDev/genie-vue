<template>
  <div class="">
		<div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
			<div class="intro-y col-span-12">
        <table class="table table--lg">
          <thead>
            <tr class="bg-theme-2">
              <th class="whitespace-nowrap"> FIRST NAME </th>
              <th class="whitespace-nowrap"> LAST NAME </th>
              <th class="whitespace-nowrap"> EMAIL </th>
              <th class="whitespace-nowrap"> DISPLAY NAME </th>
              <th class="whitespace-nowrap"> USERNAME </th>
              <th class="whitespace-nowrap"> ACTION </th>
            </tr>
          </thead>
          <tbody v-if="userList.length > 0" >
            <tr class="odd:bg-gray-200" v-for="(user, index) in userList" :key="index">
              <td class="">{{user.firstName}}</td>
              <td class="">{{user.lastName}}</td>
              <td class="">{{user.emailAddress}}</td>
              <td class=""> {{user.displayName}}</td>
              <td class=""> {{user.userName}}</td>
              <td class="">
                <div class="grid grid-cols-2">
                    <a 
                    :href="'/users/edit/' + user.userId"
                    class="items-center block p-2 transition duration-300 ease-in-out dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                  >
                    <Edit2Icon class="w-4 h-4 mr-2" /> Edit
                  </a>
                   <a
                    class="items-center block p-2 transition duration-300 ease-in-out dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                    @click="deleteUser(user.userId)"
                  >
                    <TrashIcon class="w-4 h-4 mr-2" /> Delete
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
             <tr class="odd:bg-gray-200">
              <td class="" colspan="6">No user found.</td>
              </tr>
          </tbody>
        </table>
			</div> 
		</div> 
	</div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ref, onMounted } from "vue"
import _ from "lodash"
import Toastify from "toastify-js"
import { sysAxios, appAxios } from "@/plugins/axios"


export default {
  props: {
    companyId: {
      type: String,
      required: true
    }
  },
	setup(props) { 
      // get user by companyid https://genie-router.api-dev.xyz/api/genie/company/v1/54b46790-4534-407c-8041-08d9377e4b98/users
    const userList = ref([]);
   
    onMounted(async () => {
	    const getCompanyUsers = `/company/v1/${props.companyId}/users`
      const getUserProfile = '/user/v1/';
      await appAxios.get(getCompanyUsers).then(res => {
        if(res.data.length) {  
          res.data.forEach(item => { 
            sysAxios.get(getUserProfile+item.userId).then(res=> {
                userList.value.push(res.data);
            });
          });
        } 
      })  
    })
     
    return { 
      userList,
    }
	},
  methods:{
     deleteUser(userId) {
      const api = `user/v1/${userId}`;
      console.log(api);
      sysAxios.delete(api).then(res => {
        if(res.status === 200) {
          _.remove(this.users, {userId: userId});
          console.log(this.users);
        }
      })
    }, 
  }
}
</script>
