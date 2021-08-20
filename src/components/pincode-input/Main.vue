<template>
  <div>
    <div class="vue-pincode-input-wrapper">
      <input class="vue-pincode-input" :ref="el => cells[0] = el" v-model.trim="code[0]" @focus="focusedCellIdx = 0" @keydown.delete="onCellErase(0, $event)" autofocus maxlength="1" @keydown="onKeyDown"/>
      <input class="vue-pincode-input" :ref="el => cells[1] = el" v-model.trim="code[1]" @focus="focusedCellIdx = 1" @keydown.delete="onCellErase(1, $event)" maxlength="1" @keydown="onKeyDown"/>
      <input class="vue-pincode-input" :ref="el => cells[2] = el" v-model.trim="code[2]" @focus="focusedCellIdx = 2" @keydown.delete="onCellErase(2, $event)" maxlength="1" @keydown="onKeyDown"/>
      <label class="flex items-center"><MinusIcon class="w-4 h-4" /></label>
      <input class="vue-pincode-input" :ref="el => cells[3] = el" v-model.trim="code[3]" @focus="focusedCellIdx = 3" @keydown.delete="onCellErase(3, $event)" maxlength="1" @keydown="onKeyDown"/>
      <input class="vue-pincode-input" :ref="el => cells[4] = el" v-model.trim="code[4]" @focus="focusedCellIdx = 4" @keydown.delete="onCellErase(4, $event)" maxlength="1" @keydown="onKeyDown"/>
      <input class="vue-pincode-input" :ref="el => cells[5] = el" v-model.trim="code[5]" @focus="focusedCellIdx = 5" @keydown.delete="onCellErase(5, $event)" maxlength="1" @keydown="onKeyDown"/>
    </div>
  </div>
</template>

<script>
// import { computed, ref, onMounted, $emit, watch } from "vue";
import { computed, ref, onMounted, watch } from "vue";
export default {
  props: ['modelValue'],
  setup(props, { emit }) {
    const focusedCellIdx = ref(0);
    const code = ref([]);
    const cells = ref([])

    const codeString = computed({
      get: () => code.value.join(''),
      set: (val) => {
        code.value = val.split('')
      }
    })

    onMounted(() => {
      codeString.value = props.modelValue
    })

    const onKeyDown = (e) => {
      switch (e.keyCode) {
        /* left arrow key */
        case 37:
          focusPreviousCell();
          break;
        /* right arrow key */
        case 39:
          focusNextCell();
          break;
        default:
          break;
      }
    }

    const focusPreviousCell = () => {
      if (!focusedCellIdx.value) return;
      focusCellByIndex(focusedCellIdx.value - 1);
    }

    const focusNextCell = () => {
      if (focusedCellIdx.value === 5) return;
      focusCellByIndex(focusedCellIdx.value + 1);
    }

    const focusCellByIndex = (index = 0) => {
      cells.value[index].focus();
      focusedCellIdx.value = index;
    }

    const onCellErase = (index, e) => {
      const isThisCellFilled = cells.value[index].value.length;
      if (!isThisCellFilled) {
        focusPreviousCell();
        e.preventDefault();
      }
    }

    // const onChangeCell = () => {
      // $emit("update:modelValue", codeString.value);
      // this.$emit("input", this.innerTags);
    // }

    watch(codeString, (newVal, oldVal) => {
      // console.log(codeString.value)
      if(newVal.length >= oldVal.length) focusNextCell()
      emit("update:modelValue", codeString.value)
    })

    return {
      code,
      cells,
      focusedCellIdx,
      onKeyDown,
      onCellErase
    }
  }
};
</script>

<style>
.vue-pincode-input-wrapper {
  display: inline-flex;
}
.vue-pincode-input {
  outline: none;
  margin: 5px;
  padding: 7px;
  max-width: 45px;
  text-align: center;
  font-size: 1.5rem;
  /* border: none; */
  border-radius: 5px;
  border: 2px solid Gainsboro;
  /* box-shadow: 0 0 3px rgba(0, 0, 0, 0.5); */
}
.vue-pincode-input:focus {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
}
</style>