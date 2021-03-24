<template>
  <div>
    <div class="intro-y flex items-center mt-8">
      <h2 class="text-lg font-medium mr-auto">Create User</h2>
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
                    Permission Name
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
                  </label>
                  <input
                    id="validation-form-1"
                    v-model.trim="validate.permissionName.$model"
                    type="text"
                    name="permissionName"
                    class="form-control"
                    :class="{ 'border-theme-6': validate.permissionName.$error }"
                    placeholder="John Legend"
                  />
                  <template v-if="validate.permissionName.$error">
                    <div
                      v-for="(error, index) in validate.permissionName.$errors"
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
                    v-model.trim="validate.resourceUrl.$model"
                    type="text"
                    name="resourceUrl"
                    class="form-control"
                    :class="{ 'border-theme-6': validate.resourceUrl.$error }"
                    placeholder="John Legend"
                  />
                  <template v-if="validate.resourceUrl.$error">
                    <div
                      v-for="(error, index) in validate.resourceUrl.$errors"
                      :key="index"
                      class="text-theme-6 mt-2"
                    >
                      {{ error.$message }}
                    </div>
                  </template>
                </div>
                <div class="input-form mt-3">
                  <label for="validation-form-3" class="form-label w-full flex flex-col sm:flex-row">
                    Access Verbs
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
                  </label>
                </div>
                <div class="input-form mt-3">
                  <label for="validation-form-4" class="form-label w-full flex flex-col sm:flex-row">
                    Valid Until
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required Date Format</span>
                  </label>
                  <div class="flex items-center">
                    <div>
                      <div class="relative w-56">
                        <div class="absolute rounded-l w-10 h-full flex items-center justify-center bg-gray-100 border text-gray-600 dark:bg-dark-1 dark:border-dark-4">
                          <CalendarIcon class="w-4 h-4" />
                        </div>
                        <Litepicker
                          v-model="date"
                          :options="{
                            autoApply: false,
                            showWeekNumbers: true,
                            dropdowns: {
                              minYear: 1990,
                              maxYear: null,
                              months: true,
                              years: true
                            }
                          }"
                          class="form-control pl-12"
                          aria-disabled="true"
                        />
                      </div>
                    </div>
                    <div class="form-check ml-5">
                      <input id="un-expire-date" class="form-check-input" type="checkbox" value="" />
                      <label class="form-check-label" for="un-expire-date">Unexpired</label>
                    </div>
                  </div>
                </div>
                <div class="input-form mt-3">
                  <label for="validation-form-5" class="form-label w-full flex flex-col sm:flex-row">
                    Type
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
                  </label>
                  <div class="flex flex-col sm:flex-row mt-2">
                      <div class="form-check mr-2">
                        <input id="type-1" class="form-check-input" type="radio" name="horizontal_radio_button" value="horizontal-radio-chris-evans" />
                        <label class="form-check-label" for="type-1">Menu</label>
                      </div>
                      <div class="form-check mr-2 mt-2 sm:mt-0">
                        <input id="type-2" class="form-check-input" type="radio" name="horizontal_radio_button" value="horizontal-radio-liam-neeson" />
                        <label class="form-check-label" for="type-2">API</label>
                      </div>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary mt-5">Create Permission</button>
              </form>
              <!-- END: Validation Form -->
              <!-- BEGIN: Success Notification Content -->
              <div id="success-notification-content" class="toastify-content hidden flex">
                <CheckCircleIcon class="text-theme-9" />
                <div class="ml-4 mr-4">
                  <div class="font-medium">Create success!</div>
                  <div class="text-gray-600 mt-1">Successfully create new permission</div>
                </div>
              </div>
              <!-- END: Success Notification Content -->
              <!-- BEGIN: Failed Notification Content -->
              <div id="failed-notification-content" class="toastify-content hidden flex">
                <XCircleIcon class="text-theme-6" />
                <div class="ml-4 mr-4">
                  <div class="font-medium">Create failed!</div>
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
import { required, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import Https from "@/plugins/axios";
import Toastify from "toastify-js";

export default {
  setup() {
    const formData = reactive({
      permissionName: "",
      resourceUrl: "",
    });
    const rules = {
      permissionName: { required, minLength: minLength(2) },
      resourceUrl: { required, minLength: minLength(2)},
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
        const api = "/user/v1";
        Https.post(api, {
          userName: formData.userName,
          secret: formData.password,
          emailAddress: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          displayName: formData.displayName
        }).then(res => {
          console.log(res);
          if(res.status === 201){
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
