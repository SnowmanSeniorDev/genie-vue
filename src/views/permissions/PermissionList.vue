<template>
  <div>
    <h2 class="intro-y text-lg font-medium mt-10">Permissions</h2>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
        <button class="btn btn-primary shadow-md mr-2" @click="gotoCreatePermission">Add New Permission</button>
        <div class="dropdown">
          <button class="dropdown-toggle btn px-2 box text-gray-700 dark:text-gray-300" aria-expanded="false">
            <span class="w-5 h-5 flex items-center justify-center">
              <PlusIcon class="w-4 h-4" />
            </span>
          </button>
          <div class="dropdown-menu w-40">
            <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
              <a href="" class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md">
                <PrinterIcon class="w-4 h-4 mr-2" /> Print
              </a>
              <a href="" class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md">
                <FileTextIcon class="w-4 h-4 mr-2" /> Export to Excel
              </a>
              <a href="" class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md">
                <FileTextIcon class="w-4 h-4 mr-2" /> Export to PDF
              </a>
            </div>
          </div>
        </div>
        <div class="hidden md:block mx-auto text-gray-600"></div>
        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
          <div class="w-56 relative text-gray-700 dark:text-gray-300">
            <input type="text" class="form-control w-56 box pr-10 placeholder-theme-13" placeholder="Search..."/>
            <SearchIcon class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"/>
          </div>
        </div>
      </div>
      <!-- BEGIN: Data List -->
      <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
        <table class="table table-report -mt-2">
          <thead>
            <tr>
              <th class="whitespace-nowrap">PERMISSION NAME</th>
              <th class="whitespace-nowrap">URL</th>
              <th class="text-center whitespace-nowrap">EXPIRE DATE</th>
              <th class="text-center whitespace-nowrap">TYPE</th>
              <th class="text-center whitespace-nowrap">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(permission, permissionKey) in permissions" :key="permissionKey" class="intro-x">
              <td>
                <a href="" class="font-medium whitespace-nowrap">{{permission.permissionName}}</a>
              </td>
              <td>
                <div class="text-gray-600 text-xs whitespace-nowrap mt-0.5"> {{ permission.resourceURI }}</div>
              </td>
              <td class="text-center">{{ !permission.validUntil ? "never expired" : "permission.validUntil" }}</td>
              <td class="w-40">
                <div class="flex items-center justify-center">
                  {{ permission.type }}
                </div>
              </td>
              <td class="table-report__action w-56">
                <div class="flex justify-center items-center">
                  <a class="flex items-center mr-3" @click="gotoEditPermission(permission.permissionId)">
                    <CheckSquareIcon class="w-4 h-4 mr-1" />
                    Edit
                  </a>
                  <a class="flex items-center text-theme-6" data-toggle="modal" data-target="#delete-confirmation-modal" @click="setDeletePermissionId(permission.permissionId)">
                    <Trash2Icon class="w-4 h-4 mr-1" /> Delete
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- END: Data List -->
    </div>
    <!-- BEGIN: Delete Confirmation Modal -->
    <!-- <div id="delete-confirmation-modal" :class="modal ? 'modal show' : 'modal'" tabindex="-1" aria-hidden="true"> -->
    <div id="delete-confirmation-modal" class="modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body p-0">
            <div class="p-5 text-center">
              <XCircleIcon class="w-16 h-16 text-theme-6 mx-auto mt-3" />
              <div class="text-3xl mt-5">Are you sure?</div>
              <div class="text-gray-600 mt-2">
                Do you really want to delete these permission? <br />This process
                cannot be undone.
              </div>
            </div>
            <div class="px-5 pb-8 text-center">
              <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-24 mr-1">
                Cancel
              </button>
              <button type="button" data-dismiss="modal" class="btn btn-danger w-24" @click="deletePermission('111')">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Delete Confirmation Modal -->
    <router-view></router-view>
  </div>
</template>

<script>

import { ref } from "vue";
import Https from "@/plugins/axios";
import _ from "lodash";

export default {
  setup() {
    const api = "access/v1/permission";
    const permissions = ref(null);
    const deletePermissionId = ref(null);
    const modal = ref(false);
    Https.get(api).then(res => {permissions.value = res.data});

    const setDeletePermissionId = (permissionId) => {
      // modal.value = true;
      deletePermissionId.value = permissionId;
    }
    const deletePermission = () => {
      const api = `access/v1/permission/${deletePermissionId.value}`;
      console.log(api);
      _.remove(permissions.value, {permissionId: deletePermissionId.value})
      console.log(permissions.value)
      modal.value = false
      // Https.delete(api).then(res => {
        // if(res.status === 200) {_.remove(permissions, {permissionId: permissionId})}
      // })
    }

    return {
      permissions,
      setDeletePermissionId,
      deletePermission,
      modal
    }
  },
  methods: {
    gotoCreatePermission(){
      this.$router.push("/permission/add")
    },
    gotoEditPermission(permission) {
      this.$router.push("/permission/edit", {...permission})
    }
  }
}
</script>
