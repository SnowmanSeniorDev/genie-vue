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
        <AccessList v-if="roles" :rolePermissions="rolePermissions" :grantPermissions="grantPermissions" :permissionList="permissionList"/>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import AccessList from "./AccessList.vue";
import RoleList from "./RoleList.vue";
import Https from "@/plugins/axios";
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
      Https.get(permissionsAPI).then(res => {
        permissionList.value = res.data;
      })
    }
    const getRoles = () => {
      Https.get(rolesAPI).then(res => {
        roles.value = res.data;
        rolePermissions.value = res.data[0];
      })
    }
    
    getPermissions();
    getRoles();

    const selectRole = (roleId) => {
      console.log(roleId)
      rolePermissions.value = _.find(roles.value, {roleId: roleId});
    }
    const addRole = (role) => {
      Https.post(rolesAPI, role).then(res => {
        if(res.status === 201) getRoles();
      })
    }
    const deleteRole = (role) => {
      Https.delete(`${rolesAPI}/${role.roleId}`).then((res) => {
        if(res.status === 200) {
          console.log("11111")
          roles.value = _.remove(roles.value, function(item){
            return item.roleId != role.roleId;
          });
          if(!_.find(roles.value, {roleId: rolePermissions.value.roleId})) rolePermissions.value = roles.value[0];
        }
      })
    }
    const grantPermissions = (role) => {
      rolePermissions.value.permissions = _.remove(rolePermissions.value.permissions, function(item) {
        return item.permissionId != role.permissionId
      });
      const reqBody = {
        roleName: "different role name",
        permissionsIds: _.toArray(rolePermissions.value.permissions).map(function(item){
          return item.permissionId
        }),
        validUntil: rolePermissions.value.validUntil
      }
      Https.put(`${rolesAPI}/${rolePermissions.value.roleId}`, reqBody)
    }
    return {
      roles,
      permissionList,
      rolePermissions,
      selectRole,
      addRole,
      deleteRole,
      grantPermissions
    }
  },
}
</script>
