<template>
  <div>
    <div class="intro-y flex items-center mt-8">
      <h2 class="text-lg font-medium mr-auto">Update User</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="intro-y col-span-12 lg:col-span-6">
        <!-- BEGIN: Form Validation -->
        <div class="intro-y box">
          <div id="form-validation" class="p-5">
            <div class="preview">
              <!-- BEGIN: Validation Form -->
              <form class="validate-form" @submit.prevent="save">
                <div class="input-form">
                  <label for="validation-form-1" class="form-label w-full flex flex-col sm:flex-row">
                    First Name
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
                  </label>
                  <input
                    id="validation-form-1"
                    v-model.trim="validate.firstName.$model"
                    type="text"
                    name="firstName"
                    class="form-control"
                    :class="{ 'border-theme-6': validate.firstName.$error }"
                    placeholder="John Legend"
                  />
                  <template v-if="validate.firstName.$error">
                    <div
                      v-for="(error, index) in validate.firstName.$errors"
                      :key="index"
                      class="text-theme-6 mt-2"
                    >
                      {{ error.$message }}
                    </div>
                  </template>
                </div>
                <div class="input-form mt-3">
                  <label for="validation-form-2" class="form-label w-full flex flex-col sm:flex-row">
                    Last Name
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
                  </label>
                  <input
                    id="validation-form-2"
                    v-model.trim="validate.lastName.$model"
                    type="text"
                    name="lastName"
                    class="form-control"
                    :class="{ 'border-theme-6': validate.lastName.$error }"
                    placeholder="John Legend"
                  />
                  <template v-if="validate.lastName.$error">
                    <div
                      v-for="(error, index) in validate.lastName.$errors"
                      :key="index"
                      class="text-theme-6 mt-2"
                    >
                      {{ error.$message }}
                    </div>
                  </template>
                </div>
                <div class="input-form mt-3">
                  <label for="validation-form-3" class="form-label w-full flex flex-col sm:flex-row">
                    Email
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required, email address format</span>
                  </label>
                  <input
                    id="validation-form-3"
                    v-model.trim="validate.email.$model"
                    type="email"
                    name="email"
                    class="form-control"
                    :class="{ 'border-theme-6': validate.email.$error }"
                    placeholder="example@gmail.com"
                  />
                  <template v-if="validate.email.$error">
                    <div
                      v-for="(error, index) in validate.email.$errors"
                      :key="index"
                      class="text-theme-6 mt-2"
                    >
                      {{ error.$message }}
                    </div>
                  </template>
                </div>
                <div class="input-form mt-3">
                  <label for="validation-form-4" class="form-label w-full flex flex-col sm:flex-row">
                    Display Name
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
                  </label>
                  <input
                    id="validation-form-4"
                    v-model.trim="validate.displayName.$model"
                    type="text"
                    name="displayName"
                    class="form-control"
                    :class="{ 'border-theme-6': validate.displayName.$error }"
                    placeholder="example@gmail.com"
                  />
                  <template v-if="validate.displayName.$error">
                    <div
                      v-for="(error, index) in validate.displayName.$errors"
                      :key="index"
                      class="text-theme-6 mt-2"
                    >
                      {{ error.$message }}
                    </div>
                  </template>
                </div>
                <div class="input-form mt-3" v-if="selectedRoles">
                  <label for="validation-form-5" class="form-label w-full flex flex-col sm:flex-row">
                    User Role
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
                  </label>
                  <TailSelect 
                    v-model="selectedRoles"
                    :options="{
                      search: true,
                      descriptions: true,
                      hideSelected: true,
                      hideDisabled: true,
                      multiLimit: 15,
                      multiShowCount: false,
                      multiContainer: true,
                      classNames: 'w-full' 
                    }"
                    multiple
                    >
                    <option v-for="role in roles" :key="role.roleId" :value="role.roleId">{{role.roleName}}</option>
                  </TailSelect>
                </div>
                <button type="submit" class="btn btn-primary mt-5">Update User</button>
              </form>
              <!-- END: Validation Form -->
              <!-- BEGIN: Success Notification Content -->
              <div id="success-notification-content" class="toastify-content hidden flex">
                <CheckCircleIcon class="text-theme-9" />
                <div class="ml-4 mr-4">
                  <div class="font-medium">Update success!</div>
                  <div class="text-gray-600 mt-1">Please check your e-mail for further info!</div>
                </div>
              </div>
              <!-- END: Success Notification Content -->
              <!-- BEGIN: Failed Notification Content -->
              <div id="failed-notification-content" class="toastify-content hidden flex">
                <XCircleIcon class="text-theme-6" />
                <div class="ml-4 mr-4">
                  <div class="font-medium">Update failed!</div>
                  <div class="text-gray-600 mt-1">Please check the fileld form.</div>
                </div>
              </div>
              <!-- END: Failed Notification Content -->
            </div>
          </div>
        </div>
        <!-- END: Form Validation -->
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Https from "@/plugins/axios";
import { required, minLength, email } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import Toastify from "toastify-js";

export default {
  setup() {
    const route = useRoute();
    const roles = ref([]);
    // const selectedRoles = ref(["d286270d-6cb3-4d35-6eeb-08d8e37d3cba", "93cf00f1-0fb5-40a1-f68b-08d8e9b63a35", "661dfade-2b95-48b3-e4c3-08d8eab473f8"]);
    const selectedRoles = ref([]);
    const authorizationId = ref('');
    const formData = reactive({
      firstName: "",
      lastName: "",
      email: "",
      displayName: "",
    });
    
    onMounted(() => {
      

      const authorizationApi = `access/v1/authorization/user/${route.params.id}`;
      Https.get(authorizationApi).then(res => {
        authorizationId.value = res.data.authorizationId
        res.data.roles.forEach(role => {
          selectedRoles.value.push(role.roleId);
        });

        const rolesApi = "access/v1/role";
        Https.get(rolesApi).then(res => {roles.value = res.data});
      })

      const userApi = "/user/v1/" + route.params.id;
      Https.get(userApi).then((res) => {
        formData.firstName = res.data.firstName,
        formData.lastName = res.data.lastName,
        formData.displayName = res.data.displayName,
        formData.email = res.data.emailAddress
      })
    })
    const rules = {
      firstName: { required, minLength: minLength(2) },
      lastName: { required, minLength: minLength(2)},
      email: { required, email },
      displayName: { required, minLength: minLength(6)},
    };
    const validate = useVuelidate(rules, toRefs(formData));
    const save = () => {
      validate.value.$touch();
      if (validate.value.$invalid) {
        Toastify({
          node: cash("#failed-notification-content").clone().removeClass("hidden")[0],
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true
        }).showToast();
      } else {
        const api = `/user/v1/${route.params.id}`;
        Https.put(api, {
          emailAddress: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          displayName: formData.displayName
        }).then(res => {
          if(res.status === 200){
            const api = `access/v1/authorization/${authorizationId.value}`;
            Https.put(api, {applicationDomain: "genie", roleIds: selectedRoles.value}).then(res => {
              if(res.status === 200){
                Toastify({
                  node: cash("#success-notification-content").clone().removeClass("hidden")[0],
                  duration: 3000,
                  newWindow: true,
                  close: true,
                  gravity: "top",
                  position: "right",
                  stopOnFocus: true
                }).showToast();
              }
            })
            
          }
        })
      }
    };

    return {
      validate,
      formData,
      save,
      selectedRoles,
      roles
    };
  }
};
</script>
