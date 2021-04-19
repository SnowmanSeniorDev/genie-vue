<template>
  <div class="vue-pincode-input-wrapper">
    <input
      v-for="(cell, index) in cells"
      :key="cell.key"
      :ref="`${baseRefName}${index}`"
      v-model.trim="cell.value"
      v-bind="$attrs"
      class="vue-pincode-input"
      :type="cellsInputTypes[index]"
      @focus="focusedCellIdx = index"
      @keydown.delete="onCellErase(index, $event)"
      @keydown="onKeyDown"
    >
  </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  props: ['value', 'length', 'autofocus', 'secure', 'characterPreview', 'charPreviewDuration'],
  data: () => ({
    baseRefName: "vue3-pin-code",
    focusedCellIdx: 0,
    cells: [],
    watchers: {},
    cellsInputTypes: {},
  }),
  computed: {
    pinCodeComputed() {
      return this.cells.reduce((pin, cell) => pin + cell.value, '');
    },
  },
  watch: {
    value(value) {
      if (value) {
        this.onParentValueUpdated();
      } else {
        this.reset();
      }
    },
    length() {
      this.reset();
    },
    pinCodeComputed(val) {
      this.$emit('input', val);
    },
  },
  mounted() {
    this.init();
    this.onParentValueUpdated();
    if (this.autofocus) {
      this.$nextTick(this.focusCellByIndex);  
    }
  },
  methods: {
    /* init stuff */
    init() {
      const inputType = this.getRelevantInputType();
      for (let key = 0; key < this.length; key += 1) {
        this.setCellObject(key);
        this.setCellInputType(key, inputType);
        this.setCellWatcher(key);
      }
    },
    setCellObject(key) {
      console.log(key)
      // this.$set(this.cells, key, { key, value: '' });
    },
    setCellInputType(index, inputType = SECURE_INPUT_TYPE) {
      console.log(inputType)
      // this.$set(this.cellsInputTypes, index, inputType);
    },
    setCellWatcher(index) {
      const watchingProperty = `cells.${index}.value`;
      this.watchers[watchingProperty] = this.$watch(
        watchingProperty,
        (newVal, oldVal) => this.onCellChanged(index, newVal, oldVal),
      );
    },
    /* handlers */
    onParentValueUpdated() {
      // if (this.value.length !== this.length) {
      //   this.$emit('input', this.pinCodeComputed);
      //   return;
      // }
      // this.value.split('').forEach((cell, idx) => this.cells[idx].value = cell || '');
    },
    onCellChanged(index, newVal) {
      if (!this.isTheCellValid(newVal, false)) {
        this.cells[index].value = '';
        return;
      }
      this.focusNextCell();
      /* performing character preview if it's enabled */
      if (this.secure && this.characterPreview) {
        setTimeout(this.setCellInputType, this.charPreviewDuration, index);
      }
    },
    onCellErase(index, e) {
      const isThisCellFilled = this.cells[index].value.length;
      if (!isThisCellFilled) {
        this.focusPreviousCell();
        e.preventDefault();
      }
    },
    onKeyDown(e) {
      switch (e.keyCode) {
        /* left arrow key */
        case 37:
          this.focusPreviousCell();
          break;
        /* right arrow key */
        case 39:
          this.focusNextCell();
          break;
        default:
          break;
      }
    },
    /* reset stuff */
    reset() {
      this.unwatchCells();
      this.init();
      this.focusCellByIndex();
    },
    unwatchCells() {
      const watchers = Object.keys(this.watchers);
      watchers.forEach(name => this.watchers[name]());
    },
    /* helpers */
    isTheCellValid(cell, allowEmpty = true) {
      if (!cell) {
        return allowEmpty ? cell === '' : false;
      }
      return !!cell.match(CELL_REGEXP);
    },
    getRelevantInputType() {
      return this.secure && !this.characterPreview
        ? SECURE_INPUT_TYPE
        : DEFAULT_INPUT_TYPE;
    },
    focusPreviousCell() {
      if (!this.focusedCellIdx) return;
      this.focusCellByIndex(this.focusedCellIdx - 1);
    },
    focusNextCell() {
      if (this.focusedCellIdx === this.length - 1) return;
      this.focusCellByIndex(this.focusedCellIdx + 1);
    },
    focusCellByIndex(index = 0) {
      // const ref = `${this.baseRefName}${index}`;
      // const el = this.$refs[ref][0];
      // el.focus();
      // el.select();
      this.focusedCellIdx = index;
    },
  },
});
</script>

<style>
.vue-pincode-input-wrapper {
  display: inline-flex;
}
.vue-pincode-input {
  outline: none;
  margin: 3px;
  padding: 5px;
  max-width: 40px;
  text-align: center;
  font-size: 1.1rem;
  border: none;
  border-radius: 3px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
}
.vue-pincode-input:focus {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
}
</style>