<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-end xl:items-start mt-5">
      <div class="flex flex-col sm:flex-row xl:flex sm:mr-auto">
        <h2 class="text-lg font-medium mr-auto self-center">{{userPermission.roleName}} <ChevronRightIcon class="breadcrumb__icon" /> Permissions</h2>
        <a href="javascript:;" data-toggle="modal" data-target="#grant-permissions-modal" class="btn btn-primary ml-3">Grant Permissions</a>
      </div>
      <div id="access-list-filter-form" class="xl:flex">
        <div class="sm:flex items-center sm:mr-4 mt-2 xl:mt-0">
          <input
            id="access-list-filter-value"
            v-model="filter.value"
            type="text"
            class="form-control sm:w-40 xxl:w-full mt-2 sm:mt-0"
            placeholder="Search..."
            @input="onFilter"
          />
        </div>
      </div>
    </div>
    <div id="grant-permissions-modal" class="modal" tabindex="-1" aria-hidden="true">
     <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <!-- BEGIN: Modal Header -->
          <div class="modal-header">
            <h2 class="font-medium text-base mr-auto"> Grant Permissions to Role </h2>
          </div> <!-- END: Modal Header -->
          <div class="m-8">
            <label for="role-name" class="form-label">Available permission list</label>
            <div class="intro-y col-span-12 h-96 overflow-y-auto overflow-x-invisible bg-gray-200 p-1">
              <table class="table table-report">
                <thead>
                  <tr>
                    <th class="text-center"></th>
                    <th class="whitespace-nowrap">PERMISSION NAME</th>
                    <th class="whitespace-nowrap">URL</th>
                    <th class="text-center whitespace-nowrap">EXPIRE DATE</th>
                    <th class="text-center whitespace-nowrap">TYPE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(permission, permissionKey) in availablePermissions" :key="permissionKey" class="intro-x">
                    <td class="">
                      <input v-model="checkedPermissions" type="checkbox" :value="permission" class="form-check-input"/>
                    </td>
                    <td>{{$h.convertSnakeToString(permission.permissionName)}}</td>
                    <td>
                      <div class="text-gray-600 text-xs whitespace-nowrap mt-0.5"> {{ permission.resourceURI }}</div>
                    </td>
                    <td class="text-center">{{ !permission.validUntil ? "never expired" : "permission.validUntil" }}</td>
                    <td class="w-40">
                      <div class="flex items-center justify-center">
                        {{ permission.type }}
                      </div>
                    </td>
                    
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer text-right">
            <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-20 mr-1"> Cancel </button>
            <button type="button" data-dismiss="modal" class="btn btn-primary w-20" @click="grantPermissionsAdd(checkedPermissions)"> OK </button>
          </div> <!-- END: Modal Footer -->
        </div>

     </div>
    </div>
    <!-- BEGIN: Delete Role Confirm Modal Content -->
    <div id="remove-permission-confirm-modal" class="modal" tabindex="-1" aria-hidden="true">
     <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body p-0">
            <div class="p-5 text-center">
              <XCircleIcon class="w-16 h-16 text-theme-6 mx-auto mt-3" />
              <div class="text-3xl mt-5">Are you sure?</div>
              <div class="text-gray-600 mt-2"> Do you really want to Remove <span class="text-base font-bold text-red-900">{{preRemovePermission ? $h.convertSnakeToString(preRemovePermission.permissionName) : ''}}</span> Permission? <br />This process cannot be undone. </div>
            </div>
            <div class="px-5 pb-8 text-center">
              <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-24 dark:border-dark-5 dark:text-gray-300 mr-1"> Cancel </button>
              <button type="button" class="btn btn-danger w-24" @click="removePermission"> Remove </button>
            </div>
          </div>
        </div>
     </div>
    </div>
    <!-- END Delete Role Confirm Modal Content-->
    <div class="overflow-x-auto scrollbar-hidden">
      <div id="tabulator" ref="tableRef" class="mt-5 table-report table-report--tabulator"></div>
    </div>
  </div>
