<template>
  <div>
    <div class="intro-y flex items-center mt-8">
      <h2 class="text-lg font-medium mr-auto">Grant Access to Role</h2>
    </div>
    <!-- <div class="grid grid-cols-2 gap-4"> -->
    <div class="grid grid-cols-2 gap-6">
      <div class="box mt-5 px-5 pb-5">
        <RoleList v-if="roles" :roles="roles" :selectRole="selectRole" :addRole="addRole" :deleteRole="deleteRole"/>
      </div>
      <div class="box mt-5 px-5 pb-5">
        <AccessList v-if="roles" 
          :rolePermissions="rolePermissions" 
          :grantPermissionsDelete="grantPermissionsDelete" 
          :grantPermissionsAdd="grantPermissionsAdd" 
          :permissionList="permissionList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import AccessList from "./AccessList.vue";
import RoleList from "./RoleList.vue";
import { sysAxios } from "@/plugins/axios";
import _ from "lodash";

export default {
  name: 'GrantAccess',
  components: {
    RoleList,
    AccessList,
  },
  setup() {
    const permissionList = ref(null);
    const roles = ref(null);
    const rolePermissions = ref(null);
    const permissionsAPI = "access/v1/permission";
    const rolesAPI = "access/v1/role";
    const getPermissions = () => {
      sysAxios.get(permissionsAPI).then(res => {
        permissionList.value = res.data;
      })
    }
    const getRoles = () => {
      sysAxios.get(rolesAPI).then(res => {
        roles.value = res.data;
        rolePermissions.value = res.data[0];
      })
    }
    
    getPermissions();
    getRoles();

    const selectRole = (roleId) => {
      rolePermissions.value = _.find(roles.value, {roleId: roleId});
    }

    const addRole = (role) => {
      sysAxios.post(rolesAPI, role).then(res => {
        if(res.status === 201) getRoles();
      })
    }

    const deleteRole = (role) => {
      sysAxios.delete(`${rolesAPI}/${role.roleId}`).then((res) => {
        if(res.status === 200) {
          roles.value = _.remove(roles.value, function(item){
            return item.roleId != role.roleId;
          });
          if(!_.find(roles.value, {roleId: rolePermissions.value.roleId})) rolePermissions.value = roles.value[0];
        }
      })
    }

    const grantPermissionsDelete = (role) => {
      rolePermissions.value.permissions = _.remove(rolePermissions.value.permissions, function(item) {
        return item.permissionId != role.permissionId;
      });
      const reqBody = {
        roleName: rolePermissions.value.roleName,
        permissionsIds: _.toArray(rolePermissions.value.permissions).map(function(item){
          return item.permissionId
        }),
        validUntil: rolePermissions.value.validUntil
      }
      sysAxios.put(`${rolesAPI}/${rolePermissions.value.roleId}`, reqBody);
    }

    const grantPermissionsAdd = (addedPermission) => {
      const reqBody = {
        roleName: rolePermissions.value.roleName,
        permissionsIds: _.map([...rolePermissions.value.permissions, ...addedPermission], "permissionId"),
        validUntil: rolePermissions.value.validUntil
      }
      sysAxios.put(`${rolesAPI}/${rolePermissions.value.roleId}`, reqBody).then(res => {
        if(res.status === 200) rolePermissions.value.permissions = [...rolePermissions.value.permissions, ...addedPermission]
      });
    }

    return {
      roles,
      permissionList,
      rolePermissions,
      selectRole,
      addRole,
      deleteRole,
      grantPermissionsDelete,
      grantPermissionsAdd
    }
  },
}
</script>
