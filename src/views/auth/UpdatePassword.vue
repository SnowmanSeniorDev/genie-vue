<template>
  <div>
    <div class="intro-y flex items-center mt-8">
      <h2 class="text-lg font-medium mr-auto">Update Password</h2>
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
                    Current Password
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
                  </label>
                  <input
                    id="validation-form-1"
                    v-model.trim="validate.currentPassword.$model"
                    type="password"
                    name="currentPassword"
                    class="form-control"
                    :class="{ 'border-theme-6': validate.currentPassword.$error }"
                    placeholder="John Legend"
                  />
                  <template v-if="validate.currentPassword.$error">
                    <div
                      v-for="(error, index) in validate.currentPassword.$errors"
                      :key="index"
                      class="text-theme-6 mt-2"
                    >
                      {{ error.$message }}
                    </div>
                  </template>
                </div>
                <div class="input-form mt-3">
                  <label for="validation-form-2" class="form-label w-full flex flex-col sm:flex-row">
                    New Password
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
                  </label>
                  <input
                    id="validation-form-2"
                    v-model.trim="validate.newPassword.$model"
                    type="password"
                    name="newPassword"
                    class="form-control"
                    :class="{ 'border-theme-6': validate.newPassword.$error }"
                    placeholder="John Legend"
                  />
                  <template v-if="validate.newPassword.$error">
                    <div
                      v-for="(error, index) in validate.newPassword.$errors"
                      :key="index"
                      class="text-theme-6 mt-2"
                    >
                      {{ error.$message }}
                    </div>
                  </template>
                </div>
                <button type="submit" class="btn btn-primary mt-5">Update Password</button>
              </form>
              <!-- END: Validation Form -->
              <!-- BEGIN: Success Notification Content -->
              <div id="success-notification-content" class="toastify-content hidden flex">
                <CheckCircleIcon class="text-theme-9" />
                <div class="ml-4 mr-4">
                  <div class="font-medium">Update success!</div>
                  <div class="text-gray-600 mt-1">The password successfully updated</div>
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
import { reactive, toRefs } from "vue";
import Https from "@/plugins/axios";
import { useStore } from "vuex";
import { required, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import Toastify from "toastify-js";


export default {
  setup() {
    const formData = reactive({
      currentPassword: "",
      newPassword: "",
    });
    const rules = {
      currentPassword: { required, minLength: minLength(6) },
      newPassword: { required, minLength: minLength(6)},
    };
    const validate = useVuelidate(rules, toRefs(formData));
    
    const store = useStore()

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
        console.log(store.state.auth.user_id);
        const api = `/user/v1/${store.state.auth.user_id}/updatesecret`;
        Https.put(api, {
          currentSecret: formData.currentPassword,
          newSecret: formData.newPassword,
        }).then(res => {
          console.log(res.data);
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
    };

    return {
      validate,
      formData,
      save
    };
  }
};
</script>