</template>

<script>

import { ref, reactive, onMounted, watch } from "vue";
import feather from "feather-icons";
import Tabulator from "tabulator-tables";
import { helper as $h } from "@/utils/helper";
import _ from "lodash";

export default {
  props: ['rolePermissions', 'permissionList', 'grantPermissionsDelete', 'grantPermissionsAdd'],
  setup(props) {
    
    const userPermission = ref(props.rolePermissions);
    const availablePermissions = ref(null);
    const preRemovePermission = ref(null);
    const tableRef = ref();
    const tabulator = ref();
    const filter = reactive({
      value: ""
    });
    const checkedPermissions = ref([]);

    watch(
      () => [props.rolePermissions, props.rolePermissions.permissions],
      () => {
        userPermission.value = props.rolePermissions;
        tabulator.value.setData(userPermission.value.permissions);
        const notAvailbleKey = _.map(props.rolePermissions.permissions, "permissionId");
        availablePermissions.value = props.permissionList.filter(item => !notAvailbleKey.includes(item.permissionId));
        checkedPermissions.value = [];
      }
    )

    const notAvailbleKey = _.map(props.rolePermissions.permissions, "permissionId");
    availablePermissions.value = props.permissionList.filter(item => !notAvailbleKey.includes(item.permissionId));

    const initTabulator = () => {
      tabulator.value = new Tabulator(tableRef.value, {
        data: userPermission.value.permissions,
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [10, 20, 30, 40],
        layout: "fitColumns",
        responsiveLayout: "collapse",
        placeholder: "No matching records found",
        columns: [
          {
            formatter: "responsiveCollapse",
            hozAlign: "center",
            resizable: false,
            headerSort: false
          },
          // For HTML table
          {
            title: "Permission Name",
            field: "permissionName",
            vertAlign: "middle",
            formatter(cell) {
              return `<div>
                <div class="font-medium whitespace-nowrap">${$h.convertSnakeToString(cell.getData().permissionName)}</div>
              </div>`;
            }
          },
          {
            title: "Type",
            field: "",
            minWidth: 50,
            maxWidth: 100,
            hozAlign: "center",
            vertAlign: "middle",
            formatter(cell) {
              return `<div>
                <div class="font-medium whitespace-nowrap">${cell.getData().type}</div>
              </div>`;
            }
          },
          {
            title: "ACTIONS",
            minWidth: 100,
            maxWidth: 150,
            field: "actions",
            responsive: 1,
            hozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            formatter(cell) {
              const a = cash(`<div class="flex lg:justify-center items-center">
                <a class="flex items-center text-theme-6" href="javascript:;" data-toggle="modal" data-target="#remove-permission-confirm-modal">
                  <i data-feather="trash-2" class="w-4 h-4 mr-1"></i> remove
                </a>
              </div>`);
              cash(a).on("click", function() {
                preRemovePermission.value = cell.getData();
              });

              return a[0];
            }
          },
        ],
        renderComplete() {
          feather.replace({
            "stroke-width": 1.5
          });
        }
      });
    };

    // Redraw table onresize
    const reInitOnResizeWindow = () => {
      window.addEventListener("resize", () => {
        tabulator.value.redraw();
        feather.replace({
          "stroke-width": 1.5
        });
      });
    };

    // Filter function
    const onFilter = () => {
      tabulator.value.setFilter("permissionName", "like", filter.value);
    };

    const removePermission = () => {
      props.grantPermissionsDelete(preRemovePermission.value);
      cash("#remove-permission-confirm-modal").modal("hide")
    }

    onMounted(() => {
      initTabulator();
      reInitOnResizeWindow();
    });

    return {
      userPermission,
      preRemovePermission,
      availablePermissions,
      checkedPermissions,
      tableRef,
      filter,
      onFilter,
      removePermission
    };
  },

};
</script>
