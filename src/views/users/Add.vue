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
                    User Name
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
                  </label>
                  <input
                    id="validation-form-4"
                    v-model.trim="validate.userName.$model"
                    type="text"
                    name="userName"
                    class="form-control"
                    :class="{ 'border-theme-6': validate.userName.$error }"
                  />
                  <template v-if="validate.userName.$error">
                    <div
                      v-for="(error, index) in validate.userName.$errors"
                      :key="index"
                      class="text-theme-6 mt-2"
                    >
                      {{ error.$message }}
                    </div>
                  </template>
                </div>
                <div class="input-form mt-3">
                  <label for="validation-form-5" class="form-label w-full flex flex-col sm:flex-row">
                    Display Name
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
                  </label>
                  <input
                    id="validation-form-5"
                    v-model.trim="validate.displayName.$model"
                    type="text"
                    name="displayName"
                    class="form-control"
                    :class="{ 'border-theme-6': validate.displayName.$error }"
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
                <div class="input-form mt-3">
                  <label for="validation-form-6" class="form-label w-full flex flex-col sm:flex-row">
                    Password
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
                  </label>
                  <input
                    id="validation-form-6"
                    v-model.trim="validate.password.$model"
                    type="password"
                    name="password"
                    class="form-control"
                    :class="{ 'border-theme-6': validate.password.$error }"
                  />
                  <template v-if="validate.password.$error">
                    <div
                      v-for="(error, index) in validate.password.$errors"
                      :key="index"
                      class="text-theme-6 mt-2"
                    >
                      {{ error.$message }}
                    </div>
                  </template>
                </div>
                <div class="input-form mt-3">
                  <label for="validation-form-7" class="form-label w-full flex flex-col sm:flex-row">
                    Confirm Password
                    <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-gray-600">Required</span>
                  </label>
                  <input
                    id="validation-form-7"
                    v-model.trim="validate.confirmPassword.$model"
                    type="password"
                    name="confirmPassword"
                    class="form-control"
                    :class="{ 'border-theme-6': validate.confirmPassword.$error }"
                  />
                  <template v-if="validate.confirmPassword.$error">
                    <div
                      v-for="(error, index) in validate.confirmPassword.$errors"
                      :key="index"
                      class="text-theme-6 mt-2"
                    >
                      {{ error.$message }}
                    </div>
                  </template>
                </div>
                <button type="submit" class="btn btn-primary mt-5">Create User</button>
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
import { reactive, toRefs } from "vue";
import { required, minLength, email } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import Https from "@/plugins/axios";
import Toastify from "toastify-js";

export default {
  setup() {
    const formData = reactive({
      firstName: "",
      lastName: "",
      email: "",
      userName: "",
      displayName: "",
      password: "",
      confirmPassword: "",
    });
    const rules = {
      firstName: { required, minLength: minLength(2) },
      lastName: { required, minLength: minLength(2)},
      email: { required, email },
      userName: { required, minLength: minLength(6)},
      displayName: { required },
      password: { required, minLength: minLength(6) },
      confirmPassword: { required }
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
