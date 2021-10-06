<template>
  <div>
    <vueJsonEditor
      :value="this.jsonData"
      :mode="this.mode"
      :modes="this.modes"
      :show-btns="this.showBtns"
      :exapndedOnStart="this.expandedOnStart"
      @json-change="changeJsonData($event)"
    >

    </vueJsonEditor>
  </div>
</template>

<script>
import vueJsonEditor from "vue-json-editor";
export default {
  components: {
    vueJsonEditor
  },
  props: {
    modelValue: [String, Number, Object, Array],
    showBtns: [Boolean],
    expandedOnStart: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: "tree"
    },
    modes: {
      type: Array,
      default: function() {
        return ["tree", "code", "form", "text", "view"];
      }
    },
    lang: {
      type: String,
      default: "en"
    }
  },
  watch: {
    value() {
      this.jsonData = this.modelValue
    }
  },
  data() {
    return {
      jsonData: this.modelValue,
    };
  },
  methods: {
    changeJsonData(e) {
      this.$emit("update:modelValue", e);
    }
  }
};
</script>
