<template>
  <div>
    <div class="flex flex-col sm:flex-row mt-5">
      <div class="flex flex-col sm:flex-row xl:flex sm:mr-auto">
        <h2 class="text-lg font-medium mr-auto self-center">Roles</h2>
        <a href="javascript:;" data-toggle="modal" data-target="#add-new-role-modal" class="btn btn-primary ml-3">Add New Role</a>
      </div>
      <div id="tabulator-html-filter-form" class="xl:flex">
        <div class="sm:flex items-center sm:mr-4 mt-2 xl:mt-0">
          <input
            id="tabulator-html-filter-value"
            v-model="filter.value"
            type="text"
            class="form-control sm:w-40 xxl:w-full mt-2 sm:mt-0"
            placeholder="Search..."
            @input="onFilter"
          />
        </div>
      </div>
    </div>
    <!-- BEGIN: Add Role Modal Content -->
    <div id="add-new-role-modal" class="modal" tabindex="-1" aria-hidden="true">
     <div class="modal-dialog">
        <div class="modal-content">
          <!-- BEGIN: Modal Header -->
          <div class="modal-header">
            <h2 class="font-medium text-base mr-auto"> Add New Role </h2>
          </div> <!-- END: Modal Header -->
          <div class="m-8">
            <label for="role-name" class="form-label">User Role Name</label>
            <input id="role-name" v-model="newUserRole" type="text" class="form-control" placeholder="input user role name" /> 
          </div>
          <div class="modal-footer text-right">
            <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-20 mr-1"> Cancel </button>
            <button type="button" data-dismiss="modal" class="btn btn-primary w-20" @click="addUserRole"> Add </button>
          </div> <!-- END: Modal Footer -->
        </div>
     </div>
    </div>
    <!-- END: Add Role Modal Content -->
    <!-- BEGIN: Delete Role Confirm Modal Content -->
    <div id="delete-role-confirm-modal" class="modal" tabindex="-1" aria-hidden="true">
     <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body p-0">
            <div class="p-5 text-center">
              <XCircleIcon class="w-16 h-16 text-theme-6 mx-auto mt-3" />
              <div class="text-3xl mt-5">Are you sure?</div>
              <div class="text-gray-600 mt-2"> Do you really want to delete <span class="text-base font-bold text-red-900">{{preDeleteRole ? preDeleteRole.roleName : ''}}</span> Role? <br />This process cannot be undone. </div>
            </div>
            <div class="px-5 pb-8 text-center">
              <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-24 dark:border-dark-5 dark:text-gray-300 mr-1"> Cancel </button>
              <button type="button" class="btn btn-danger w-24" @click="thisDeleteRole"> Delete </button>
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

export default {
  props: ['roles', 'selectRole', 'addRole', 'deleteRole'],
  setup(props) {
    const tableRef = ref();
    const tabulator = ref();
    const newUserRole = ref('');
    const filter = reactive({
      value: ""
    });
    const preDeleteRole = ref(null);

    watch(
      () => props.roles,
      () => {
        tabulator.value.setData(props.roles)
      }
    )
    const initTabulator = () => {
      tabulator.value = new Tabulator(tableRef.value, {
        data: props.roles,
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
          {
            title: "Role Name",
            field: "roleName",
            vertAlign: "middle",
            cellClick: (e, cell) => props.selectRole(cell.getData().roleId),
            formatter(cell) {
              const a = cash(`<div>
                <div class="font-medium whitespace-nowrap">${cell.getData().roleName}</div>
              </div>`);
              return a[0]
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
                <a class="flex items-center text-theme-6" href="javascript:;" data-toggle="modal" data-target="#delete-role-confirm-modal">
                  <i data-feather="trash-2" class="w-4 h-4 mr-1"></i> Delete
                </a>
              </div>`);
              cash(a).on("click", function() {
                preDeleteRole.value = cell.getData();
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
      tabulator.value.setFilter("roleName", "like", filter.value);
    };

    const addUserRole = () => {
      var data = {
        "roleName": newUserRole.value, "permissionsIds": ["09faeab5-94fe-4f2c-2dfe-08d8e81e6e5d"], "validUntil": null
      }
      props.addRole(data)
    }

    const thisDeleteRole = () => {
      props.deleteRole(preDeleteRole.value);
      cash("#delete-role-confirm-modal").modal("hide")
    }
    onMounted(() => {
      initTabulator();
      reInitOnResizeWindow();
    });

    return {
      tableRef,
      newUserRole,
      preDeleteRole,
      filter,
      onFilter,
      addUserRole,
      thisDeleteRole
    };
  },
};
</script>
