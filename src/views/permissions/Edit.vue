<template>
  <div class="auth">
    <div class="intro-y flex items-center mt-8">
      <h2 class="text-lg font-medium mr-auto">Update Permission</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="intro-y col-span-12 lg:col-span-6">
        <!-- BEGIN: Form Validation -->
        <div class="intro-y box">
          <div id="form-validation" class="p-5">
            <div class="preview">
              <!-- BEGIN: Validation Form -->
              <form class="validate-form" @submit.prevent="create">
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
                    Resource Url
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
                  </label>
                  <input
                    id="validation-form-2"
                    v-model.trim="validate.resourceURI.$model"
                    type="text"
                    name="resourceUrl"
                    class="form-control"
                    :class="{ 'border-theme-6': validate.resourceURI.$error }"
                    placeholder="John Legend"
                  />
                  <template v-if="validate.resourceURI.$error">
                    <div
                      v-for="(error, index) in validate.resourceURI.$errors"
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
                  <div class="mt-2">
                    <TailSelect
                      v-model="validate.accessVerbs.$model"
                      name="accessVerb"
                      :options="{ search: true, descriptions: true, hideSelected: true, hideDisabled: true, multiLimit: 15, multiShowCount: false, multiContainer: true, classNames: 'w-full' }"
                      multiple>
                      <option value="Get">Get</option>
                      <option value="Post">Post</option>
                      <option value="Put">Put</option>
                      <option value="Delete">Delete</option>
                    </TailSelect>
                  </div>
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
                          v-model="validate.validUntil.$model"
                          name="validUntil"
                          :options="litePicker"
                          class="form-control pl-12"
                          aria-disabled="true"
                        />
                      </div>
                    </div>
                    <div class="form-check ml-5">
                      <input id="un-expire-date" v-model="validate.unExpired.$model" class="form-check-input" name="unExpired" type="checkbox" value="" />
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
                      <input id="type-1" v-model.trim="validate.type.$model" class="form-check-input" type="radio" name="type" value="Menu" />
                      <label class="form-check-label" for="type-1">Menu</label>
                    </div>
                    <div class="form-check mr-2 mt-2 sm:mt-0">
                      <input id="type-2" v-model.trim="validate.type.$model" class="form-check-input" type="radio" name="type" value="API" />
                      <label class="form-check-label" for="type-2">API</label>
                    </div>
                  </div>
                </div>
                
                <button type="submit" class="btn btn-primary mt-5" @click="save">Update Permission</button>
              </form>
              <!-- END: Validation Form -->
              <!-- BEGIN: Success Notification Content -->
              <div id="success-notification-content" class="toastify-content hidden flex">
                <CheckCircleIcon class="text-theme-9" />
                <div class="ml-4 mr-4">
                  <div class="font-medium">Update success!</div>
                  <div class="text-gray-600 mt-1">Successfully Update the permission</div>
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
import { sysAxios } from "@/plugins/axios";
import { required, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { helper } from "@/utils/helper";
import Toastify from "toastify-js";
import _ from "lodash"
import moment from "moment"

export default {
  setup() {
    const route = useRoute();
    const formData = reactive({
      permissionName: '',
      resourceURI: '',
      accessVerbs: [],
      validUntil: '',
      unExpired: false,
      type: ''
    });
    const rules = {
      permissionName: { required, minLength: minLength(2) },
      resourceURI: { required, minLength: minLength(2)},
      accessVerbs: { required },
      validUntil: { required },
      unExpired: {  },
      type: { required }
    };
    const validate = useVuelidate(rules, toRefs(formData));
    const litePicker = ref({
      autoApply: false,
      showWeekNumbers: true,
      minDate: new Date(),
      format: "D MMM, YYYY",
      dropdowns: {
        minYear: 1990,
        maxYear: null,
        months: true,
        years: true
      },
      setup: (picker) => {
        picker.on('button:apply', (date) => {
          formData.validUntil = helper.formatDate(date.dateInstance, "D MMM, YYYY")
        });
      },
    });
    const save = () => {
      console.log(formData);
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
        const api = `/access/v1/permission/${route.params.permissionId}`;
        sysAxios.put(api, {
          permissionName: formData.permissionName,
          resourceURI: formData.resourceURI,
          accessVerbs: formData.accessVerbs,
          validUntil: formData.unExpired ? null : moment(formData.validUntil).format(),
          type: formData.type,
        }).then(res => {
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
    onMounted(async () => {
      const api = "access/v1/permission"
      sysAxios.get(api).then(res => {
        const permission = _.find(res.data, {permissionId: route.params.permissionId})
        formData.accessVerbs = permission.accessVerbs
        formData.permissionName = permission.permissionName
        formData.resourceURI = permission.resourceURI
        formData.type = permission.type
        console.log(formData)
      });
    })

    return {
      litePicker,
      validate,
      formData,
      save
    };
  }
};
</script>
