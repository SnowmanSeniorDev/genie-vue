<template>
  <div>
    <label for="password">Password</label>
    <input 
      placeholder="Enter your password"
      class="form-control py-3 px-4 border-gray-300 block"
      type="password"
      @input="password_check"
      v-model="validate.message" />
    <div class="intro-x w-full grid grid-cols-12 gap-4 h-1 mt-3">
      <div 
        class="col-span-4 h-full rounded bg-gray-200"
        :class="
          validate.strength == 'weak'
          ? 'bg-red-500'
          : validate.strength =='medium'
            ? 'bg-yellow-500'
            : 'bg-green-500'"
        ></div>
      <div
        class="col-span-4 h-full rounded bg-gray-200"
        :class="
          validate.strength == 'weak'
          ? 'bg-gray-500'
          : validate.strength =='medium'
            ? 'bg-yellow-500'
            : 'bg-green-500'"
      ></div>
      <div
        class="col-span-4 h-full rounded bg-gray-200"
        :class="
        validate.strength == 'weak'
        ? 'bg-gray-500'
        : validate.strength =='medium'
          ? 'bg-gray-500'
          : 'bg-green-500'"
        ></div>
    </div>
    <p class="frmValidation mt-2" :class="{'text-gray-500' : validate.message.length > 7}">
      <CheckIcon v-if="validate.message.length > 7" class="w-4 h-4 text-green-500"/>
      <XIcon v-else class="w-4 h-4 text-red-600"/>
       Longer than 7 characters
    </p>
    <p class="frmValidation" :class="{'text-gray-500' : validate.has_uppercase }">
      <CheckIcon v-if="validate.has_uppercase" class="w-4 h-4 text-green-500"/>
      <XIcon v-else class="w-4 h-4 text-red-600"/>
       Has a capital letter
    </p>
    <p class="frmValidation" :class="{'text-gray-500' : validate.has_lowercase }">
      <CheckIcon v-if="validate.has_lowercase" class="w-4 h-4 text-green-500"/>
      <XIcon v-else class="w-4 h-4 text-red-600"/>
     Has a lowercase letter
    </p>
    <p class="frmValidation" :class="{'text-gray-500' : validate.has_number }">
      <CheckIcon v-if="validate.has_number" class="w-4 h-4 text-green-500"/>
      <XIcon v-else class="w-4 h-4 text-red-600"/>
       Has a number
    </p>
    <p class="frmValidation" :class="{'text-gray-500' : validate.has_special }">
      <CheckIcon v-if="validate.has_special" class="w-4 h-4 text-green-500"/>
      <XIcon v-else class="w-4 h-4 text-red-600"/>
       Has a special character
    </p>
    
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    modelValue: String,
  },
  setup(props, context) {    
    const validate = ref({
      message: props.modelValue,
      has_number: false,
      has_lowercase: false,
      has_uppercase: false,
      has_special: false,
      strength: 'weak',
      clss: 'bg-red-500'
    })

    const password_check = () => {
      context.emit('update:modelValue', validate.value.message)
      validate.value.strength = passwordStrengthChecker(validate.value.message)
      validate.value.has_number    = /\d/.test(validate.value.message)
      validate.value.has_lowercase = /[a-z]/.test(validate.value.message)
      validate.value.has_uppercase = /[A-Z]/.test(validate.value.message)
      validate.value.has_special   = /[!@#\$%\^\&*\)\(+=._-]/.test(validate.value.message)
    }

    const passwordStrengthChecker = (str) => {
      let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
      let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')
      if(strongPassword.test(str)) {
        return 'strong'
      } else if(mediumPassword.test(str)) {
        return 'medium'
      } else {
        return 'weak'
      }
    }

    return {
      password_check,
      validate
    }
  },
}
</script>